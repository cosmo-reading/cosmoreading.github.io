import { useOneSignal } from '@app/libs/onesignal';
import type * as React from 'react';
import { useCallback } from 'react';

export default function PushNotificationsLink() {
    const { OneSignal, registered } = useOneSignal();

    const handleEnablePushNotifications = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();

            if (OneSignal) {
                await OneSignal.showNativePrompt();
            }
        },
        [OneSignal]
    );

    if (registered) {
        return null;
    }

    return (
        <a
            href="#"
            title="Enable push notifications"
            className="ml-[15px] text-[12px] font-semibold text-[#888] underline"
            onClick={handleEnablePushNotifications}
        >
            Enable push notifications
        </a>
    );
}
