import { useEnhancedEffect } from '@app/utils/utils';
import { type ReactNode, useState } from 'react';

type Props = {
    children?: ReactNode;
    fallback?: ReactNode;
};

export default function NoSsr({ fallback, children }: Props) {
    const [mounted, setMounted] = useState(false);

    useEnhancedEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
