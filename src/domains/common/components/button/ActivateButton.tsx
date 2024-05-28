import RippleEffector from '@app/domains/common/containers/RippleEffector';
import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    classes?: { text?: string };
};

export default function ActivateButton({ children, className, classes, ...props }: Props) {
    const { disabled } = props;
    return (
        <button
            className={twMerge(
                'font-set-sb13 inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white shadow-ww-activate-button',
                disabled && 'bg-gray-330 text-gray-600 shadow-ww-disabled-button dark:bg-gray-750 dark:text-gray-400',
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
