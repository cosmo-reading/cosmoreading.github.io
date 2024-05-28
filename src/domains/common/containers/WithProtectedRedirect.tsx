import { LoadingFallback } from '@app/components/loading';
import { useAuth } from '@app/libs/auth';
import { type ComponentType, useEffect } from 'react';

type withProtectedRedirectOptions = {
    showLoading?: boolean;
};

export default function withProtectedRedirect<T extends Record<string, any>>(
    Component: ComponentType<T>,
    { showLoading = true }: withProtectedRedirectOptions = {}
) {
    const AuthRequiredComponent = (args: T) => {
        const { init, user, login } = useAuth();

        useEffect(() => {
            if (init && !user) {
                login();
            }
        }, [init, login, user]);

        if (!init || !user) {
            return showLoading ? <LoadingFallback displayType="indicator" /> : null;
        }

        return <Component {...args} />;
    };

    return AuthRequiredComponent;
}
