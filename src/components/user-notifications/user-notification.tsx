import {
    type NotificationItem,
    NotificationItem_Status,
    SetNotificationStatusRequest,
} from '@app/_proto/Protos/notifications';
import { NotificationsClient } from '@app/_proto/Protos/notifications.client';
import { ProductType } from '@app/_proto/Protos/products';
import { useAuth } from '@app/libs/auth';
import { useHttp } from '@app/libs/http';
import { timestampToUnix } from '@app/libs/utils';
import { useTimeAgo } from '@app/utils/time';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

//#region : Helpers

/** Custom. Helper function. Returns title and message based on notification type. */
const getNotificationMessageTitle = (notification: NotificationItem) => {
    const { data: dataMap, extraContent, actor } = notification;

    const data = Object.entries(dataMap).reduce<{ [key: string]: any }>((p, c) => {
        p[c[0]] = JSON.parse(c[1]);

        return p;
    }, {});

    const userData = Object.entries(extraContent).reduce<{ [key: string]: any }>((p, c) => {
        p[c[0]] = JSON.parse(c[1]);

        return p;
    }, {});

    let title: string | null = null;
    let message: string | null = null;

    switch (notification.type) {
        case 'announcement':
            title = 'New General Announcement';
            message = data.announcement.title;
            break;
        case 'chapter':
            title = 'New Chapter';
            message = `A new chapter of ${data.novel.name} has been released!`;

            if (userData.chapter?.prerelease) {
                title = 'New Advance Chapter';
                message = `A new advance chapter of ${data.novel.name} has been released!`;
            }

            break;
        case 'post':
            title = 'New Novel Announcement';
            message = `A new announcement on ${data.novel.name} is out!`;

            if (userData.post?.sponsors) {
                title = 'New Champion Announcement';
                message = `A new announcement on ${data.novel.name} for champions is out!`;
            }

            break;
        case 'comment':
            title = 'New reply to comment';
            message = `${actor?.value} replied to your comment on ${data.entity.title}.`;
            break;
        case 'review':
            title = 'Review Rejected';
            message = `Your review for ${data.review.novelName} has been rejected for ${data.review.reason}`;

            if (data.review.isApproved) {
                title = 'Review Approved';
                message = `Your review for ${data.review.novelName} has been approved.`;
            }

            break;
        case 'product_review':
            title = 'Review Rejected';
            message = `Your review for ${data.productReview.product.name} has been rejected for ${data.productReview.reason}`;

            if (data.productReview.isApproved) {
                title = 'Review Approved';
                message = `Your review for ${data.productReview.product.name} has been approved.`;
            }

            break;
        case 'wtu':
            title = `Read Now for FREE`;
            message = `${data.novel.name}`;
            break;
    }

    return {
        message,
        title,
    };
};

/** Custom. Return type of getNotificationLink function. */
type LinkData = {
    href: string | null;
};

/** Custom. Returns notification navigation link based on notification type. */
const getNotificationLink = (type: string | null, slug?: string, dataMap?: { [key: string]: string }): LinkData => {
    let href: string | null = null;

    const data = dataMap
        ? Object.entries(dataMap).reduce<{ [key: string]: any }>((p, c) => {
              p[c[0]] = JSON.parse(c[1]);

              return p;
          }, {}) || {}
        : {};

    switch (type) {
        case 'chapter':
            href = `/novel/${data.novel?.slug}/${slug}`;
            break;
        case 'post':
            href = `/announcements/${data.novel?.slug}/${slug}`;
            break;
        case 'comment':
            var linkData: LinkData | null = null;

            if (data.novel) {
                if (data.entity.type === 'Chapter') {
                    linkData = getNotificationLink('chapter', slug, dataMap);
                    linkData.href += '?bookmark=0';
                } else if (data.entity.type === 'Post') {
                    linkData = getNotificationLink('post', slug, dataMap);
                } else if (data.entity.type === 'CustomPage') {
                    linkData = getNotificationLink('page', slug, dataMap);
                }
            } else if (data.entity) {
                if (data.entity.type === 'Announcement') {
                    linkData = getNotificationLink('announcement', slug, dataMap);
                } else if (data.entity.type === 'CustomPage') {
                    linkData = getNotificationLink('page', slug, dataMap);
                }
            }

            if (linkData) {
                href = `${linkData.href}#${data.comment._id}`;
            }
            break;
        case 'review':
            href = `/novel/${slug}?seeReview=true`;
            break;
        case 'product_review':
            href = '';
            if (data.productReview) {
                switch (data.productReview.product.type) {
                    case ProductType.EbookProduct:
                        href = '/manage/products/ebooks';
                        break;
                    case ProductType.AudiobookProduct:
                        href = '/manage/products/audiobooks';
                        break;
                    default:
                        href = '';
                        break;
                }
            }
            break;
        case 'announcement':
            href = `/news/${slug}`;
            break;
        case 'wtu':
            href = `/novel/${data.novel?.slug}`;
            break;
    }

    return {
        href,
    };
};

