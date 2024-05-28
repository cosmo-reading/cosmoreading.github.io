import { useComponentClasses } from '@app/components/hooks';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export type PaymentsFailedDialogProps = {
    open: boolean;
    error?: string | null;
    onDismiss?: () => void;
};

export default function PaymentsFailedDialog({ open, error, onDismiss }: PaymentsFailedDialogProps) {
    const { MuiButton: buttonClasses } = useComponentClasses('MuiButton');

    return (
        <Dialog
            open={open}
            onClose={onDismiss}
            fullWidth
            PaperProps={{
                className: 'dark:!bg-[#202020]',
                style: {
                    maxWidth: '400px',
                    margin: '10px',
                    width: '100%',
                },
            }}
        >
            <DialogTitle className="px-[20px] pt-[20px] pb-[11px]">
                <span className="text-[18px] font-bold leading-none text-gray-t0">Payment Error!</span>
            </DialogTitle>
            <DialogContent className="px-[20px] pb-[20px]">
                <p className="text-[14px] text-[#666] dark:text-[#BDBDBD]">{error || 'Payment failed.'}</p>
            </DialogContent>
            <DialogActions className="!space-x-[10px] px-[20px] pb-[20px] pt-0">
                <Button
                    classes={{
                        ...buttonClasses,
                        root: twMerge(buttonClasses.root, '!text-[13px] font-semibold'),
                    }}
                    className="min-w-[94px]"
                    variant="contained"
                    color="primary"
                    onClick={onDismiss}
                >
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
}
