import { EVENT_SOURCES } from '@app/analytics/constants';
import NovelRelatedNovels from '@app/components/novel/novel.related.novels';
import NovelBodyTabs from '@app/domains/novel/containers/NovelBodyTabs';
import RelatedNovels from '@app/domains/novel/containers/RelatedNovels';

export default function NovelBody({ novel, bookmark, onGoToTab, containerRef, novelTabsRef }) {
    return (
        <div className="mx-auto px-[20px] pb-40 sm2:px-[40px] md:max-w-[1024px]">
            <NovelBodyTabs
                novel={novel}
                bookmark={bookmark}
                onGoToTab={onGoToTab}
                containerRef={containerRef}
                novelTabsRef={novelTabsRef}
            />

            <div
                data-amplitude-params={JSON.stringify({
                    on: EVENT_SOURCES.NovelCover,
                })}
            >
                <RelatedNovels>
                    <RelatedNovels.Title />
                    <div className="pt-12 md:pt-16">
                        <NovelRelatedNovels novel={novel} />
                    </div>
                </RelatedNovels>
            </div>
        </div>
    );
}
