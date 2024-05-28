import { useEnhancedEffect } from '@app/utils/utils';
import { type ComponentType, useState } from 'react';

export default function WithNoSsr<T extends Record<string, any> = any>(Component: ComponentType<T>) {
    const NoSsrComponent = (args: T) => {
        const [mounted, setMounted] = useState(false);

        useEnhancedEffect(() => {
            setMounted(true);
        }, []);

        return mounted ? <Component {...args} /> : null;
    };

    return NoSsrComponent;
}
