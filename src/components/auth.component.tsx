import type { UserItem } from '@app/_proto/Protos/users';
import { AuthContext, retrieveUser, useAuth } from '@app/libs/auth';
import { GrpcError } from '@app/libs/grpc';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import produce from 'immer';
import type { User } from 'oidc-client-ts';
import { startTransition, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';

/**
 * Custom.
 */
export type AuthComponentProps = {
    children?: React.ReactNode;
};

const ServerAuth = {
    init: false,
    user: null as UserItem | null,
};

export default function AuthComponentWrapper({ children }: { children?: React.ReactNode }) {
    const { user, events, isAuthenticated, isLoading, removeUser } = useOidcAuth();
    const { setUser } = useAuth();

    const [subscribe, getSnapshot, getServerSnapshot] = useMemo(() => {
        let auth = { user: null as UserItem | null, init: false };

        return [
            notify => {
                const handleLoaded = async (user: User) => {
                    try {
                        const userInfo = await retrieveUser(user.access_token);

                        auth = produce(auth, recipe => {
                            recipe.user = userInfo;
                            recipe.init = true;
                        });

                        setUser(userInfo);

                        notify();
                    } catch (error) {
                        if (error instanceof GrpcError && error.status === GrpcStatusCode.UNAUTHENTICATED) {
                            removeUser();
                        }
                    }
                };

                const handleUnloaded = () => {
                    auth = produce(auth, recipe => {
                        recipe.user = null;
                        recipe.init = true;
                    });

                    setUser(null);

                    notify();
                };

                events.addUserLoaded(handleLoaded);
                events.addUserUnloaded(handleUnloaded);

                return () => {
                    events.removeUserLoaded(handleLoaded);
                    events.removeUserUnloaded(handleUnloaded);
                };
            },
            () => auth,
            () => auth,
        ];
    }, []);

    useEffect(() => {
        if (user) {
            events.load(user, true);
        } else if (!isLoading && !isAuthenticated) {
            events.unload();
        }
    }, [user, events, isLoading, isAuthenticated]);

    const userStore = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const [value, setValue] = useState({ user: null as UserItem | null, init: false });

    useEffect(() => startTransition(() => setValue(userStore)), [userStore]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
