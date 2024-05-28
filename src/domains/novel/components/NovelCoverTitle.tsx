import type { NovelItem_Status } from '@app/_proto/Protos/novels';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { convertNovelStatusToStr } from '@app/domains/novel/utils';

type Props = {
    novelStatus?: NovelItem_Status;
    isLoading?: boolean;
    title?: string;
};

export default function NovelCoverTitle({ novelStatus, isLoading, title }: Props) {
    return (
        <div className="flex flex-col items-start">
            <HeroTextPlaceholder item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
                <div className="font-set-b10 rounded-[4px] bg-gray-900 px-[6px] py-[4px] text-white dark:bg-gray-200 dark:text-black">
                    {convertNovelStatusToStr(novelStatus)}
                </div>
            </HeroTextPlaceholder>

            <div className="sm2:mt-[2px]">
                <HeroTextPlaceholder item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
                    <h1 className="font-set-b24 text-gray-t1 line-clamp-2 sm2:font-set-b32">{title}</h1>
                </HeroTextPlaceholder>
            </div>
        </div>
    );
}
