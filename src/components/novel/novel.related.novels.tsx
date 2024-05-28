import {
    type NovelItem,
    NovelItem_Status,
    SearchNovelsRequest,
    SearchNovelsRequest_FilterOperator,
    SearchNovelsRequest_SortDirection,
    SearchNovelsRequest_SortType,
} from '@app/_proto/Protos/novels';
import { NovelsClient } from '@app/_proto/Protos/novels.client';
import NoSsr from '@app/domains/common/components/NoSsr';
import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import HomeSwiper from '@app/domains/home/components/HomeSwiper';
import { useHomeRecommendedSlidesPerView } from '@app/domains/home/containers/HomeRecommendedNovels/RelatedRecommends';
import { HOME_SWIPER_WITH_TOP_SHADOW_LAYOUT_STYLE } from '@app/domains/home/styles';
import { novelCommonLoggingParamsParser } from '@app/domains/novel/analytics/amplitude/handlers';
import RelatedNovel from '@app/domains/novel/components/RelatedNovel';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';
import { breakpoints } from '@app/utils/breakpoints';
import { Suspense, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { twMerge } from 'tailwind-merge';

type Props = {
    novel?: NovelItem | null;
};

function RelatedNovelsSwiper({ novels, isLoading }: { novels: NovelItem[]; isLoading?: boolean }) {
    const isDownLg = useMediaQuery(breakpoints.downLg);
    const slidesPerView = useHomeRecommendedSlidesPerView();

    return (
        <HomeSwiper
            slidesPerView={slidesPerView}
            slidesPerGroup={isDownLg ? 1 : 6}
            className={twMerge(HOME_SWIPER_WITH_TOP_SHADOW_LAYOUT_STYLE, '!py-0')}
            isLoading={isLoading}
        >
            {novels?.map((novel, idx) => (
                <HomeSwiper.Slide
                    key={idx}
                    className="!w-[calc((100%+12px)/2.33-12px)] xs2:!w-180 sm2:!w-[calc((100%+12px)/4-12px)] md:!w-[calc((100%+16px)/4-16px)] lg:!w-[calc((100%+16px)/6-16px)]"
                    data-amplitude-params={JSON.stringify({
                        ...{ itemSlot: idx },
                        ...novelCommonLoggingParamsParser(novel),
                    })}
                >
                    <RelatedNovel novel={novel} isLoading={isLoading} />
                </HomeSwiper.Slide>
            ))}
        </HomeSwiper>
    );
}

const fallback = <RelatedNovelsSwiper novels={Array<NovelItem>(10).fill(undefined!)} isLoading />;

function NovelRelatedNovels({ novel }: Props) {
    const novelsRequest = useGrpcRequest(SearchNovelsRequest, {
        genresFilter: {
            genres: novel?.genres,
            operator: SearchNovelsRequest_FilterOperator.Or,
        },
        status: NovelItem_Status.All,
        sortType: SearchNovelsRequest_SortType.Random,
        sortDirection: SearchNovelsRequest_SortDirection.ASC,
        count: TOTAL_NOVEL_COUNT + 1,
    });

    const { data } = useGrpcApiWithQuery(
        NovelsClient,
        c => c.searchNovels,
        novelsRequest,
        ['related-novels', novel?.id],
        {
            suspense: true,
            staleTime: 1000 * 60 * 60 * 24, // Data stales in 24 hours
        }
    );

    const novels = useMemo(() => {
        return data?.items.filter(p => p.id != novel?.id).slice(0, TOTAL_NOVEL_COUNT) ?? null;
    }, [data, novel?.id]);

    if (!novels) {
        return fallback;
    }

    return <RelatedNovelsSwiper novels={novels} />;
}

export default function NovelRelatedNovelsWrapper(props: Props) {
    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    return (
        <NoSsr fallback={fallback}>
            <div ref={ref}>
                {inView ? (
                    <Suspense fallback={fallback}>
                        <NovelRelatedNovels {...props} />
                    </Suspense>
                ) : (
                    fallback
                )}
            </div>
        </NoSsr>
    );
}

const TOTAL_NOVEL_COUNT = 5;
