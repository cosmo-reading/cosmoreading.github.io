import type { NovelItem } from '@app/_proto/Protos/novels';
import { ReactComponent as WtuTimerIcon } from '@app/assets/wtu-timer.svg';
import PlaceholderComponent from '@app/components/placeholder';
import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import { ABSOLUTE_FULL } from '@app/domains/common/styles';
import NovelBlurImg from '@app/domains/novel/components/NovelBlurImage';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { timestampToDate } from '@app/libs/utils';
import { breakpoints } from '@app/utils/breakpoints';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { type PropsWithChildren, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = PropsWithChildren<{
    novel: NovelItem | undefined;
    imgUrl?: string;
    imgBlurHash?: string;
    isLoading?: boolean;
    srcWidth: number;
    srcHeight: number;
    classes?: { bookCover?: string; img?: string };
    showRotation: boolean;
}>;

NovelResponsiveCoverImage.defaultProps = {
    showRotation: true
};

function NovelResponsiveCoverImage({
    novel,
    imgUrl,
    imgBlurHash,
    isLoading,
    srcWidth,
    srcHeight,
    classes,
    showRotation = true,
    children,
}: Props) {
      const novelRotation = useMemo(() => {
        const activeRotations =
        novel?.series?.activePricingModels.flatMap(m =>
            m.rotations.map(r => ({
            pricing: m,
            rotation: r,
            })),
        ) || [];

        const currentActiveRotation = activeRotations.find(r => r.rotation.id === r.pricing.currentRotationId?.value);

        if (!currentActiveRotation) {
        return null;
        }

        const isFreeRotation =
        !!currentActiveRotation.pricing && currentActiveRotation.pricing.pricing.oneofKind === 'free';

        const isActive = dayjs().isBetween(
            dayjs(timestampToDate(currentActiveRotation.rotation.startTime)),
            dayjs(timestampToDate(currentActiveRotation.rotation.endTime)),
        );

        return {
            isFreeRotation,
            isActive,
            rotation: currentActiveRotation?.rotation,
        };
    }, [novel]);

    return (
        <div>
            <PlaceholderComponent
                item={!isLoading}
                className={clsx(ABSOLUTE_FULL, 'max-w-none rounded-[6px] bg-[#e9e9e9] dark:bg-[#2a2a2a]')}
                skeletonProps={BASE_SKELETON_PROPS}
            >
                {!isLoading && (
                    <NovelBlurImg
                        alt={novel?.name}
                        srcWidth={srcWidth}
                        srcHeight={srcHeight}
                        src={imgUrl ?? novel?.coverUrl?.value}
                        blurHash={imgBlurHash ?? novel?.coverBlurHash?.value}
                        innerClassName={twMerge('self-center', classes?.img)}
                    />
                )}
                {showRotation &&novelRotation?.isFreeRotation !== undefined && novelRotation?.isFreeRotation === true && (
                    <div className="absolute top-0 right-0 w-[40%]">
                        <img alt="Free" src="/images/free-blue.png" className="drop-shadow-[3px_5px_2px_rgba(0,0,0,0.6)]" />
                    </div>
                )}
                <div className={twMerge(ABSOLUTE_FULL, 'bg-skins-bookcover', classes?.bookCover)} />

                <div
                    style={{
                        backgroundImage: "url('/images/Bookcover@3x.png')",
                        backgroundSize: '100% 100%',
                    }}
                    className={ABSOLUTE_FULL}
                />
                {children}
            </PlaceholderComponent>
        </div>
    );
}

export type WtuBadgeType = {
    classes?: {
        root?: string;
        box?: string;
        icon?: string;
    };
};
const WtuBadge = ({ classes }: WtuBadgeType) => {
    return (
        <div className={clsx('absolute', classes?.root)}>
            <div className={clsx('rounded-4 flex items-center justify-center bg-black', classes?.box)}>
                <WtuTimerIcon className={clsx('text-white', classes?.icon)} />
            </div>
        </div>
    );
};

type RankType = { rank: number };
const Rank = ({ rank }: RankType) => {
    const isMobile = useMediaQuery(breakpoints.downMd);

    return (
        <img
            className="absolute -bottom-2 -left-2"
            src={`/images/ranking-number-${rank + 1}@3x.png`}
            alt="rank number"
            width={isMobile ? 48 : 68}
            height={isMobile ? 34 : 48}
        />
    );
};

NovelResponsiveCoverImage.WtuBadge = WtuBadge;
NovelResponsiveCoverImage.Rank = Rank;

export default NovelResponsiveCoverImage;
