import { useAuth } from '@app/libs/auth';
import { type GrpcClientType, GrpcError, type GrpcRequestFunc, grpcRequest } from '@app/libs/grpc';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import type { RpcOptions, ServiceInfo } from '@protobuf-ts/runtime-rpc';
import { useCallback } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
/**
 * Custom Hook.
 *
 * Use it when you want to directly handle the api request
 * and want to send user authentication token too.
 *
 * Use 'fetch' to deal with old API and use 'grpcRequest' to deal with, well, grpc :D
 */
export const useHttp = () => {
    const { getUser } = useAuth();
    const { removeUser } = useOidcAuth();

    const fetchImpl = useCallback(
        async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
            let requestHeaders: HeadersInit = {
                ...(init?.headers || {}),
                'Content-Type': 'application/json',
            };

            const user = await getUser();

            if (typeof input === 'string' && input.startsWith('/')) {
                input = `${process.env.VITE_REACT_APP_BASE_URL}${input}`;
            }

            if (typeof input === 'string' && input.startsWith(process.env.VITE_REACT_APP_BASE_URL!)) {
                if (user?.access_token) {
                    requestHeaders = {
                        Authorization: `Bearer ${user.access_token}`,
                        ...requestHeaders,
                    };
                }
            }

            const resp = await fetch(input, {
                ...init,
                headers: requestHeaders,
            });

            return (await resp.json()) as T;
        },
        [getUser]
    );

    /** Custom. */
    const grpcRequestImpl = useCallback(
        async <TClient extends ServiceInfo, TRequest extends object, TResponse extends object>(
            Client: GrpcClientType<TClient>,
            methodDefinition: (client: TClient) => GrpcRequestFunc<TRequest, TResponse>,
            request: TRequest,
            metadata: Record<string, string> | null = null,
            options?: RpcOptions
        ) => {
            let requestMetadata: Record<string, string> = metadata || {};

            const user = await getUser();

            if (user?.access_token) {
                requestMetadata = {
                    ...requestMetadata,
                    Authorization: `Bearer ${user.access_token}`,
                };
            }

            try {
                console.debug('Starting gRPC request', !process.env.SSR && request);

                const response = await grpcRequest<TClient, TRequest, TResponse>(
                    Client,
                    methodDefinition,
                    request,
                    requestMetadata,
                    options
                );

                let responseObj: TResponse | null = null;

                if (process.env.DEV) {
                    responseObj = response;
                }

                console.debug('gRPC request completed', !process.env.SSR && responseObj);

                return response;
            } catch (e) {
                console.debug('gRPC Request threw an error', e.response);

                // If we have an access token and we receive an unauthenticated response, logout the user
                // as the token has most likely expired

                if (e instanceof GrpcError && e.status === GrpcStatusCode.UNAUTHENTICATED) {
                    removeUser();
                }

                throw e;
            }
        },
        [getUser, removeUser]
    );

    return {
        fetch: fetchImpl,
        grpcRequest: grpcRequestImpl,
    };
};

//#region : Download File

/** Custom type. */
type ProgressEvent = { bytesRead: number; totalBytes: number };

/** Custom type. */
type ProgressEventCallback = (evt: ProgressEvent) => void;

/** Custom type. Used as parameter type by 'downloadFile' function. */
export type DownloadResult = {
    promise: Promise<void>;
    abort: () => void;
};

/**
 * Custom function.
 *
 * Use it when you want to download file from a given url and get download progress, if you need it.
 * Allows aborting the download.
 */
export const downloadFile = (url: string, fileName: string, onProgress?: ProgressEventCallback): DownloadResult => {
    const abortController = new AbortController();

    const promise = new Promise<void>((resolve, reject) => {
        (async () => {
            try {
                if ('showSaveFilePicker' in window) {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                    });

                    const resp = await fetch(url, {
                        signal: abortController.signal,
                    });

                    const size = ~~resp.headers.get('Content-Length')!;
                    const reader = resp.body!.getReader();

                    const writeStream = await handle.createWritable();

                    let bytesRead = 0;

                    const pump = () =>
                        reader.read().then(({ value, done }) => {
                            const chunkSize = value?.byteLength || 0;
                            bytesRead += chunkSize;

                            onProgress?.({ bytesRead, totalBytes: size });

                            return done ? writeStream.close() : writeStream.write(value!).then(pump);
                        });

                    await pump();

                    resolve();
                } else {
                    const a = document.createElement('a');
                    document.body.appendChild(a);

                    a.href = url;
                    a.download = fileName;

                    a.click();
                    a.remove();
                    resolve();
                }
            } catch (e) {
                if (e.name === 'AbortError') {
                    resolve();
                } else {
                    reject(e);
                }
            }
        })();
    });

    return {
        abort: () => abortController.abort(),
        promise,
    };
};
//#endregion : Download File
