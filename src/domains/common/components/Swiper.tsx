import useHomeMediaQuery from '@app/domains/home/hooks/useHomeMediaQuery';
import clsx from 'clsx';
import { type HTMLAttributes, type PropsWithChildren, useEffect, useRef } from 'react';
import { FreeMode, Grid, Navigation, Pagination } from 'swiper';
import { Swiper as SwiperJs, type SwiperProps, SwiperSlide, type SwiperSlideProps, useSwiper } from 'swiper/react';
import type SwiperClass from 'swiper/types/swiper-class';

type Props = PropsWithChildren<SwiperProps>;

function Swiper({ children, ...props }: Props) {
    const swiperRef = useRef<SwiperClass | null>(null);
    const { isMobile, isTablet, isDesktop, isLargeScreen, isUpMd } = useHomeMediaQuery();
    const { navigation, pagination } = props;
    const navSelector = { prevEl: '.swiper-prev-ww-selector', nextEl: '.swiper-next-ww-selector' };
    const pageSelector = { el: '.swiper-pagination-ww-selector' };

    useEffect(() => {
        if (swiperRef.current) {
            if (swiperRef.current.pagination) {
                swiperRef.current.pagination.destroy();
                swiperRef.current.pagination.init();
                swiperRef.current.pagination.render();
                swiperRef.current.pagination.update();
            }
            if (swiperRef.current.navigation) {
                // TODO: Kevin: Which Navigation Method is Really Need
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, isTablet, isDesktop, isLargeScreen, isUpMd]);
    return (
        <SwiperJs
            {...props}
            onSwiper={swiper => {
                swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Grid, FreeMode]}
            navigation={navigation && { ...castToObj(navigation), ...navSelector }}
            pagination={pagination && { ...castToObj(pagination), ...pageSelector }}
        >
            {children}
        </SwiperJs>
    );
}

const castToObj = (target: true | object): object => (target === true ? {} : target);

type ControllerProps = PropsWithChildren<{ className?: string }> & HTMLAttributes<HTMLButtonElement>;
const Prev = ({ className, children, ...props }: ControllerProps) => {
    return (
        <button className={clsx('swiper-prev-ww-selector', className)} {...props}>
            {children}
        </button>
    );
};

const Next = ({ className, children, ...props }: ControllerProps) => {
    return (
        <button className={clsx('swiper-next-ww-selector', className)} {...props}>
            {children}
        </button>
    );
};

const Pages = ({ className, children }: ControllerProps) => {
    return <div className={clsx('swiper-pagination-ww-selector', className)}>{children}</div>;
};

const Slide = ({ children, ...props }: SwiperSlideProps) => {
    const {
        originalParams: { spaceBetween },
    } = useSwiper();

    return (
        <SwiperSlide {...props} style={{ marginRight: spaceBetween ? `${spaceBetween}px` : undefined, ...props.style }}>
            {children}
        </SwiperSlide>
    );
};

Slide.displayName = SwiperSlide.displayName;

Swiper.Prev = Prev;

Swiper.Next = Next;

Swiper.Pages = Pages;
Swiper.Slide = Slide;

export default Swiper;
