import Paging from '@app/components/paging';
import UserNotification from '@app/components/user-notifications/user-notification';
import { useAuth } from '@app/libs/auth';
import { useAllNotifications, useMarkAllRead } from '@app/libs/notifications';
import { batch } from '@app/libs/utils';
import { Divider, Grid, Skeleton, type SkeletonProps, Typography } from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

//#region : Global constants and types
const PlaceholderSkeleton = React.memo(function PlacehlderSkeleton({ className, ...rest }: SkeletonProps) {
    return <Skeleton className={clsx('bg-[#ffffff] dark:bg-[#2a2a2a]', className)} {...rest} />;
});

const PlaceholderComponent = React.memo(function PlaceholderComponent({ count = 4 }: { count?: number }) {
    return (
        <div className="flex flex-col">
            {Array(count)
                .fill(null)
                .map((_, idx) => (
                    <div
                        key={idx}
                        className="border-t border-[#f0f0f0] px-[15px] py-[12px] dark:border-[#444] md:rounded-[10px]"
                    >
                        <PlaceholderSkeleton
                            className="h-[17px] w-[120px] max-w-[100%]"
                            variant="rectangular"
                            animation="wave"
                        />
                        <div className="flex flex-row items-start space-x-[12px] pt-[8px]">
                            <div className="flex-1">
                                <PlaceholderSkeleton
                                    className="h-[14px] w-[70%] max-w-[100%]"
                                    variant="rectangular"
                                    animation="wave"
                                />
                                <PlaceholderSkeleton
                                    className="mt-[5px] h-[14px] w-[40%] max-w-[100%]"
                                    variant="rectangular"
                                    animation="wave"
                                />
                                <PlaceholderSkeleton
                                    className="mt-[13px] h-[12px] w-[80px] max-w-[100%]"
                                    variant="rectangular"
                                    animation="wave"
                                />
                            </div>
                            <div>
                                <PlaceholderSkeleton
                                    className="mx-auto h-[15px] w-[34px]"
                                    variant="rectangular"
                                    animation="pulse"
                                />
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
});
//#endregion: Global constants and types

//#region : Main component

export function MarkAllAsReadTxt() {
    const { user } = useAuth();
    const { markAllRead } = useMarkAllRead();

    const handleMarkAllAsRead = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            markAllRead(user?.id);
        },
        [user?.id, markAllRead]
    );

    return (
        <a
            href="#"
            title="Mark all notifications as read"
            className="text-[12px] font-semibold text-[#888] underline"
            onClick={handleMarkAllAsRead}
        >
            Mark all as read
        </a>
    );
}

/**
 * Custom.
 *
 * Shows all notifications.
 * Notifications can be filtered by it's type.
 * Unread and archived notifications are displayed separately.
 */
export default function AllNotifications() {
    //#region : Variables, functions and api calls

    const [type] = useState('');
    const [page, setPage] = useState(1);
    const [isPaging, setIsPaging] = useState(false);
    const noOfNotifsPerPage = 10;

    //#region : Server request to fetch user notifications
    const { user } = useAuth();
    const { notificationsResult, notificationsQuery } = useAllNotifications(user?.id, type, page, noOfNotifsPerPage);

    const { items: notifications = [] } = notificationsResult ?? {
        items: [],
    };

    //#endregion : Server request to fetch user notifications

    //#region: Handle pagination
    const totalPages = useMemo(() => {
        return Math.ceil((notificationsResult?.pageInfo?.total || 0) / noOfNotifsPerPage);
    }, [notificationsResult?.pageInfo?.total, noOfNotifsPerPage]);

    const handlePagination = useCallback(async (e, page: number) => {
        batch(() => {
            setPage(page);
            setIsPaging(true);
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        setIsPaging(prev => (prev ? false : prev));
    }, [notificationsResult]);
    //#endregion: Handle pagination

    //#region : Fitler notifications

    /** Custom. Handles notification filter change. */
    // const handleNotifFilterChange = useCallback((e: SelectChangeEvent) => {
    //     batch(() => {
    //         //reset pagination to first page when user filters
    //         setPage(1);
    //         setIsPaging(true);
    //         setType((e.target.value as string) || '');
    //     });
    // }, []);
    //#endregion : Fitler notifications

    const showPlaceholders = (isPaging && notificationsQuery.isFetching) || !notificationsResult;

    //#endregion : Variables, functions and api calls

    return (
        <React.Fragment>
            <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
                <Grid
                    item
                    display="flex"
                    flexGrow="1"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography className="mx-0 mt-[3px] mb-[10px]" variant="h2">
                        Notifications
                    </Typography>
                    <MarkAllAsReadTxt />
                </Grid>
                {/*
                    <Grid item>
                        <FormControl variant="outlined">
                            <Select
                                size="small"
                                defaultValue={type}
                                displayEmpty
                                value={type}
                                onChange={handleNotifFilterChange}
                            >
                                <MenuItem value="">All Notifications</MenuItem>
                                <MenuItem value="audiobook">Audiobook</MenuItem>
                                <MenuItem value="chapter">Chapter Updates</MenuItem>
                                <MenuItem value="comment">Comments</MenuItem>
                                <MenuItem value="e-book">E-Book</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                */}
            </Grid>
            <Divider className="pt-[10px]" />
            <div>
                {showPlaceholders && <PlaceholderComponent count={noOfNotifsPerPage} />}

                {!showPlaceholders && (
                    <>
                        {notifications?.map(notif => (
                            <UserNotification key={notif.id} notification={notif} />
                        ))}

                        {notificationsResult && notifications?.length == 0 && (
                            <div className="py-[20px]">No notifications</div>
                        )}
                    </>
                )}
            </div>

            {totalPages > 0 && (
                <div className="py-[20px]">
                    <Paging count={totalPages} page={page} onChange={handlePagination} />
                </div>
            )}
        </React.Fragment>
    );
}

//#endregion : Main component
