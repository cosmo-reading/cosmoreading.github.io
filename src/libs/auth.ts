import { VipItem_VipType } from '@app/_proto/Protos/vips';
import { setSentryUser } from '@app/sentry';
import {
    InMemoryWebStorage,
    type User as OidcUser,
    type UserManagerSettings,
    WebStorageStateStore,
} from 'oidc-client-ts';
import { createContext, useCallback, useContext, useRef } from 'react';
import { useAuth as useContextAuth } from 'react-oidc-context';

import type { UserItem } from '../_proto/Protos/users';
import { UsersClient } from '../_proto/Protos/users.client';
import { Empty } from '../_proto/google/protobuf/empty';
import { logAnalyticsEvent, setAnalyticsUser } from '../analytics';
import { isBrowser } from '../utils/utils';
import { grpcRequest } from './grpc';

const getRedirectUri = (path: string) => {
    const url = new URL(typeof window === 'undefined' ? process.env.VITE_REACT_APP_SITE! : window.location.origin);

    url.pathname = path;

    return url.toString();
};

export const AUTHORITY = process.env.VITE_REACT_APP_AUTH_AUTHORITY!;
const CLIENT_ID = process.env.VITE_REACT_APP_AUTH_CLIENT_ID!;
const REDIRECT_URI = getRedirectUri('auth/callback/wuxiaworld');
const LOGOUT_REDIRECT_URI = getRedirectUri('auth/logout');
const SCOPES = 'openid profile api email offline_access';

export type AuthContextType = {
    user: UserItem | null;
    init: boolean;
};

export const AuthContext = createContext<AuthContextType>({ user: null, init: false });

/**
 * Custom.
 *
 * Used to store OpenID Connect config
 */
let config: UserManagerSettings | null = null;

export type AuthValues = {
    user: UserItem | null;
    idUser: OidcUser | null | undefined;
    init: boolean;
    loaded: boolean;
};

/**
 * Custom type.
 *
 * Used as part of the return type of 'useAuth'
 */
type AuthMethods = {
    login: (state?: string) => Promise<void>;
    setAuthInfo: (idUser: OidcUser) => Promise<void>;
    logout: () => Promise<boolean>;
    refreshUser: () => Promise<UserItem | null>;
    setUser: (user: UserItem | null) => void;
    getUser: () => Promise<OidcUser | null | undefined>;
};

/**
 * Custom function.
 *
 * OpenID Connect config.
 */
export const getOidcConfig = (): UserManagerSettings => {
    if (config) {
        return config;
    }

    config = {
        authority: AUTHORITY,
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        silent_redirect_uri: getRedirectUri('silent-refresh.html'),
        post_logout_redirect_uri: LOGOUT_REDIRECT_URI,
        response_type: 'code',
        response_mode: 'query',
        scope: SCOPES,

        popup_redirect_uri: REDIRECT_URI,
        popup_post_logout_redirect_uri: LOGOUT_REDIRECT_URI,

        filterProtocolClaims: true,
        automaticSilentRenew: true,
        includeIdTokenInSilentRenew: true,
        revokeTokensOnSignout: true,
        loadUserInfo: false,
        userStore: new WebStorageStateStore({ store: globalThis?.window?.localStorage ?? InMemoryWebStorage }),
        prompt: 'login',
    };

    return config!;
};

/**
 * Custom function.
 *
 * Retrieves user info stored in browser's local storage (if it exists)
 * by the site during auth
 */
export const getLocalUser = () => {
    const userJson = isBrowser() ? localStorage.getItem('user') : null;

    if (userJson) {
        const user: UserItem = JSON.parse(userJson);

        return user;
    }

    return null;
};
/**
 * Custom function.
 *
 * Login through OpenID Connect
 */
// const login = async () => {
//     if (!isBrowser()) {
//         return;
//     }

//     const um = userManager || (await getUserManager());

//     const width = 996;
//     const height = 730;
//     const left = window.screen.width / 2 - width / 2;
//     const top = window.screen.height / 2 - height / 2;

//     const idUser = await um.signinPopup({
//         popupWindowFeatures: `toolbar=no, location=no, width=${width}, height=${height}, top=${top}, left=${left}`,
//     });

