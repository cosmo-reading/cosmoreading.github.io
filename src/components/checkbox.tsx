import { ReactComponent as CheckChecked } from '@app/assets/check-checked.svg';
import { ReactComponent as CheckOutlined } from '@app/assets/check-outlined.svg';
import { ReactComponent as CircleChecked } from '@app/assets/circle-checked.svg';
import { ReactComponent as CircleEmpty } from '@app/assets/circle-empty.svg';
import clsx from 'clsx';
import type * as React from 'react';
import { useCallback } from 'react';

type CheckboxVariant = 'rectangle' | 'circle';

export type CheckboxProps = {
    variant?: CheckboxVariant;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    children?: React.ReactNode;
};

const getCheckboxIcon = (variant: CheckboxVariant, checked: boolean) => {
    switch (variant) {
        case 'circle':
            return checked ? <CircleChecked /> : <CircleEmpty />;
        case 'rectangle':
            return checked ? <CheckChecked /> : <CheckOutlined />;
    }
};

export default function Checkbox({
    checked = false,
    disabled = false,
    variant = 'circle',
    onChange,
    children,
}: CheckboxProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.checked);
        },
        [onChange]
    );

    return (
        <span
            className={clsx('relative flex items-center text-[#dcdcdc] dark:text-[#5c5c5c]', {
                'rounded-[50%] bg-[#f4f4f4] dark:bg-[#2f2f2f]': disabled,
            })}
        >
            <input
                className="absolute top-0 left-0 z-10 m-0 h-full w-full cursor-pointer p-0 opacity-0"
                onChange={handleChange}
                type="checkbox"
                checked={checked}
            />
            <span>{getCheckboxIcon(variant, checked)}</span>
            {!!children && <span className="ml-[8px]">{children}</span>}
        </span>
    );
}
