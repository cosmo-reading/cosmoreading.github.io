import { CONTENT_SECTION_TITLE_STYLE } from '@app/domains/common/styles';
import TabsTextPlaceholder from '@app/domains/novel/components/TabsTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import type { ReactNode } from 'react';

export default function NovelAboutReviewsWrapper({ children, loaded }: { children: ReactNode; loaded?: boolean }) {
    return (
        <div className="pb-16">
            <div className="py-16 sm2:pt-24 sm2:pb-16">
                <TabsTextPlaceholder
                    item={loaded}
                    className="h-[20px] w-[210px] sm:w-[183px]"
                    skeletonProps={BASE_SKELETON_PROPS}
                >
                    <span className={CONTENT_SECTION_TITLE_STYLE}>Reviews</span>
                </TabsTextPlaceholder>
            </div>
            {children}
        </div>
    );
}
