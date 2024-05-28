import { isBrowser } from '@app/utils/utils';
import { useMemo, useSyncExternalStore } from 'react';

type Options = {
    defaultMatches?: boolean;
};

const ServerMatchTrue = { matches: true };

const ServerMatchFalse = { matches: false };

export function useMediaQuery(query: string, { defaultMatches }: Options = { defaultMatches: false }) {
    query = query.replace(/^@media( ?)/m, '');

    const [getSnapshot, getServerSnapshot, subscribe] = useMemo(() => {
        const match = isBrowser() ? matchMedia(query) : null;
        const value = isBrowser() ? { matches: match!.matches } : ServerMatchFalse;

        return [
            () => value.matches,
            () => (defaultMatches ? ServerMatchTrue : ServerMatchFalse).matches,
            notify => {
                const handleChange = () => {
                    value.matches = matchMedia(query).matches;

                    notify();
                };

                match?.addListener(handleChange);

                return () => {
                    match?.removeListener(handleChange);
                };
            },
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
