import type { ClassNameType } from '@app/domains/common/types';
import { ErrorOutline } from '@mui/icons-material';
import { CircularProgress, type CircularProgressClasses, type CircularProgressProps, Typography } from '@mui/material';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
//#region : Global constants

const Wrapper = ({ className, children }: PropsWithChildren<ClassNameType>) => (
    <div className={twMerge(clsx('my-[16px] flex-col content-dead-center', className))}>{children}</div>
);

//#endregion: Global constants

//#region : Main component

/** Custom. Main component parameters type */
export type QueryProgressProps = {
    classes?: {
        wrapper?: string;
        progress?: Partial<CircularProgressClasses>;
    };
    status: 'loading' | 'error' | 'success' | 'idle';
    message?: string;
    size?: CircularProgressProps['size'];
};

/**
 * Custom helper component.
 *
 * Use it when you want to show loading indicator for query status 'loading',
 * Error indicator for query status 'error' and nothing for 'success'
 */
export default function QueryProgress({ classes, status, message, size }: QueryProgressProps) {
    if (status === 'loading') {
        return (
            <Wrapper className={classes?.wrapper}>
                <CircularProgress
                    color="secondary"
                    classes={{ root: 'text-blue', ...classes?.progress }}
                    disableShrink
                    size={size}
                />
                {message && <Typography component="div">Loading {message}</Typography>}
            </Wrapper>
        );
    }

    if (status === 'error') {
        return (
            <Wrapper>
                <ErrorOutline color="error" />
                {message && <Typography component="div">Error loading {message}</Typography>}
            </Wrapper>
        );
    }

    return null;
}
//#endregion : Main component
