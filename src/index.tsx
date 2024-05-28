// import './wdyr';
import 'abort-controller/polyfill';
import 'intersection-observer';

import { AppContext, AppRoutes } from '@app/App';
import { initAnalytics } from '@app/analytics';
import type { AppContextType } from '@app/components/context';
import { getOidcConfig } from '@app/libs/auth';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from 'react-oidc-context';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

declare global {
    interface Window {
        __REACT_QUERY_STATE__: string;
        __APP_CONTEXT__: any;
    }
}

initAnalytics();

import('@app/sentry').then(s => s.initSentry());

const rootElement = document.getElementById('root');

const cache = createCache({
    key: 'ww',
    prepend: true,
});
cache.compat = true;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 30, //cache for 30 minutes
            staleTime: 1000 * 60 * 30, //stales in 30 minutes
            retry: false,
        },
    },
});

// if (isBrowser()) {
//     broadcastQueryClient({
//         queryClient,
//         broadcastChannel: 'ww-app',
//     });
// }

const browserRouter = createBrowserRouter(AppRoutes);

if (rootElement && rootElement.hasChildNodes()) {
    const dehydratedState = window.__REACT_QUERY_STATE__;

    const appContext: AppContextType = window.__APP_CONTEXT__ ?? {
        themeName: 'dark',
    };

    hydrateRoot(
        rootElement as Element,
        <AppContext.Provider value={appContext}>
            <AuthProvider
                {...getOidcConfig()}
                onSigninCallback={() => window.history.replaceState({}, document.title, window.location.pathname)}
            >
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        <Hydrate state={dehydratedState}>
                            <CacheProvider value={cache}>
                                <RouterProvider router={browserRouter} />
                            </CacheProvider>
                        </Hydrate>
                    </QueryClientProvider>
                </HelmetProvider>
            </AuthProvider>
        </AppContext.Provider>
    );
} else if (rootElement) {
    createRoot(rootElement).render(
        <AppContext.Provider value={{ themeName: 'dark' }}>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <CacheProvider value={cache}>
                        <RouterProvider router={browserRouter} />
                    </CacheProvider>
                </QueryClientProvider>
            </HelmetProvider>
        </AppContext.Provider>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
