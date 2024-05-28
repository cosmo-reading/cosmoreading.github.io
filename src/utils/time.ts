import { Timestamp } from '@app/_proto/google/protobuf/timestamp';
import { timestampToUnix } from '@app/libs/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { startTransition, useEffect, useMemo, useState } from 'react';

dayjs.extend(relativeTime);

/**
 * Custom type.
 *
 * Parameter type used by useTimeAgo custom hook.
 */
export type TimeOptions = {
    refreshInterval?: number;
};

/**
 * Custom.
 *
 * Default options for TimeOptions type.
 * Refresh interval defaults to 1 minute.
 */
const DefaultTimeOptions: TimeOptions = {
    refreshInterval: 1000 * 60,
};

/**
 * Custom hook.
 *
 * Converts the give unix time into '*** time ago. E.g. '3 hours ago'.
 *
 * It also provides option to refresh the displayed time at a given interval.
 * Defaults to 1 minute. Pass '0' as refreshInterval to never refresh it.
 */
export function useTimeAgo(unix: number | Timestamp | null | undefined, options?: TimeOptions) {
    const opts = useMemo(
        () => ({
            ...DefaultTimeOptions,
            ...(options || {}),
        }),
        [options]
    );

    const value = useMemo(() => {
        if (!unix) {
            return null;
        }

        let timestamp: number;

        if (Timestamp.is(unix)) {
            timestamp = timestampToUnix(unix)!;
        } else {
            timestamp = unix;
        }

        return dayjs.unix(timestamp);
    }, [unix]);

    const [timeAgo, setTimeAgo] = useState(() => (value?.isValid() ? value.fromNow() : null));

    useEffect(() => {
        if (!value || !value.isValid() || !opts.refreshInterval || opts.refreshInterval <= 0) {
            return;
        }

        const onInterval = () => startTransition(() => setTimeAgo(value?.fromNow()));

        const handle = setInterval(onInterval, opts.refreshInterval);

        return () => {
            clearInterval(handle);
        };
    }, [opts.refreshInterval, value]);

    useEffect(() => {
        if (value?.isValid()) {
            setTimeAgo(value.fromNow());
        }
    }, [value]);

    return timeAgo;
}
