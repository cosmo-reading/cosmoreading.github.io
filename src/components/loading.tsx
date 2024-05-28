import CircularProgress from '@app/domains/common/components/CircularProgress';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import type * as React from 'react';
import { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

type DisplayType = 'none' | 'text' | 'indicator';

export type LoadingProps = JSX.IntrinsicElements['div'] & {
    displayType: DisplayType;
    fullScreen?: boolean;
    whenInView?: boolean;
    children: React.ReactNode;
    FallbackElement?: React.ReactNode;
};

type LoadingFallbackProps = {
    displayType?: DisplayType;
    fullScreen?: boolean;
    className?: string;
};

export function LoadingFallback({ displayType, fullScreen, className }: LoadingFallbackProps) {
    if (displayType === 'none') {
        return null;
    }

    return (
        <div
            className={clsx(
                {
                    'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2': fullScreen,
                },
                'flex h-full items-center justify-center',
                className
            )}
        >
            <div className="flex flex-1 flex-col items-center space-y-[16px]">
                {displayType === 'text' && <Typography className="text-center">Loading...</Typography>}
                {displayType === 'indicator' && (
                    <>
                        <CircularProgress />
                        <Typography className="text-center">Loading...</Typography>
                    </>
                )}
            </div>
        </div>
    );
}

function Loading({ children, displayType, fullScreen, whenInView, className, FallbackElement, ...rest }: LoadingProps) {
    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    const Fallback = FallbackElement || <LoadingFallback displayType={displayType} fullScreen={fullScreen} />;

    return (
        <div {...rest} className={clsx('loading-container', className)} ref={ref}>
            {inView || !whenInView ? <Suspense fallback={Fallback}>{children}</Suspense> : Fallback}
        </div>
    );
}

Loading.defaultProps = {
    displayType: 'text',
};

export default Loading;