const getNotificationActionText = (notification: NotificationItem) => {
    const { data: dataMap } = notification;

    const data = Object.entries(dataMap).reduce<{ [key: string]: any }>((p, c) => {
        p[c[0]] = JSON.parse(c[1]);

        return p;
    }, {});

    let actionText = 'READ';

    switch (notification.type) {
        case 'review':
            if (!data.review.isApproved) {
                actionText = 'RESUBMIT';
            }

            break;
        case 'product_review':
            if (!data.productReview.isApproved) {
                actionText = 'RESUBMIT';
            }

            break;
        default:
            actionText = 'READ';
            break;
    }

    return actionText;
};
//#endregion : Helpers

//#region : Main component

/** Custom. Main component parameters type */
export type UserNotificationProps = {
    notification: NotificationItem;
    onAction?: () => void;
};

/**
 * Custom.
 *
 * Displays details of the given notification and handles its corresponding actions
 */
export default function UserNotification({ notification, onAction }: UserNotificationProps) {
    //#region : Variables, functions and api calls

    const { grpcRequest } = useHttp();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    //#region : Display helper variables

    /** Custom. Contains notification navigation link. */
    const link = useMemo(
        () => getNotificationLink(notification.type, notification.slug?.value, notification.data),
        [notification.data, notification.slug, notification.type]
    );

    /** Custom. Contains notification message. */
    const messageTitle = useMemo(() => getNotificationMessageTitle(notification), [notification]);

    const actionText = useMemo(() => getNotificationActionText(notification), [notification]);

    /** Custom. Contains formatted notification created date. */
    const timeAgo = useTimeAgo(timestampToUnix(notification.createdOn), {
        refreshInterval: 0,
    });

    //#endregion : Display helper variables

    const linkState = useMemo(() => {
        switch (notification.type) {
            case 'chapter':
                return { from: 'Notification' };
            default:
                return null;
        }
    }, [notification]);

    //#region : Action handlers

    /**
     * Custom.
     *
     * Handles notification navigation.
     * It marks the notification as read and then calls the parent action handler function.
     */
    const onGoToNotification = useCallback(async () => {
        if (notification.status !== NotificationItem_Status.Read) {
            const request = SetNotificationStatusRequest.create({
                id: {
                    oneofKind: 'objectId',
                    objectId: notification.objectId,
                },
                status: NotificationItem_Status.Read,
            });

            try {
                await grpcRequest(NotificationsClient, c => c.setNotificationStatus, request);

                await Promise.all([
                    queryClient.invalidateQueries(['user_notifications']),
                    queryClient.invalidateQueries(['user_notification_count']),
                ]);
            } catch (e) {
                console.error(e);
            }
        }

        onAction?.();
    }, [grpcRequest, notification, onAction, queryClient, user?.id]);

    //#endregion : Action handlers

    //#endregion : Variables, functions and api calls

    return (
        <div className="w-full border-t border-[#f0f0f0] dark:border-[#444]">
            <div
                className={clsx(
                    'px-[15px] pt-[12px] pb-[0px] text-[14px] font-semibold text-[#212121] dark:text-white',
                    {
                        '!text-[#888888]': notification.status !== NotificationItem_Status.Unread,
                    }
                )}
            >
                {messageTitle.title}
            </div>
            <div className="whitespace-normal px-[15px] pt-[4px] pb-[12px]">
                <div className="grid auto-cols-auto grid-flow-col gap-[54px]">
                    <div className="!font-semibold text-[#888888]">
                        <div className="mb-[5px] text-[13px] leading-[18px]">{messageTitle.message}</div>
                        <div className="text-[12px] leading-[17px]">{timeAgo}</div>
                    </div>
                    <div className="text-right">
                        {!!link.href && (
                            <Link to={link.href} state={linkState}>
                                <Button
                                    disableRipple
                                    className="min-w-0 rounded-none !p-0 !text-[13px] font-semibold text-blue"
                                    onClick={onGoToNotification}
                                    variant="text"
                                    color="secondary"
                                >
                                    {actionText}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

//#endregion : Main component