//     return idUser;
// };

export const getRegisterUrl = () => {
    const url = new URL(AUTHORITY);
    url.pathname = '/account/register';

    if (typeof window !== 'undefined') {
        url.searchParams.set('returnUrl', `${window.location.protocol}//${window.location.host}`);
    }

    return url.toString();
};

export const getIdentityUrl = (path: string) => {
    const url = new URL(AUTHORITY);
    url.pathname = path;

    if (typeof window !== 'undefined') {
        url.searchParams.set('returnUrl', window.location.href);
    }

    return url.toString();
};

export const getAdminUrl = (path: string) => {
    const url = new URL(process.env.VITE_REACT_APP_ADMIN_BASE_URL!);
    url.pathname = path;

    return url.toString();
};

/**
 * Custom function.
 *
 * Makes server request to get user details.
 */
export const retrieveUser = async (accessToken: string): Promise<UserItem | null> => {
    const itemUser = await grpcRequest(UsersClient, c => c.getMyUser, Empty.create(), {
        authorization: `Bearer ${accessToken}`,
    });

    if (itemUser.item) {
        return itemUser.item;
    }

    return null;
};

/**
 * Custom hook.
 *
 * Use it to get logged in user's information
 * and access to auth methods and callbacks.
 */
const useAuth = (): AuthValues & AuthMethods => {
    const { user: wwUser, init } = useContext(AuthContext);
    const { user, isAuthenticated, events, isLoading, signinRedirect, signinSilent, signoutRedirect } =
        useContextAuth();

    const userPromise = useRef<Promise<OidcUser | null> | null>(null);

    const setUser = useCallback((user: UserItem | null) => {
        if (!user) {
            setAnalyticsUser(null, null);
            setSentryUser(null);

            localStorage.removeItem('user');
        } else {
            localStorage.setItem('user', JSON.stringify(user));

            if (user) {
                setSentryUser({
                    id: user.id,
                    username: user.userName,
                    email: user.email?.value,
                });

                setAnalyticsUser(user.id, {
                    Username: user.userName,
                    VIP: user.isVipActive && user.vip ? VipItem_VipType[user.vip.type] : undefined,
                    JoinDate: user.joinDate ? new Date(user.joinDate?.seconds * 1000) : undefined,
                    Email: user.email?.value,
                });
            }
        }
    }, []);

    const doSetAuthInfo = useCallback(
        async (idUser: OidcUser) => {
            if (idUser) {
                const userInfo = await retrieveUser?.(idUser.access_token!);

                if (!userInfo) {
                    return;
                }

                if (userInfo) {
                    setUser(userInfo);

                    logAnalyticsEvent('Login');
                }
            }
        },
        [setUser]
    );

    const doLogout = useCallback(async () => {
        logAnalyticsEvent('Logout');

        setUser(null);

        signoutRedirect({
            state: {
                returnPath: '/',
            },
        });

        return true;
    }, [setUser, signoutRedirect]);

    const refreshUser = useCallback(async () => {
        const idUser = await signinSilent();

        if (!idUser?.access_token) {
            return null;
        }

        const userInfo = await retrieveUser(idUser.access_token);

        if (!userInfo) {
            return null;
        }

        setUser(userInfo);

        return userInfo;
    }, [setUser, signinSilent]);

    const getUser = useCallback(() => {
        if (isAuthenticated && !user && !userPromise.current) {
            userPromise.current = new Promise<OidcUser>(resolve => {
                const handleUserLoaded = (user: OidcUser) => {
                    resolve(user);

                    events.removeUserLoaded(handleUserLoaded);
                };

                events.addUserLoaded(handleUserLoaded);
            });
        }

        return userPromise.current ?? Promise.resolve(user);
    }, [events, isAuthenticated, user]);

    const login = useCallback(
        async (state: string) => {
            const result = await signinRedirect({
                state: state || window.location.pathname,
            });

            return result;
        },
        [signinRedirect]
    );

    return {
        init,
        user: wwUser,
        idUser: user,
        loaded: !isLoading,
        setUser,
        setAuthInfo: doSetAuthInfo,
        logout: doLogout,
        refreshUser,
        getUser,
        login,
        // getIdUser,
    };
};

export { useAuth };
