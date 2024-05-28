import { useOneSignal } from '@app/libs/onesignal';
import { useEffect } from 'react';

export default function OneSignal() {
    const { registered, handleSubscriptionChange } = useOneSignal();

    useEffect(() => {
        if (registered !== null) {
            handleSubscriptionChange(registered);
        }
    }, [handleSubscriptionChange, registered]);

    return null;
}
