import loadingLottie from '@app/assets/lotties/loading.json';
import { CircularProgress as MuiCircularProgress } from '@mui/material';
import { Suspense, lazy } from 'react';
import { twMerge } from 'tailwind-merge';

// Remove once https://github.com/airbnb/lottie-web/issues/2739 is resolved
const Lottie = lazy(() => import('react-lottie-player/dist/LottiePlayerLight'), {
    ssr: false,
});

const LottieComponent = () => {
    if (import.meta.env.SSR) {
        return null;
    }

    return (
        <Lottie loop animationData={loadingLottie} play rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
    );
};

export type CircularProgressProps = {
    className?: string;
};

export default function CircularProgress({ className }: CircularProgressProps) {
    return (
        <Suspense fallback={<MuiCircularProgress disableShrink />}>
            <div className={twMerge('h-40 w-40', className)}>
                <LottieComponent />
            </div>
        </Suspense>
    );
}
