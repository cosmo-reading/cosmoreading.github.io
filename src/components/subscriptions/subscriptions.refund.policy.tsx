import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as React from 'react';

export type SubscriptionsRefundPolicyProps = {
    open: boolean;
    onClose: () => void;
};

export default function SubscriptionsRefundPolicy({ open, onClose }: SubscriptionsRefundPolicyProps) {
    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            PaperProps={{
                className: 'dark:!bg-[#202020]',
                style: {
                    maxWidth: '480px',
                },
            }}
        >
            <DialogTitle className="flex items-center justify-between py-[20px] pl-[20px] pr-[11px]">
                <span className="text-[21px] font-bold">Refund Policy</span>
                <Close onClick={onClose} className="cursor-pointer text-[#777]" />
            </DialogTitle>
            <DialogContent className="mb-[10px] space-y-[10px] p-[20px] text-[14px] leading-[21px] text-[#666] dark:text-[#BDBDBD]">
                <p>
                    <span className="font-bold">
                        Digital subscriptions are normally not eligible for refunds, and general policy is that all
                        sales are final.
                    </span>{' '}
                    If you would like a refund for a digital subscription you may contact us through our{' '}
                    <a
                        className="underline"
                        href="https://wuxiaworld.atlassian.net/servicedesk/customer/portals"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        customer support page
                    </a>
                    .
                </p>
                <p>
                    Please include your site username and the email address associated with your account. Refund
                    requests will be assessed and considered based on each individual case’s circumstances.
                </p>
                <p>
                    Wuxiaworld may but is under no obligation to issue a refund for reasons including (but not limited
                    to):
                </p>
                <ul className="list-inside list-disc">
                    <li>A change of mind</li>
                    <li>Accidental purchase</li>
                    <li>No longer requiring the subscription</li>
                    <li>Goodwill requests</li>
                </ul>
                <p>If a refund request is accepted, the funds will be sent to the original payment method used.</p>
                <p>
                    In general, refund requests for digital subscriptions will only be approved in cases where a
                    translator/translation team has not met their weekly translation commitment for two weeks in the
                    same month. This does not apply if you subscribe during a period of less frequent releases after the
                    translator has given advance forewarning.
                </p>
            </DialogContent>
            <DialogActions className="!space-x-[10px] px-[20px] pb-[20px] pt-0">
                <Button
                    className="min-h-[36px] min-w-[94px] !text-[13px] !font-semibold"
                    variant="contained"
                    onClick={onClose}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
