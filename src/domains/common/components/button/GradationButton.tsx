import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function GradationButton({ className, children, ...props }: Props) {
    return (
        <button
            className={clsx(
                'font-set-b16',
                twMerge(
                    'flex items-center justify-center bg-gradient-ww-blue-button text-white shadow-ww-blue-button',
                    className
                )
            )}
            {...props}
        >
            {children}
        </button>
    );
}
