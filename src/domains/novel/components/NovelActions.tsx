import type { ChapterItem } from '@app/_proto/Protos/chapters';
import { CHAPTER_EVENT_SOURCES } from '@app/analytics/constants';
import useChampionSubscriptions from '@app/domains/champion/hooks/useChampionSubscriptions';
import GradationButton from '@app/domains/common/components/button/GradationButton';
import { pluralize } from '@app/domains/common/utils';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import type { NovelPricingModelType } from '@app/domains/novel/types';
import { Link } from 'react-router-dom';

type Props = {
    novelId?: number;
    novelSlug?: string;
    bookmarkChapter?: ChapterItem;
    isLoading: boolean;
    pricingModel?: NovelPricingModelType;
    firstChapter?: ChapterItem;
    karmaFreeChapters?: number;
    onChapterRead?: () => void;
    vipBenefitedNovel?: boolean;
};

export default function NovelActions({
    novelId,
    novelSlug,
    bookmarkChapter,
    isLoading,
    pricingModel,
    firstChapter,
    karmaFreeChapters,
    onChapterRead,
    vipBenefitedNovel,
}: Props) {
    const to = `/novel/${novelSlug}/${bookmarkChapter?.slug ?? firstChapter?.slug ?? null}`;

    const continueChapterText = bookmarkChapter?.name || '';

    const { activeSubscription, isLoading: isChampionLoading } = useChampionSubscriptions({
        novelId,
        enabled: !!novelId,
        keepPreviousData: false,
    });

    const isAllLoading = isLoading || isChampionLoading;

    return (
        <HeroTextPlaceholder item={!isAllLoading} className="rounded-[12px]" skeletonProps={BASE_SKELETON_PROPS}>
            <Link to={to} state={{ from: CHAPTER_EVENT_SOURCES.NovelCover }} onClick={onChapterRead}>
                <GradationButton className="h-[51px] w-full rounded-[12px] sm2:h-[60px]" disabled={!firstChapter}>
                    <div className="flex w-full flex-col px-[20px]">
                        {bookmarkChapter ? 'CONTINUE READING' : 'START READING'}
                        {continueChapterText && (
                            <div className="font-set-sb10 truncate text-white/70">{continueChapterText}</div>
                        )}
                    </div>
                </GradationButton>
            </Link>
            <div className="font-set-sb12 mt-[4px] mb-[-18px] flex h-[14px] justify-center">
                {!isAllLoading && (
                    <StatusText
                        vipBenefited={!!vipBenefitedNovel}
                        championed={!!activeSubscription}
                        pricingModel={pricingModel}
                        karmaFreeChapters={karmaFreeChapters}
                    />
                )}
            </div>
        </HeroTextPlaceholder>
    );
}

type StatusTextProps = {
    vipBenefited?: boolean;
    championed?: boolean;
    pricingModel: NovelPricingModelType | undefined;
    karmaFreeChapters: number | undefined;
};
const StatusText = ({ vipBenefited, championed, pricingModel, karmaFreeChapters }: StatusTextProps) => {
    if (pricingModel === 'karma') {
        if (vipBenefited || championed) {
            const benefitText = (() => {
                if (championed) return 'Subscribing';
                return 'VIP Access';
            })();

            return (
                <div className="flex items-center">
                    <div className="text-blue-600">{benefitText}</div>
                </div>
            );
        } else {
            return <div className="text-blue-600">{`${pluralize(karmaFreeChapters || 0, 'Freeview Chapter')}`}</div>;
        }
    } else if (pricingModel === 'free') {
        return <div className="text-blue-600">Free for All Chapters</div>;
    }
    return <></>;
};
