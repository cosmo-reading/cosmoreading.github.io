import { useModal } from '@app/components/modal/context';
import type { GrpcClientType, GrpcError, GrpcObject, GrpcRequestFunc } from '@app/libs/grpc';
import { useLocalStorage } from '@app/libs/hooks';
import { useHttp } from '@app/libs/http';
import { isBrowser } from '@app/utils/utils';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import type { ServiceInfo } from '@protobuf-ts/runtime-rpc';
import {
    type FetchQueryOptions,
    type QueryFunction,
    type QueryFunctionContext,
    type QueryKey,
    type QueryStatus,
    type UseInfiniteQueryOptions,
    type UseQueryOptions,
    type UseQueryResult,
    useInfiniteQuery,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import {
    createContext,
    startTransition,
    useCallback,
    useContext,
    useDeferredValue,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLatest } from 'react-use';
import type { Updater } from 'use-immer';

//#region : Api version change management

/** Custom. Used to store/retrive api version. */
const ApiVersionKey = 'apiVersion';

/** Custom Type. Used for Api context. */
export type ApiType = {
    apiVersion: string | null;
};

type ApiContextType = [ApiType, (type: ApiType | Updater<ApiType> | null) => void];

const ApiContext = createContext<ApiContextType>([{ apiVersion: null }, () => {}]);

/** Custom. Api version context hook. */
export const useApi = () => useContext(ApiContext);

/** Custom. Manages the api version. Invalidates all the queries once a change has been detected. */
export function ApiProvider({ children }: { children?: React.ReactNode }) {
    const [{ apiVersion }, setApiVersion] = useLocalStorage<ApiType>(ApiVersionKey, { apiVersion: null });

    const prevVersion = useRef(apiVersion);
    const apiContext = useDeferredValue([{ apiVersion }, setApiVersion] as ApiContextType);

    const queryClient = useQueryClient();

    useEffect(() => {
        const prev = prevVersion.current;
        const currentVersion = apiVersion;
        prevVersion.current = currentVersion;

        if (prev && prev !== currentVersion) {
            console.log(`Detected API version change from ${prev} to ${currentVersion}`);
        }
    }, [apiVersion, queryClient]);

    return <ApiContext.Provider value={apiContext}>{children}</ApiContext.Provider>;
}

//#endregion : Api version change management

/**
 * Custom type.
 *
 * Used as options parameter type for 'useApiWithQuery'.
 */
export type ApiOptions<TReturn> = {
    initialData?: TReturn | (() => TReturn) | null;
    onExecute?: (...args: unknown[]) => Promise<TReturn>;
} & Omit<UseQueryOptions<TReturn, GrpcError>, 'queryKey' | 'queryFn'>;

export type ApiExecuteOptions<TResponse extends object> = {
    throwOnError?: boolean;
    onCompleted?: (data: TResponse) => void;
};

/**
 * Custom type.
 *
 * Used as options parameter type for 'useGrpcApiWithQuery'.
 */
export type GrpcApiOptions<TRequest, TReturn> = ApiOptions<TReturn> & {
    beforeExecute?: (request: TRequest) => void;
    mutateRequest?: (request: TRequest, ...args: unknown[]) => TRequest;
    refetchOnRequestChange?: boolean;
    showModalOnError?: boolean;
};

const NoRetryStatusCodes = [GrpcStatusCode.UNAUTHENTICATED, GrpcStatusCode.NOT_FOUND];

export type UseGrpcApiWithQueryResult<TResponse> = Omit<UseQueryResult<TResponse, GrpcError>, 'status'> & {
    status: QueryStatus | 'idle';
    invalidateQuery: () => Promise<void>;
    queryResult: UseQueryResult;
};

/**
 * Custom hook.
 *
 * Use it to make request to the new grpc api. Uses 'useQuery' internally.
 *
 * Read more about 'useQuery' here:
 * @link https://react-query.tanstack.com/reference/useQuery
 */
export const useGrpcApiWithQuery = <
    TClient extends ServiceInfo,
    TRequest,
    TResponse,
    TOptions extends GrpcApiOptions<GrpcObject<TRequest>, GrpcObject<TResponse>>,
>(
    Client: GrpcClientType<TClient>,
    resource: (client: TClient) => GrpcRequestFunc<GrpcObject<TRequest>, GrpcObject<TResponse>>,
    request: GrpcObject<TRequest>,
    args: QueryKey,
    options?: TOptions
): UseGrpcApiWithQueryResult<TResponse> & {
    data: TOptions extends { suspense: true } ? TResponse : TResponse | undefined;
} => {
    const { showError } = useModal();

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [{ apiVersion }, setApiVersion] = useApi();

    const { onExecute, enabled, mutateRequest, beforeExecute, refetchOnRequestChange, showModalOnError, ...restOpts } =
        options || ({} as TOptions);

    const { grpcRequest } = useHttp();

    const currentRequest = useRef(request);

    const queryClient = useQueryClient();

    const requestArgs = useMemo(() => (Array.isArray(args) ? args : [args]), [args]);

    const queryFn: QueryFunction<TResponse> = async ({ signal }) => {
        const mutatedRequest = mutateRequest?.(request, ...requestArgs) ?? request;

        beforeExecute?.(mutatedRequest);

        const executeResult = onExecute?.(...requestArgs);

        if (typeof executeResult !== 'undefined' && executeResult !== null) {
            return executeResult;
        }

        const response = await grpcRequest<TClient, GrpcObject<TRequest>, GrpcObject<TResponse>>(
            Client,
            resource,
            mutatedRequest,
            {},
            {
                abort: signal,
            }
        );

        const contentVersion = response.metadata['content-version'] as string;

        if (isBrowser() && contentVersion && contentVersion !== apiVersion) {
            startTransition(() =>
                setApiVersion({
                    apiVersion: contentVersion,
                })
            );
        }

        return response;
    };

    const doRetry = (count: number, error: GrpcError) => {
        if (
            NoRetryStatusCodes.includes(error.status) ||
            error.response?.description === 'An internal error has occurred' ||
            error.response?.metadata['type'] === 'internal' ||
            error.response?.metadata['type'] === 'maintenance'
        ) {
            return false;
        }

        const retry = options?.retry;

        if (typeof retry === 'number') {
            return count < retry;
        }
        if (typeof retry === 'function') {
            return retry(count, error);
        }

        return false;
    };

    const onError = async (err: GrpcError) => {
        const { onError } = restOpts;

        onError?.(err);

        if (err.response?.metadata['type'] === 'maintenance' && pathname !== '/maintenance') {
            navigate(
                {
                    pathname: '/maintenance',
                    search: new URLSearchParams({
                        returnUrl: pathname,
                    }).toString(),
                },
                {
                    replace: true,
                }
            );
        } else if (showModalOnError) {
            try {
                await showError(true, err);
            } catch (e) {
                // cancelled
            }
        }
    };

    const isEnabled = typeof enabled === 'undefined' ? true : enabled;

    const query = useQuery<TResponse, GrpcError>(args, queryFn, {
        ...restOpts,
        retry: doRetry,
        enabled: isEnabled,
        onError,
    });

    const invalidateQuery = useCallback(() => {
        return queryClient.invalidateQueries(requestArgs);
    }, [queryClient, requestArgs]);

    const status = query.fetchStatus === 'idle' ? query.fetchStatus : query.status;

    useEffect(() => {
        const oldRequest = currentRequest.current;

        currentRequest.current = request;

        if (isEnabled && refetchOnRequestChange && oldRequest !== request) {
            query.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchOnRequestChange, request, isEnabled]);

    return {
        ...query,
        data: query.data!,
        queryResult: query,
        status,
        isLoading: query.isLoading && query.fetchStatus !== 'idle',
        invalidateQuery,
    };
};

export const useGrpcApiWithRequest = <TClient extends ServiceInfo, TRequest extends object, TResponse extends object>(
    Client: GrpcClientType<TClient>,
    resource: (client: TClient) => GrpcRequestFunc<TRequest, TResponse>,
    request: TRequest,
    options?: ApiExecuteOptions<TResponse>
) => {
    const latestRequest = useLatest(request);
    const latestOptions = useLatest(
        options || {
            throwOnError: true,
        }
    );

    const [error, setError] = useState<GrpcError | Error | null>(null);
    const [response, setResponse] = useState<TResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const { grpcRequest } = useHttp();

    const executeRequest = useCallback(async () => {
        const req = latestRequest.current;
        const opts = latestOptions.current;

        setLoading(true);

        try {
            const resp = await grpcRequest<TClient, TRequest, TResponse>(Client, resource, req);

            setResponse(resp);

            opts.onCompleted?.(resp);

            return resp;
        } catch (e) {
            setError(e);

            if (opts.throwOnError) {
                throw e;
            }
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grpcRequest]);

    const reset = useCallback(() => {
        setResponse(null);
        setError(null);
    }, []);

    return {
        executeRequest,
        error,
        loading,
        response,
        reset,
    };
};

/**
 * Custom hook.
 *
 * Use it when you want to prefetch a query before it is needed or rendered.
 * The method works the same as 'useGrpcApiWithQuery' except that it will not throw or return any data.
 * Uses 'useQueryClient' internally with 'prefetchQuery' function.
 *
 * Read more about 'useQueryClient' and 'prefetchQuery' here:
 * @link https://react-query.tanstack.com/reference/useQueryClient
 * @link https://react-query.tanstack.com/reference/QueryClient#queryclientprefetchquery
 */
export const usePrefetchGrpcApiWithQuery = <
    TClient extends ServiceInfo,
    TRequest extends object,
    TResponse extends object,
>(
    Client: GrpcClientType<TClient>,
    resource: (client: TClient) => GrpcRequestFunc<TRequest, TResponse>,
    request: TRequest,
    args: QueryKey,
    options?: FetchQueryOptions<TResponse, GrpcError>
) => {
    const { grpcRequest } = useHttp();
    const client = useQueryClient();

    const queryFn = useCallback(async (): Promise<TResponse> => {
        const response = await grpcRequest<TClient, TRequest, TResponse>(Client, resource, request);

        return response;
    }, [Client, grpcRequest, request, resource]);

    const callback = useCallback(() => {
        return client.prefetchQuery(args, queryFn, options);
    }, [args, client, options, queryFn]);

    return callback;
};

/**
 * Custom type.
 *
 * Used as options parameter type for 'useGrpcApiWithInfiniteQuery'.
 */
export interface GrpcApiInfiniteOptions<TRequest, TReturn> extends UseInfiniteQueryOptions<TReturn, GrpcError> {
    onExecute?: (...args: unknown[]) => Promise<TReturn>;
    mutateRequest?: (request: TRequest, pageParam: any, ...args: unknown[]) => TRequest;
    refetchOnRequestChange?: boolean;
}

/**
 * Custom hook.
 *
 * Use it when you want to render lists that can additively "load more"
 * data onto an existing set of data or "infinite scroll".
 *
 * Read more about 'useInfiniteQuery' here:
 * @link https://react-query.tanstack.com/guides/infinite-queries
 */
export const useGrpcApiWithInfiniteQuery = <
    TClient extends ServiceInfo,
    TRequest extends object,
    TResponse extends object,
>(
    Client: GrpcClientType<TClient>,
    resource: (client: TClient) => GrpcRequestFunc<TRequest, TResponse>,
    request: TRequest,
    args: QueryKey,
    options?: GrpcApiInfiniteOptions<TRequest, TResponse>
) => {
    const { onExecute, enabled, mutateRequest, refetchOnRequestChange, ...restOpts } = options || {};
    const { grpcRequest } = useHttp();

    const currentRequest = useRef(request);

    const queryFn: QueryFunction<TResponse> = async ({ pageParam }: QueryFunctionContext<QueryKey, any>) => {
        const requestArgs = Array.isArray(args) ? args : [args];

        const mutatedRequest = mutateRequest?.(request, pageParam, ...requestArgs) ?? request;
        const executeResult = onExecute?.(...requestArgs);

        if (typeof executeResult !== 'undefined' && executeResult !== null) {
            return executeResult;
        }

        const response = await grpcRequest<TClient, TRequest, TResponse>(Client, resource, mutatedRequest);

        return response;
    };

    const isEnabled = typeof enabled === 'undefined' ? true : enabled;

    const query = useInfiniteQuery(args, queryFn, {
        ...restOpts,
        enabled: isEnabled,
    });

    useEffect(() => {
        const oldRequest = currentRequest.current;

        currentRequest.current = request;

        if (isEnabled && refetchOnRequestChange && oldRequest !== request) {
            query.remove();
            query.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refetchOnRequestChange, request, isEnabled]);

    return query;
};
