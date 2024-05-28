// Source: https://github.com/vercel/next.js/blob/b05719f928acc70c57c82978a9cb256bd93b0c61/packages/next/client/request-idle-callback.ts

type RequestIdleCallbackHandle = any;
// type RequestIdleCallbackOptions = {
//     timeout: number;
// };
type RequestIdleCallbackDeadline = {
    readonly didTimeout: boolean;
    timeRemaining: () => number;
};

export const requestIdleCallback =
    (typeof self !== 'undefined' && self.requestIdleCallback) ||
    ((cb: (deadline: RequestIdleCallbackDeadline) => void): NodeJS.Timeout => {
        const start = Date.now();

        return setTimeout(() => {
            cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
            });
        }, 1);
    });

export const cancelIdleCallback =
    (typeof self !== 'undefined' && self.cancelIdleCallback) || ((id: RequestIdleCallbackHandle) => clearTimeout(id));
