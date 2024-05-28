import { Button, type ButtonProps, CircularProgress } from '@mui/material';
import * as React from 'react';

//#region : Main component

/**
 * Custom.
 *
 * Main component parameters type.
 * Extend ButtonProps with custom properties.
 */
interface ButtonSpinnerProps extends ButtonProps {
    spinner?: boolean;
}

/**
 * Custom helper component.
 *
 * Use this when you want to show spinner over a button
 */
const ButtonSpinner = ({ spinner, children, ...rest }: ButtonSpinnerProps) => {
    return (
        <Button startIcon={spinner && <CircularProgress className="text-blue-300" size={16} />} {...rest}>
            {children}
        </Button>
    );
};

export default ButtonSpinner;
//#endregion : Main component
