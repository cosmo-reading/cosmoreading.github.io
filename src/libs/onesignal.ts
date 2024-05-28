import {
    DeletePushNotificationTokenRequest,
    PushNotificationType,
    RegisterPushNotificationTokenRequest,
} from '@app/_proto/Protos/notifications';
import { NotificationsClient } from '@app/_proto/Protos/notifications.client';
import { grpcRequest } from '@app/libs/grpc';
import { isBrowser } from '@app/utils/utils';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useAuth } from 'react-oidc-context';

type IOneSignal = typeof import('react-onesignal')['default'];

export const getOneSignal = async () => {
    if (process.env.SSR) {
        return null;
    }

    return (await import('react-onesignal')).default;
};

export const initOneSignal = () => {
    let status = 'loading';
    let oneSignal: IOneSignal | null = null;
    let promise: Promise<IOneSignal | null>;

    const appId = process.env.VITE_REACT_APP_ONESIGNAL_APP_ID;

    promise = new Promise<IOneSignal | null>((resolve, reject) => {
        (async () => {
            if (!appId || !isBrowser()) {
                resolve(null);

                return;
            }

            try {
                const OneSignal = await getOneSignal();

                if (OneSignal) {
                    await OneSignal.init({
                        appId,
                    });
                }

                resolve(OneSignal);
            } catch (e) {
                reject(e);
            }
        })();
    }).then(
        os => {
            oneSignal = os;

            status = 'loaded';

            return os;
        },
        () => {
            status = 'error';

            return null;
        }
    );

    return {
        read() {
            if (status === 'loading') {
                throw promise;
            } else if (status === 'error') {
                throw new Error('OneSignal init failed');
            } else {
                return oneSignal;
            }
        },
    };
};

const oneSignal = initOneSignal();

const ServerRegistered = null;

export const useOneSignal = () => {
    const { user } = useAuth();

    const OneSignal = oneSignal.read();

    const setupOneSignal = useCallback(async () => {
        if (OneSignal && user) {
            const enabled = await OneSignal.isPushNotificationsEnabled();

            if (enabled) {
                OneSignal.sendTags({ username: user.profile.name });
                OneSignal.setExternalUserId(user.profile.sub);
            }
        }
    }, [OneSignal, user]);

    const handleSubscriptionChange = useCallback(
        async (isSubscribed: boolean) => {
            if (!OneSignal) {
                return;
            }

            const userId = await OneSignal.getUserId();

            const idUser = user;

            if (!idUser) {
                return;
            }

            const metadata: Record<string, string> = {
                Authorization: `Bearer ${idUser?.access_token}`,
            };

            setupOneSignal();

            try {
                if (isSubscribed) {
                    const request = RegisterPushNotificationTokenRequest.create({
                        type: PushNotificationType.PushWeb,
                        token: userId!,
                    });

                    await grpcRequest(NotificationsClient, c => c.registerPushNotificationToken, request, metadata);
                } else {
                    const request = DeletePushNotificationTokenRequest.create({
                        token: userId!,
                    });

                    await grpcRequest(NotificationsClient, c => c.deletePushNotificationToken, request, metadata);
                }
            } catch (e) {
                // ignore
            }
        },
        [OneSignal, setupOneSignal]
    );

    const subscribeToChanges = useCallback(
        (cb: (registered?: boolean) => void) => {
            const handleInit = async () => {
                if (!OneSignal) {
                    return;
                }

                const registered = await OneSignal.isPushNotificationsEnabled();

                if (registered) {
                    cb(registered);

                    setupOneSignal();
                }
            };

            if (OneSignal) {
                OneSignal.on('subscriptionChange', cb);
            }

            handleInit();

            return () => {
                if (OneSignal) {
                    OneSignal.off('subscriptionChange', cb);
                }
            };
        },
        [OneSignal, setupOneSignal]
    );

    const [subscribe, getSnapshot, getServerSnapshot] = useMemo(() => {
        let registered: boolean | null = null;

        return [
            notify => {
                const cb = (enabled?: boolean) => {
                    registered = enabled ?? null;

                    notify(registered);
                };

                const remove = subscribeToChanges(cb);

                return () => remove();
            },
            () => registered,
            () => ServerRegistered,
        ];
    }, [subscribeToChanges]);

    const registered = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return {
        OneSignal,
        registered,
        handleSubscriptionChange,
    };
};
