import cookie from 'cookie';
import { EventEmitter } from 'eventemitter3';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

const emitter = new EventEmitter();

const isBrowser = typeof window !== 'undefined';

type SetCookieOptions = {
    days?: number;
    path?: string;
};

export const setCookie = (name: string, value: string, options?: SetCookieOptions) => {
    if (!isBrowser) return;

    const { days, path } = {
        days: 7,
        path: '/',
        ...options,
    };

    const expires = new Date(Date.now() + days * 864e5);

    const serialized = cookie.serialize(name, value, {
        expires: expires,
        path,
    });

    document.cookie = serialized;
};

export const getCookie = (name: string, initialValue: string) => {
    if (!isBrowser) {
        return initialValue;
    }

    const parsedCookie = cookie.parse(document.cookie);

    return parsedCookie[name] ?? initialValue;
};

export default function useCookie(key: string, initValue: string) {
    const updateItem = useCallback(
        (value: string, options?: SetCookieOptions) => {
            setCookie(key, value, options);

            emitter.emit('cookie-update', { key, value });
        },
        [key]
    );

    const [subscribe, getSnapshot, getServerSnapshot] = useMemo(() => {
        const cookieVal = { value: getCookie(key, initValue) };

        return [
            cb => {
                const listener = (e: { key: string; value: string }) => {
                    if (e.key === key) {
                        cookieVal.value = e.value;

                        cb();
                    }
                };

                emitter.addListener('cookie-update', listener);

                return () => {
                    emitter.removeListener('cookie-update', listener);
                };
            },
            () => cookieVal.value,
            () => initValue,
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return { cookie: store, update: updateItem };
}
