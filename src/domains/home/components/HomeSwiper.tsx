import { ReactComponent as ArrowUpIcon } from '@app/assets/arrow-up.svg';
import Swiper from '@app/domains/common/components/Swiper';
import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import { HomeEvents } from '@app/domains/home/analytics/amplitude/events';
import { HOME_SWIPER_NAV_BTN_STYLE } from '@app/domains/home/styles';
import { breakpoints } from '@app/utils/breakpoints';
import clsx from 'clsx';
import type { SwiperProps } from 'swiper/react';
import { twMerge } from 'tailwind-merge';

function HomeSwiper({ children, dark, ...props }: SwiperProps & { dark?: boolean; isLoading?: boolean }) {
    const { pagination, spaceBetween, style, isLoading, ...rest } = props;
    const isDownMd = useMediaQuery(breakpoints.downMd);

    return (
        <Swiper
            {...rest}
            spaceBetween={spaceBetween ?? (isDownMd ? 12 : 16)}
            style={style ?? (isDownMd ? { overflow: 'visible' } : {})}
            freeMode={!isDownMd}
            watchSlidesProgress
            navigation={true}
            pagination={
                pagination ?? {
                    clickable: true,
                    bulletClass: clsx(
                        'bg-clip-content cursor-pointer w-14 h-14 p-4 rounded-full bg-black/20 dark:bg-white/40',
                        dark && 'bg-white/40'
                    ),
                    bulletActiveClass: '!bg-blue-600',
                }
            }
        >
            {children}

            <div
                className={clsx(
                    'flex justify-center',
                    isDownMd ? 'visibility-hidden pt-0' : 'pt-12',
                    isLoading && 'visibility-hidden'
                )}
            >
                <Swiper.Prev
                    className={twMerge(
                        HOME_SWIPER_NAV_BTN_STYLE,
                        dark && 'bg-gray-850 text-white disabled:text-white/20'
                    )}
                    data-amplitude-click-event={HomeEvents.ClickPreviousCollectionArrow}
                >
                    <ArrowUpIcon className="h-16 w-16 -rotate-90" />
                </Swiper.Prev>

                <Swiper.Pages className="flex !w-auto items-center px-16" />
                <Swiper.Next
                    className={twMerge(
                        HOME_SWIPER_NAV_BTN_STYLE,
                        dark && 'bg-gray-850 text-white disabled:text-white/20'
                    )}
                    data-amplitude-click-event={HomeEvents.ClickNextCollectionArrow}
                >
                    <ArrowUpIcon className="h-16 w-16 rotate-90" />
                </Swiper.Next>
            </div>
        </Swiper>
    );
}

HomeSwiper.Slide = Swiper.Slide;

export default HomeSwiper;
