import { logAnalyticsEvent } from '@app/analytics';
import { useEffect } from 'react';
export interface UsePageVisitLogProps {
    logEventName?: string;
}

export default function usePageVisitLog({ logEventName }: UsePageVisitLogProps) {
    useEffect(() => {
        if (logEventName && typeof logEventName === 'string') {
            logAnalyticsEvent(logEventName);
        }
    }, [logEventName]);
}
