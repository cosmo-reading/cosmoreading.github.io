import PlaceholderComponent, { type PlaceholderProps } from '@app/components/placeholder';
import clsx from 'clsx';

export default function TabsTextPlaceholder({ className, children, ...rest }: PlaceholderProps) {
    return (
        <PlaceholderComponent className={clsx('bg-[#ffffff] dark:bg-[#2a2a2a]', className)} {...rest}>
            {children}
        </PlaceholderComponent>
    );
}
