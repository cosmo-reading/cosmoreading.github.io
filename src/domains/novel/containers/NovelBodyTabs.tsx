import type { BookmarkItem } from '@app/_proto/Protos/bookmarks';
import type { NovelItem } from '@app/_proto/Protos/novels';
import TabsComponent, { type TabItem, type TabsRef } from '@app/components/tabs/tabs';
import ChampionHighlightBadge from '@app/domains/champion/components/ChampionHighlightBadge';
import useChampionSubscriptions from '@app/domains/champion/hooks/useChampionSubscriptions';
import { SAFE_X_SCREEN_CENTER_LAYOUT } from '@app/domains/common/styles';
import TabsTextPlaceholder from '@app/domains/novel/components/TabsTextPlaceholder';
import { BASE_SKELETON_PROPS, type TabItemKeys } from '@app/domains/novel/constants';
import NovelBodyAboutTab from '@app/domains/novel/containers/NovelBodyAboutTab';
import NovelBodyChampionTab from '@app/domains/novel/containers/NovelBodyChampionTab';
import NovelBodyChapterTab from '@app/domains/novel/containers/NovelBodyChapterTab';
import { useAuth } from '@app/libs/auth';
import { Divider } from '@mui/material';
import clsx from 'clsx';
import { type MutableRefObject, useMemo } from 'react';

export default function NovelBodyTabs({
    novel,
    bookmark,
    onGoToTab,
    containerRef,
    novelTabsRef,
}: {
    novel: NovelItem | null;
    bookmark: BookmarkItem | undefined;
    onGoToTab: (tab: string) => void;
    containerRef: MutableRefObject<HTMLDivElement | null>;
    novelTabsRef: MutableRefObject<TabsRef<TabItemKeys> | null>;
}) {
    const { user } = useAuth();

    const { activeSubscription, isSuccess } = useChampionSubscriptions({
        novelId: novel?.id,
        enabled: !!novel?.id,
    });

    const championHighlightBadgeElement = useMemo(
        () =>
            isSuccess && !activeSubscription ? (
                <div className="relative !m-0">
                    <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <ChampionHighlightBadge />
                    </div>
                </div>
            ) : undefined,
        [activeSubscription, isSuccess]
    );

    const totalChapters =
        (novel?.chapterInfo?.chapterCount?.value || 0) + (novel?.sponsorInfo?.advanceChapterCount?.value || 0);

    const novelTabItems = useMemo(() => {
        if (!novel) {
            return [];
        }

        const tabs: { [key in TabItemKeys]: TabItem<TabItemKeys> } = {
            chapters: {
                name: 'Chapters',
                key: 'chapters',
                component: <NovelBodyChapterTab novel={novel} />,
                hidden: totalChapters == 0,
            },
            about: {
                name: 'About',
                key: 'about',
                component: <NovelBodyAboutTab novel={novel} goToTab={onGoToTab} />,
            },
            champion: {
                name: 'Champion',
                key: 'champion',
                component: <NovelBodyChampionTab novel={novel} activeSubscription={activeSubscription} />,
                icon: championHighlightBadgeElement,
                hidden: !user || !novel?.sponsorInfo?.hasAnyPlans?.value,
            },
        };

        const tabItems: TabItem<TabItemKeys>[] =
            user && bookmark ? [tabs.chapters, tabs.champion, tabs.about] : [tabs.about, tabs.chapters, tabs.champion];

        return tabItems;
    }, [novel, totalChapters, onGoToTab, activeSubscription, championHighlightBadgeElement, user, bookmark]);

    return (
        <div ref={containerRef}>
            {!novel && (
                <div>
                    <div>
                        <div className="flex flex-row space-x-[30px] pb-[10px] sm:space-x-[60px]">
                            <TabsTextPlaceholder
                                item={novel}
                                className="h-[24px] w-[79px] sm:w-[130px]"
                                skeletonProps={BASE_SKELETON_PROPS}
                            />
                            <TabsTextPlaceholder
                                item={novel}
                                className="h-[24px] w-[79px] sm:w-[130px]"
                                skeletonProps={BASE_SKELETON_PROPS}
                            />
                            <TabsTextPlaceholder
                                item={novel}
                                className="h-[24px] w-[79px] sm:w-[130px]"
                                skeletonProps={BASE_SKELETON_PROPS}
                            />
                        </div>
                        <div className="ml-[-8px] h-[3px] w-[95px] bg-blue sm:w-[146px]" />
                    </div>
                    <Divider className="mx-[-20px] w-[calc(100%+40px)] max-w-[1024px] sm:mx-[-30px] sm:w-[calc(100%+60px)] lg:mx-0 lg:w-[100%]" />
                    <div className="my-[24px] flex flex-col space-y-[12px] sm:my-[30px] lg:mx-[92px]">
                        <TabsTextPlaceholder
                            item={novel}
                            className="h-[20px] w-[183px]"
                            skeletonProps={BASE_SKELETON_PROPS}
                        />
                        <TabsTextPlaceholder
                            item={novel}
                            className="h-[20px] w-[100%]"
                            skeletonProps={BASE_SKELETON_PROPS}
                        />
                        <TabsTextPlaceholder
                            item={novel}
                            className="mb-[10px] h-[20px] w-[90%]"
                            skeletonProps={BASE_SKELETON_PROPS}
                        />
                        <TabsTextPlaceholder
                            item={novel}
                            className="h-[20px] w-[100%]"
                            skeletonProps={BASE_SKELETON_PROPS}
                        />
                        <TabsTextPlaceholder
                            item={novel}
                            className="h-[20px] w-[90%]"
                            skeletonProps={BASE_SKELETON_PROPS}
                        />
                    </div>
                </div>
            )}

            {novel && (
                <div id="novel-tabs">
                    <TabsComponent
                        ref={novelTabsRef}
                        items={novelTabItems}
                        divider
                        keepTabsMounted
                        classes={{
                            tabFlexContainer: 'space-x-20 sm2:space-x-36 sm2:pt-[10px]',
                            tab: 'font-set-sb16 sm2:font-set-sb20 sm2:px-[8px] px-0 py-[13px] overflow-visible',
                            divider: clsx(SAFE_X_SCREEN_CENTER_LAYOUT, 'relative -top-1'),
                        }}
                    />
                </div>
            )}
        </div>
    );
}
