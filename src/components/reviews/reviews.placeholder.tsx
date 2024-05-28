import { Skeleton, type SkeletonProps } from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';

const PlaceholderSkeleton = React.memo(function PlacehlderSkeleton({ className, ...rest }: SkeletonProps) {
    return <Skeleton className={clsx('bg-[#ffffff] dark:bg-[#2a2a2a]', className)} {...rest} />;
});

const ReviewPlaceholder = React.memo(function ReviewPlaceholder() {
    return (
        <div className="mb-[16px] rounded-[10px] bg-[#f5f5f5] px-[16px] pt-[16px] pb-[36px] dark:bg-[#333] sm:pt-[32px] sm:pr-[20px] sm:pl-[30px] sm:pb-[39px]">
            <div className="flex flex-col space-y-[30px] sm:flex-row sm:space-x-[30px] sm:space-y-0">
                <div>
                    <PlaceholderSkeleton
                        className="mx-auto mb-[10px] h-[56px] w-[56px] rounded-[4px] sm:h-[65px] sm:w-[65px]"
                        variant="rectangular"
                        animation="pulse"
                    />
                    <PlaceholderSkeleton
                        className="mx-auto"
                        height={20}
                        width={109}
                        variant="rectangular"
                        animation="wave"
                    />
                </div>
                <div className="flex-1">
                    <div className="mb-[50px] flex flex-col space-y-[12px]">
                        <PlaceholderSkeleton height={20} width={'100%'} variant="rectangular" animation="wave" />
                        <PlaceholderSkeleton height={20} width={'60%'} variant="rectangular" animation="wave" />
                        <PlaceholderSkeleton height={20} width={'100%'} variant="rectangular" animation="wave" />
                        <PlaceholderSkeleton height={20} width={'60%'} variant="rectangular" animation="wave" />
                    </div>
                    <PlaceholderSkeleton height={20} width={109} variant="rectangular" animation="wave" />
                </div>
            </div>
        </div>
    );
});

export default ReviewPlaceholder;
