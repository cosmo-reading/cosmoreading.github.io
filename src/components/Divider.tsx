import { SCREEN_WIDTH } from '@app/domains/common/styles';
import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = { isFullScreen?: boolean } & HTMLAttributes<HTMLHRElement>;

export default function Divider({ className, isFullScreen, ...props }: Props) {
    return (
        <hr
            className={twMerge(
                'border-gray-line-base',
                isFullScreen && 'relative',
                isFullScreen && SCREEN_WIDTH,
                className
            )}
            {...props}
        />
    );
}
