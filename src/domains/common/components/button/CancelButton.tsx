import RippleEffector from '@app/domains/common/containers/RippleEffector';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    classes?: { text?: string };
};

export default function CancelButton({ children, className, classes, ...props }: Props) {
    return (
        <button
            className={clsx(
                'font-set-sb13 inline-flex items-center justify-center overflow-hidden rounded-full border-[1.5px] border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500',
                className
            )}
            {...props}
        >
            <RippleEffector>
                <div className={twMerge('px-16 py-8', classes?.text)}>{children}</div>
            </RippleEffector>
        </button>
    );
}
