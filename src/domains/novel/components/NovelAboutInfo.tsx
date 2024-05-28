import type { NovelItem } from '@app/_proto/Protos/novels';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import NovelGenres from '@app/domains/novel/components/NovelGenres';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';

export default function NovelAboutInfo({ novel }: { novel: NovelItem | null }) {
    const chapterCnt =
        (novel?.chapterInfo?.chapterCount?.value || 0) + (novel?.sponsorInfo?.advanceChapterCount?.value || 0);
    return (
        <HeroTextPlaceholder
            item={novel}
            count={2}
            className="h-[20px] w-[243px] first-of-type:mb-[6px]"
            skeletonProps={BASE_SKELETON_PROPS}
        >
            <div className="flex flex-col space-y-6 sm2:flex-row sm2:space-y-0">
                <InfoWrapper>
                    <InfoTitle title="Chapters" />
                    <InfoDetail detail={`${chapterCnt} Chapters`} />
                </InfoWrapper>
                <InfoWrapper>
                    <InfoTitle title="Licensed From" />
                    <InfoDetail detail={novel?.licensedFrom?.value || 'Unknown'} />
                </InfoWrapper>
            </div>
            <div className="pt-[20px] sm2:pt-[28px]">
                <NovelGenres novel={novel} />
            </div>
        </HeroTextPlaceholder>
    );
}

type InfoWrapperProps = {
    children?: React.ReactNode;
};
const InfoWrapper = ({ children }: InfoWrapperProps) => {
    return (
        <div className="flex flex-row items-center space-x-8 sm2:w-[240px] sm2:flex-col sm2:items-start sm2:space-y-4 sm2:space-x-0">
            {children}
        </div>
    );
};

type InfoTitleProps = {
    title: string;
};
const InfoTitle = ({ title }: InfoTitleProps) => (
    <div className="font-set-m12 shrink-0 text-gray-700 sm2:font-set-m14 dark:text-gray-500">{title}</div>
);

type InfoDetailProps = {
    detail: string;
};
const InfoDetail = ({ detail }: InfoDetailProps) => (
    <div className="font-set-sb14 text-gray-750 break-word line-clamp-2 sm2:font-set-sb16 dark:text-gray-300 sm2:text-gray-800">
        {detail}
    </div>
);
