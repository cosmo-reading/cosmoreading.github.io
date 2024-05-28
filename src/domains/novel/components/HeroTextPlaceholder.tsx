import PlaceholderComponent, { type PlaceholderProps } from '@app/components/placeholder';
import clsx from 'clsx';

export default function HeroTextPlaceholder({ className, children, ...rest }: PlaceholderProps) {
    return (
        <PlaceholderComponent
            className={clsx(
                'max-w-[100%] bg-transparent bg-[#e9e9e9] bg-gradient-to-r from-[#f1f1f1] to-[#e9e9e9] dark:bg-[#2a2a2a] dark:from-[#333] dark:to-[#2a2a2a] sm:mx-0',
                className
            )}
            {...rest}
        >
            {children}
        </PlaceholderComponent>
    );
}
