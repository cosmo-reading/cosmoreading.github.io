import { MenuItem, type MenuItemProps } from '@mui/material';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export default function PlainMenuItem({ children, className, ...rest }: MenuItemProps) {
    return (
        <MenuItem
            disableRipple
            focusVisibleClassName="!bg-transparent"
            className={twMerge('cursor-auto hover:bg-transparent focus:outline-0', className)}
            {...rest}
        >
            {children}
        </MenuItem>
    );
}
