import { StyledAppDefaultMarginsClasses } from '@app/components/shared/app-main-container.styles';
import { useLocalStorage } from '@app/libs/hooks';
import { SignalWifiOff } from '@mui/icons-material';
import { Alert, Button } from '@mui/material';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { onlineManager } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';

type FallbackProps = {
    error: Error;
    componentStack: string | null;
    eventId: string | null;
    resetError(): void;
};

const isFatalError = (error: Error) => {
    return (
        error.name === 'ChunkLoadError' ||
        error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes('failed to asynchronously load component') ||
        error.message.includes(`'text/html' is not a valid JavaScript MIME type`) ||
        error.message.includes('Importing a module script failed') ||
        error.message.includes('error loading dynamically imported module')
    );
};

//#region : Helper local function components to reduce main component code length
/**
 * Default ErrorBoundaryFallback function component.
 */
function ErrorBoundaryFallback({ error, resetError }: FallbackProps) {
    //#region : Variables, functions and api calls

    //#region : Clear error when user navigates to another page
    const { pathname } = useLocation();

    const previousPathName = useRef(location.pathname);

    useEffect(() => {
        if (previousPathName.current !== pathname) {
            previousPathName.current = pathname;

            if (error) {
                resetError();
            }
        }
    }, [error, pathname, resetError]);
    //#endregion : Clear error when user navigates to another page

    //#region : Any other uncaught javascript error
    const handleReload = useCallback(() => {
        if (isFatalError(error)) {
            window.location.reload();
        } else {
            resetError();
        }
    }, [error, resetError]);
    //#endregion : Any other uncaught javascript error

    //#region : No internet
    //Show network error when internet is off.
    const [displayNetworkError, setDisplayNetworkError] = useState(!onlineManager.isOnline());

    useEffect(
        //Subscribe to network change and reset errorboundary when internet is back online
        () => {
            const remove = onlineManager.subscribe(() => {
                if (error && onlineManager.isOnline()) {
                    resetError();
                }

                setDisplayNetworkError(!onlineManager.isOnline());
            });

            return () => {
                remove();
            };
        },
        [error, resetError]
    );
    //#endregion : No internet

    //#endregion : Variables, functions and api calls

    //Damn... no internet connection :(
    //Show a polite message, don't be rude!
    if (displayNetworkError || error.name === 'NetworkError') {
        return (
            <>
                <Helmet defer={false}>
                    <title>Error! No internet</title>
                </Helmet>
                <div className="m-auto text-center">
                    <p className="content-dead-center">
                        <SignalWifiOff /> &nbsp; No internet connection.
                    </p>
                    <p>Sorry... we cannot load this page without internet.</p>
                    <p>We will be back as soon as the internet connection is back.</p>
                    <p>
                        <strong>See you soon :)</strong>
                    </p>
                </div>
            </>
        );
    }

    if (isFatalError(error)) {
        return null;
    }

    //We will be here if there is any other uncaught javascript error.
    //Show the alert component with 'Reload' button.
    return (
        <div className={StyledAppDefaultMarginsClasses}>
            <Alert variant="outlined" severity="error" action={<Button onClick={handleReload}>Reload</Button>}>
                <span className="text-base font-semibold">An error has occurred</span>
            </Alert>
            {error.message && (
                <div className="prose mt-[16px] w-full max-w-none dark:prose-invert">
                    <strong>Details:</strong>
                    <pre>{error.message}</pre>
                </div>
            )}
        </div>
    );
}
//#endregion : Helper local function components to reduce main component code length

//#region : Main component
//Main component parameters type
export type ErrorProps = {
    fallback?: React.ReactElement<FallbackProps>;
    children?: React.ReactNode;
};

/**
 * Custom helper component.
 *
 * Use it when you want to draw an error boundary around one or many componenent(s).
 * @link https://reactjs.org/docs/error-boundaries.html
 *
 * It handles any uncaught/unhandled javascript errors.
 * If there is no error, children of the component are returned.
 *
 * If there is error and fallback component is provided, return the fallback component.
 *
 * Otherwise, returned component is based on one of the following two scenarios:
 *
 * 1) If internet is disconnected, returns a message with an observer which will automatically
 * reload the component(s) when internent connection is back.
 *
 * 2) Returns an Alert component in case of any other unhandled javascript error with reload button.
 */
export function ErrorBoundary({ fallback, children }: ErrorProps) {
    const [fatalReloads, updateFatalReloads] = useLocalStorage(
        'fatal-errors',
        {
            count: 0,
        },
        {
            expiration: 5,
        }
    );

    const handleError = useCallback(
        (e: Error) => {
            if (isFatalError(e) && onlineManager.isOnline() && fatalReloads.count < 3) {
                // Reload when we have trouble loading a chunk.
                // When this error occurs, the most likely scenario is that a new version of the app
                // has been deployed and the old chunk has been deleted and is not cached

                updateFatalReloads(prev => {
                    prev.count = prev.count + 1;
                });

                window.location.reload();
            }

            console.error(e);
        },
        [fatalReloads.count, updateFatalReloads]
    );

    return (
        <SentryErrorBoundary
            fallback={fallback || (props => <ErrorBoundaryFallback {...props} />)}
            onError={handleError}
        >
            {children}
        </SentryErrorBoundary>
    );
}
//#endregion : Main component
