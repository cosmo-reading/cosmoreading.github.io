import type { NovelItem } from '@app/_proto/Protos/novels';
import PlaceholderComponent from '@app/components/placeholder';
import BlurImg from '@app/domains/common/components/BlurImg';
import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import { parseNovelStatus } from '@app/domains/common/utils';
import { HomeCollectionSlots } from '@app/domains/home/analytics/amplitude/constants';
import HomeCollection from '@app/domains/home/components/HomeCollection';
import HomeRecommendedContent from '@app/domains/home/components/HomeRecommendedContent';
import HomeSwiper from '@app/domains/home/components/HomeSwiper';
import { HOME_CONTENT_SUB_TITLE_FONT_STYLE, HOME_SWIPER_WITH_TOP_SHADOW_LAYOUT_STYLE } from '@app/domains/home/styles';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { breakpoints } from '@app/utils/breakpoints';

type Props = {
    relatedContent?: NovelItem | undefined;
    contents: NovelItem[] | undefined[];
    isLoading?: boolean;
};

export default function RelatedRecommends({ relatedContent, contents = Array(10).fill({}), isLoading }: Props) {
    const { coverUrl, coverBlurHash } = parseNovelStatus(relatedContent);

    const slidesPerView = useHomeRecommendedSlidesPerView();
    const isDownLg = useMediaQuery(breakpoints.downLg);

    return (
        <HomeCollection
            data-amplitude-params={JSON.stringify({ collectionSlot: HomeCollectionSlots.RelatedRecommendation })}
        >
            <div className="flex flex-row items-center space-x-8 py-8">
                <RelatedThumbnail coverUrl={coverUrl} coverBlurHash={coverBlurHash} isLoading={isLoading} />
                <div className="flex flex-col">
                    <HomeCollection.Title
                        title="Because You Read"
                        classes={{ heading: 'font-set-b21 md:font-set-b24' }}
                        isLoading={isLoading}
                    />
                    <HomeCollection.SubTitle
                        title={relatedContent?.name}
                        classes={{ heading: HOME_CONTENT_SUB_TITLE_FONT_STYLE }}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <HomeSwiper
                slidesPerView={slidesPerView}
                slidesPerGroup={isDownLg ? 1 : 6}
                className={HOME_SWIPER_WITH_TOP_SHADOW_LAYOUT_STYLE}
                isLoading={isLoading}
            >
                {contents?.map((content, idx) => (
                    <HomeSwiper.Slide
                        key={idx}
                        className="!w-[calc((100%+12px)/2.33-12px)] xs2:!w-180 sm2:!w-[calc((100%+12px)/4-12px)] md:!w-[calc((100%+16px)/4-16px)] lg:!w-[calc((100%+16px)/6-16px)]"
                        data-amplitude-params={JSON.stringify({ itemSlot: idx })}
                    >
                        <HomeRecommendedContent content={content} isLoading={isLoading} />
                    </HomeSwiper.Slide>
                ))}
            </HomeSwiper>
        </HomeCollection>
    );
}

type RelatedThumbnailProps = {
    coverUrl?: string;
    coverBlurHash?: string;
    isLoading?: boolean;
};
const RelatedThumbnail = ({ coverUrl, coverBlurHash, isLoading }: RelatedThumbnailProps) => {
    const isDownMd = useMediaQuery(breakpoints.downSm2);
    return (
        <PlaceholderComponent item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
            <div className="relative">
                <BlurImg
                    src={coverUrl}
                    blurHash={coverBlurHash}
                    width={isDownMd ? 32 : 36}
                    height={isDownMd ? 44 : 48}
                    fallbackImage="/cover.png"
                    lazy
                    innerClassName="rounded-6"
                />
                <div className="absolute top-0 left-0 h-full w-full rounded-6 border-[0.5px] border-black/20 bg-black/[.08]" />
            </div>
        </PlaceholderComponent>
    );
};

export const useHomeRecommendedSlidesPerView = () => {
    const isDownXs2 = useMediaQuery(breakpoints.downXs2);
    const isDownSm2 = useMediaQuery(breakpoints.downSm2);
    const isDownLg = useMediaQuery(breakpoints.downLg);

    if (isDownXs2) return 2.33;
    if (isDownSm2) return 'auto';
    if (isDownLg) return 4;
    return 6;
};
