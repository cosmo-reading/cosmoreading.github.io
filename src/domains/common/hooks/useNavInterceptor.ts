import { type MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * When navigating to route, it moves directly without updating the React state.
 * This hook enables navigation after reflecting the status update.
 */

type UseNavInterceptorParam = {
    to: string;
    from?: string;
};

type UseNavInterceptorReturn = {
    intercepted: boolean;
    intercept: (e: MouseEvent<HTMLElement>) => void;
};

export const useNavInterceptor = ({ to, from }: UseNavInterceptorParam): UseNavInterceptorReturn => {
    const [intercepted, setIntercepted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (intercepted) {
            navigate(to, { state: { from } });
        }
        return () => {
            setIntercepted(false);
        };
    }, [intercepted, navigate, to, from]);

    return {
        intercepted,
        intercept: e => {
            e.preventDefault();
            setIntercepted(true);
        },
    };
};
