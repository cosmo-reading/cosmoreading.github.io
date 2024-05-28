import { Close } from '@mui/icons-material';
import { Collapse, IconButton } from '@mui/material';
import { Bullhorn } from 'mdi-material-ui';
import type * as React from 'react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export type BannerProps = {
    tw?: string;
    className?: string;
    innerClassName?: string;
    heading: string;
    subheading?: string | null;
    link?: string;
    linkText?: string;
    dismissible?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    onDismiss?: () => void;
};

function Banner({
    heading,
    subheading,
    link,
    linkText,
    dismissible,
    icon: BannerIcon,
    onDismiss,
    className,
    innerClassName,
}: BannerProps) {
    const [dismissed, setDismissed] = useState(false);

    const handleDismiss = useCallback(() => {
        setDismissed(true);

        onDismiss?.();
    }, [onDismiss]);

    return (
        <Collapse in={!dismissed} appear={false} className={twMerge('relative w-full', className)}>
            <div className={twMerge('!py-[8px]', innerClassName)}>
                <div className="grid grid-flow-col grid-cols-[auto_minmax(0px,_1fr)_min-content] items-center justify-between sm:grid-flow-row sm:grid-rows-1">
                    <div className="order-1 col-span-2 flex items-center sm:col-span-1">
                        <span className="hidden sm:block">
                            {BannerIcon ? (
                                <BannerIcon className="h-[24px] w-[24px] text-blue" />
                            ) : (
                                <Bullhorn className="h-[24px] w-[24px] text-blue" aria-hidden="true" />
                            )}
                        </span>
                        <Link to={link ?? ''} className="flex">
                            <p className="text-[13px] font-semibold text-gray-t0 line-clamp-2 sm:!inline-block sm:max-w-[350px] sm:truncate sm:line-clamp-none lg:max-w-[450px]">
                                <span>{heading}</span>
                            </p>
                        </Link>
                    </div>
                    <div className="order-last col-span-2 row-span-2 grid h-full grid-rows-2 justify-end sm:col-span-1">
                        {dismissible && (
                            <div className="row-span-2 flex justify-end">
                                <IconButton onClick={handleDismiss} className="text-[#777]">
                                    <span className="sr-only">Dismiss</span>
                                    <Close />
                                </IconButton>
                            </div>
                        )}
                    </div>
                    <div className="order-3 flex justify-between text-[13px] sm:ml-[12px]">
                        <p className="text-[#888]">
                            <span>{subheading}</span>
                        </p>
                        {!!link && (
                            <div className="row-start-2 ml-[12px] flex items-end sm:ml-0 sm:items-center sm:justify-end">
                                <Link to={link} className="pr-[16px] text-[13px] font-bold text-blue sm:ml-[12px]">
                                    {' '}
                                    {linkText || 'Read more'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Collapse>
    );
}

Banner.defaultProps = {
    dismissible: true,
};

export default Banner;
