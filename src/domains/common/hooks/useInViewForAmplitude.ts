import { type AllEvents, amplitudeHandler } from '@app/analytics/handlers';
import { useCallback, useRef } from 'react';
import { type InViewHookResponse, type IntersectionOptions, useInView } from 'react-intersection-observer';

type useInViewForAmplitudeParam = {
    event: AllEvents;
} & IntersectionOptions;

export default function useInViewForAmplitude({ event, ...options }: useInViewForAmplitudeParam): InViewHookResponse {
    const elRef = useRef<HTMLElement>();
    const { ref: inViewRef, ...inViewReturns }: InViewHookResponse = useInView({
        threshold: 0.3,
        ...options,
        onChange: inView => {
            if (inView) {
                amplitudeHandler(event, elRef.current);
            }
        },
    });

    const setRefs = useCallback(
        node => {
            elRef.current = node;
            inViewRef(node);
        },
        [inViewRef]
    );

    return { ...inViewReturns, ref: setRefs };
}
