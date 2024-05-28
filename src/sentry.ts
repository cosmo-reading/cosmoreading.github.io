import { GrpcError } from '@app/libs/grpc';
import { ErrorBoundary, Integrations, init, setUser as setSentryUser } from '@sentry/react';

const sentryDsn = process.env.VITE_REACT_APP_SENTRY_DSN;

const initSentry = () => {
    if (sentryDsn && !process.env.SSR) {
        const isAffectedByIssue3388 = navigator.userAgent.includes('Chrome/74.0.3729');

        init({
            dsn: sentryDsn,
            release: process.env.VITE_REACT_APP_VERSION,
            integrations: [
                new Integrations.TryCatch({
                    requestAnimationFrame: !isAffectedByIssue3388,
                }),
            ],
            // Source: https://docs.sentry.io/platforms/javascript/guides/angular/configuration/filtering/#decluttering-sentry
            ignoreErrors: [
                // Random plugins/extensions
                'top.GLOBALS',
                // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
                'originalCreateNotification',
                'canvas.contentDocument',
                'MyApp_RemoveAllHighlights',
                'http://tt.epicplay.com',
                "Can't find variable: ZiteReader",
                'jigsaw is not defined',
                'ComboSearch is not defined',
                'http://loading.retry.widdit.com/',
                'atomicFindClose',
                // Facebook borked
                'fb_xd_fragment',
                // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
                // reduce this. (thanks @acdha)
                // See http://stackoverflow.com/questions/4113268
                'bmi_SafeAddOnload',
                'EBCallBackMessageReceived',
                // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
                'conduitPage',
                `'text/html' is not a valid JavaScript MIME type.`,
                /Blocked a restricted frame with origin/,
                'ResizeObserver loop limit exceeded',
                /Minified React error/,
            ],
            allowUrls: [process.env.VITE_REACT_APP_SITE!],
            denyUrls: [
                // Facebook flakiness
                /graph\.facebook\.com/i,
                // Facebook blocked
                /connect\.facebook\.net\/en_US\/all\.js/i,
                // Woopra flakiness
                /eatdifferent\.com\.woopra-ns\.com/i,
                /static\.woopra\.com\/js\/woopra\.js/i,
                // Chrome extensions
                /extensions\//i,
                /^chrome:\/\//i,
                // Other plugins
                /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
                /webappstoolbarba\.texthelp\.com\//i,
                /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
            ],
            beforeSend(event, hint) {
                const error = hint?.originalException;

                if (error instanceof GrpcError) {
                    return null;
                } else if (error instanceof Error) {
                    if (
                        error.name === 'AbortError' ||
                        error.name === 'ChunkLoadError' ||
                        error.message.includes('Failed to fetch dynamically imported module') ||
                        error.message.includes('failed to asynchronously load component') ||
                        error.message.includes(`'text/html' is not a valid JavaScript MIME type`) ||
                        error.message.includes('Importing a module script failed') ||
                        error.message.includes('error loading dynamically imported module')
                    ) {
                        return null;
                    }
                }

                return event;
            },
        });
    }
};

export { ErrorBoundary, setSentryUser, initSentry };
