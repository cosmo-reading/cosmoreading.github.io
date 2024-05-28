import { GetNovelAnnouncementsRequest } from '@app/_proto/Protos/novel_announcements';
import { NovelAnnouncementsClient } from '@app/_proto/Protos/novel_announcements.client';
import type { NovelItem } from '@app/_proto/Protos/novels';
import AnnouncementItem from '@app/components/novel-announcements/announcements.item';
import Paging from '@app/components/paging';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';
import { Divider, Skeleton, type SkeletonProps } from '@mui/material';
import animateScrollTo from 'animated-scroll-to';
import clsx from 'clsx';
import * as React from 'react';
import { Suspense, useCallback, useMemo, useRef, useState } from 'react';

//#region : Helper local function components to reduce main component code length

const PlaceholderSkeleton = React.memo(function PlacehlderSkeleton({ className, ...rest }: SkeletonProps) {
    return (
        <Skeleton
            className={clsx(
                'bg-transparent bg-gradient-to-r from-[#fbfbfb] to-[#f6f6f6] dark:from-[#333] dark:to-[#2a2a2a]',
                className
            )}
            {...rest}
        />
    );
});

export const AnnouncementPlaceholder = React.memo(function AnnouncementPlaceholder({ count = 4 }: { count?: number }) {
    return (
        <div className="mt-[8px] flex flex-col space-y-[20px]">
            {Array(count)
                .fill(null)
                .map((_, idx) => (
                    <React.Fragment key={idx}>
                        <div>
                            <PlaceholderSkeleton
                                className="mb-[6px] h-[20px] w-[80%] sm:w-[70%]"
                                variant="rectangular"
                                animation="wave"
                            />
                            <PlaceholderSkeleton className="h-[20px] w-[74px]" variant="rectangular" animation="wave" />
                        </div>
                        <Divider className="last:hidden" />
                    </React.Fragment>
                ))}
        </div>
    );
});

//#endregion : Helper local function components to reduce main component code length

//#region : Main component

type WrapperComponentType = React.ComponentType<{
    children?: React.ReactNode;
    novel?: NovelItem;
    loaded?: boolean;
}>;

/** Custom. Main component parameters type */
export type NovelAnnouncementListProps = {
    novel?: NovelItem;
    pagination?: boolean;
    announcementsCount: number;
    hideWhenNoAnnouncements?: boolean;
    wrapperComponent?: WrapperComponentType;
};

function PassthroughWrapper({ children }: { novel?: NovelItem; children?: React.ReactNode; loaded?: boolean }) {
    return <>{children}</>;
}

function NovelAnnouncements({ novel, count, pagination }: { novel?: NovelItem; count: number; pagination?: boolean }) {
    //General
    const announcementsRef = useRef<HTMLDivElement>(null);

    //#region : Server request to fetch novel announcements list

    //Announcements list is paginatted
    const [page, setPage] = useState(1);

    const novelNewsRequest = useGrpcRequest(GetNovelAnnouncementsRequest, {
        novelSelector: novel?.id
            ? {
                  oneofKind: 'novelId',
                  novelId: novel.id,
              }
            : undefined,
        pageInfo: {
            page,
            count,
        },
    });

    const { data: announcements } = useGrpcApiWithQuery(
        NovelAnnouncementsClient,
        c => c.getNovelAnnouncements,
        novelNewsRequest,
        ['novel-news', novel?.id, page, count],
        {
            staleTime: 1000 * 60 * 5, //Data stales in 5 minutes
            suspense: true,
            keepPreviousData: true,
            //Show error only when this is the main component with pagination
            showModalOnError: pagination ? true : undefined,
        }
    );
    //#endregion : Server request to fetch novel announcements list

    //#region : Pagination

    /** Custom. */
    const totalPages = useMemo(() => {
        return Math.ceil((announcements?.pageInfo?.total || 0) / count);
    }, [announcements?.pageInfo?.total, count]);

    /** Custom. Handles page number clicks. */
    const handlePagination = useCallback(async (e, page: number) => {
        setPage(page);

        if (announcementsRef.current) {
            await animateScrollTo(announcementsRef.current, {
                maxDuration: 500,
                verticalOffset: -150,
            });
        }
    }, []);

    return (
        <>
            <div ref={announcementsRef}></div>
            <div className="mt-[8px] flex flex-col space-y-[20px]">
                {announcements?.items?.map((announcement, idx) => (
                    <React.Fragment key={idx}>
                        <AnnouncementItem announcement={announcement} />
                        {idx < announcements.items.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
                {announcements?.items.length == 0 && (
                    <div className="my-[20px]">
                        No announcements yet! Keep watching this space for latest announcements.
                    </div>
                )}
            </div>
            {pagination && totalPages > 0 && (
                <div className="mt-[32px]">
                    <Paging count={totalPages} page={page} onChange={handlePagination} />
                </div>
            )}
        </>
    );
}

/**
 * Custom.
 * Displays novel announcements list,
 * makes server request only when it is in view.
 */
function NovelAnnouncementsList({ novel, announcementsCount, wrapperComponent, ...rest }: NovelAnnouncementListProps) {
    //#endregion : Variables, functions and api calls

    const Wrapper: WrapperComponentType = wrapperComponent || PassthroughWrapper;

    return (
        <Suspense
            fallback={
                <Wrapper novel={novel}>
                    <AnnouncementPlaceholder count={announcementsCount} />
                </Wrapper>
            }
        >
            <Wrapper novel={novel} loaded>
                <NovelAnnouncements novel={novel} count={announcementsCount} {...rest} />
            </Wrapper>
        </Suspense>
    );
}

/** Custom. Main component parameters default value */
NovelAnnouncementsList.defaultProps = {
    announcementsCount: 10,
    pagination: false,
    hideWhenNoAnnouncements: false,
};
//#endregion : Main component

export default NovelAnnouncementsList;
