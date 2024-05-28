import PlaceholderComponent from '@app/components/placeholder';
import { useChips } from '@app/domains/common/hooks/useChips';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const CHIP_HOVER_STYLE = 'text-blue-600 dark:text-blue-500 ring-blue-600 dark:ring-blue-500';

const CHIP_STYLE = clsx(
    'inline-flex items-center justify-center cursor-pointer duration-300',
    'text-gray-t1 with-hover:hover:text-blue-600 with-hover:dark:hover:text-blue-500', // font
    'bg-gray-container-base', // bg
    'ring-inset ring-1 ring-transparent with-hover:hover:ring-blue-600 with-hover:dark:hover:ring-blue-500' // ring
);

type ChipProps = {
    label?: string;
    isLoading?: boolean;
    selected?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Chips({ className, label, isLoading, selected, ...props }: ChipProps) {
    const { gap } = useChips();

    return (
        <div style={gap ? { marginTop: `${gap}px`, marginLeft: `${gap}px` } : {}}>
            <PlaceholderComponent item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
                <div
                    className={twMerge(CHIP_STYLE, selected && CHIP_HOVER_STYLE, 'rounded-6 px-10 py-8', className)}
                    {...props}
                >
                    {label}
                </div>
            </PlaceholderComponent>
        </div>
    );
}
