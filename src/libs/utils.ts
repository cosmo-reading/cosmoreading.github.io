import { Duration } from '@app/_proto/google/protobuf/duration';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DecimalValue } from '../_proto/Protos/types';
import { Timestamp } from '../_proto/google/protobuf/timestamp';

/**
 * Custom.
 *
 * Use it when you want to update more than one state within callbacks to avoid
 * multiple re-renders.
 *
 * Explanation:
 *
 * By default, React batches updates made in a known method like the lifecycle methods
 * or event handlers, but doesn’t do the same when the updates are within callbacks
 * like in SetTimeout or Promises. This means that if you have multiple calls to update the state,
 * React re-renders the component each time the call is made.
 *
 * In this function, we are forcing React to make batched updates, hence causing only one re-render.
 */
export const batch = (callback: () => void): void => {
    return callback();
};

/**
 * Custom type.
 *
 * Used by 'useScrollTo' custom hook as parameter type.
 */
export type ScrollToOptions = {
    offset: number;
    onComplete?: () => void;
};

/**
 * Custom hook.
 *
 * Use it when you need to scroll using offset
 * and require to know when the scroll is complete.
 */
export const useScrollTo = ({ offset, onComplete }: ScrollToOptions) => {
    const [scrollActive, setScrollActive] = useState(false);

    const completeCallback = useRef(onComplete);
    completeCallback.current = onComplete;

    //The actual scroll trigger.
    const triggerScroll = useCallback(() => {
        setScrollActive(true);

        window.scrollTo({
            top: offset,
            behavior: 'smooth',
        });
    }, [offset]);

    //Listens to the scroll event
    //and calls the onComplete parameter function when it's done.
    useEffect(() => {
        const onScroll = () => {
            const fixedOffset = offset.toFixed();

            //We have reached the offset point
            if (window.pageYOffset.toFixed() === fixedOffset) {
                window.removeEventListener('scroll', onScroll);

                //Call the onComplete parameter function
                completeCallback.current?.();

                setScrollActive(false);
            }
        };

        if (scrollActive) {
            window.addEventListener('scroll', onScroll);
        }

        return () => {
            //Remove the event listener when component is unmounted
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', onScroll);
            }
        };
    }, [offset, scrollActive]);

    return {
        triggerScroll,
    };
};

/**
 * Custom hook.
 *
 * Use it when you need to keep track of whether
 * the UI has been rendered or not.
 */
export const useIsMounted = () => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    return isMounted.current;
};

/**
 * Custom type.
 *
 * Parameter type used by 'useEventCallback'
 */
type EventCallback<TResult, TArgs extends any[]> = (...args: TArgs) => TResult;

/**
 * Custom hook.
 *
 * Use it when you need to memoize a callback that has an inner function that has to be re-created too often.
 * Make sure that the callback isn't used during rendering.
 */
export const useEventCallback = <TResult, TArgs extends any[] = any[]>(cb: EventCallback<TResult, TArgs>) => {
    const ref = useRef(cb);

    useEffect(() => {
        ref.current = cb;
    });

    return useCallback((...args: TArgs) => ref.current(...args), [ref]);
};

/**
 * Custom.
 *
 * Nano factor for converting protobuf decimal to number
 * and number to decimal.
 */
const NanoFactor = 1_000_000_000;

/**
 * Custom.
 *
 * Converts protobuf type DecimalValue to number.
 */
export const decimalToNumber = (value: DecimalValue | undefined) => {
    if (!value) {
        return 0;
    }

    if (DecimalValue.is(value)) {
        return value.units + value.nanos / NanoFactor;
    }

    return 0;
};

/**
 * Custom.
 *
 * Converts number to protobuf type DecimalValue
 */
export const numberToDecimal = (value: number | null): DecimalValue | null => {
    if (value === null) {
        return null;
    }

    const units = Math.trunc(value);
    const nanos = Math.trunc(Number((value - units).toFixed(12)) * NanoFactor);

    const decimal = DecimalValue.create({
        units,
        nanos,
    });

    return decimal;
};

const DateFormat = new Intl.DateTimeFormat([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

export const formatTimestampForDisplay = (value: Timestamp | undefined) => {
    const dt = timestampToDate(value);

    if (!dt) {
        return null;
    }

    return DateFormat.format(dt);
};

/**
 * Custom.
 *
 * Converts protobuf type Timestamp to Date
 */
export const timestampToDate = (value: Timestamp | undefined) => {
    if (!value) {
        return null;
    }

    return Timestamp.toDate(value);
};

/**
 * Custom.
 *
 * Converts protobuf type Timestamp to unix epoch time.
 */
export const timestampToUnix = (value: Timestamp | undefined) => {
    if (!value) {
        return null;
    }

    return (value.seconds * 1000 + value.nanos / 1000000) / 1000;
};

export const durationToNumber = (value: Duration | undefined) => {
    if (!value) {
        return 0;
    }

    if (Duration.is(value)) {
        return value.seconds + value.nanos / 1_000_000;
    }

    return 0;
};

export const numberToDuration = (value: number | undefined) => {
    if (!value) {
        return null;
    }

    const seconds = Math.trunc(value);
    const nanos = Math.trunc(Number((value - seconds).toFixed(12)) * NanoFactor);

    const duration = Duration.create({
        seconds,
        nanos,
    });

    return duration;
};
