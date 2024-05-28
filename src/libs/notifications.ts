import {
    GetMyNotificationsCountRequest,
    GetMyNotificationsRequest,
    NotificationItem_Status,
    SetNotificationStatusesRequest,
} from '@app/_proto/Protos/notifications';
import { NotificationsClient } from '@app/_proto/Protos/notifications.client';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';
import { useHttp } from '@app/libs/http';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useNotificationsCount = (userId: string | undefined, refreshEnabled: boolean) => {
    const getNotificationCountRequest = useGrpcRequest(GetMyNotificationsCountRequest, {
        status: NotificationItem_Status.Unread,
    });

    const { data: notificationsCount, refetch: refetchCount } = useGrpcApiWithQuery(
        NotificationsClient,
        c => c.getMyNotificationsCount,
        getNotificationCountRequest,
        ['user_notification_count', userId, getNotificationCountRequest],
        {
            staleTime: 1000 * 60 * 5, //Data stales in 5 minutes
            enabled: !!userId && refreshEnabled,
        }
    );

    return {
        notificationsCount,
        refetchCount,
    };
};

const useNotifications = (userId: string | undefined, refreshEnabled: boolean) => {
    const getNotificationsRequest = useGrpcRequest(GetMyNotificationsRequest, {
        status: NotificationItem_Status.Unread,
        pageInfo: {
            page: 1,
            count: 15,
        },
    });

    const { data: notificationsResult, isLoading: notifsLoading } = useGrpcApiWithQuery(
        NotificationsClient,
        c => c.getMyNotifications,
        getNotificationsRequest,
        ['user_notifications', userId, getNotificationsRequest],
        {
            staleTime: 1000 * 60 * 5, //Data stales in 5 minutes
            enabled: !!userId && refreshEnabled,
            keepPreviousData: true,
        }
    );

    return {
        notificationsResult,
        notifsLoading,
    };
};

const useAllNotifications = (userId: string | undefined, type: string, page: number, noOfNotifsPerPage: number) => {
    const getNotificationsRequest = useGrpcRequest(GetMyNotificationsRequest, {
        status: NotificationItem_Status.All,
        groups: type.length > 0 ? [type] : [],
        pageInfo: {
            page: page,
            count: noOfNotifsPerPage,
        },
    });

    const { data: notificationsResult, ...notificationsQuery } = useGrpcApiWithQuery(
        NotificationsClient,
        c => c.getMyNotifications,
        getNotificationsRequest,
        ['user_notifications', userId, getNotificationsRequest],
        {
            staleTime: 0, //Data is always stale
            refetchInterval: 1000 * 60 * 5,
            retry: false,
            showModalOnError: true,
        }
    );

    return {
        notificationsResult,
        notificationsQuery,
    };
};

const useMarkAllRead = () => {
    const queryClient = useQueryClient();
    const { grpcRequest } = useHttp();

    const markAllRead = useCallback(
        async userId => {
            const request = SetNotificationStatusesRequest.create({
                status: NotificationItem_Status.Read,
            });

            await grpcRequest(NotificationsClient, c => c.setNotificationStatuses, request);

            await Promise.all([
                queryClient.invalidateQueries(['user_notifications', userId]),
                queryClient.invalidateQueries(['user_notification_count', userId]),
            ]);
        },
        [grpcRequest, queryClient]
    );

    return {
        markAllRead,
    };
};

export { useNotificationsCount, useNotifications, useAllNotifications, useMarkAllRead };
