import { NotificationItem_Status } from '@app/_proto/Protos/notifications';
import { logAnalyticsEvent } from '@app/analytics';
import { ReactComponent as NotificationsIcon } from '@app/assets/bell-on-small.svg';
import HeaderDropdownNav, { type HeaderDropdownRef } from '@app/components/header/dropdown.nav';
import PushNotificationsLink from '@app/components/header/push.notifications.link';
import { StyledIconButton, StyledNotificationsMenu } from '@app/components/header/styles';
import { MarkAllAsReadTxt } from '@app/components/notifications/notifications';
import UserNotification from '@app/components/user-notifications/user-notification';
import HeaderNotificationCountBadge from '@app/domains/header/components/HeaderNotificationCountBadge';
import { MAX_HEADER_NOTIFICATION_COUNT } from '@app/domains/header/constants';
import { useAuth } from '@app/libs/auth';
import { useNotifications, useNotificationsCount } from '@app/libs/notifications';
import { CircularProgress, Grid, MenuItem, Typography, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//#region : Main component

/**
 * Custom.
 *
 * Displays notification menu icon, it's sub menu
 * and handles notification actions.
 */
export default function HeaderNotifications() {
    //#region : Variables, functions and api calls

    //General
    const { user } = useAuth();

    const navigate = useNavigate();

    const dropdownRef = useRef<HeaderDropdownRef | null>(null);
    const navRef = useRef<HTMLButtonElement | null>(null);

    const showArrow = useMediaQuery('(min-width: 1500px)', {
        noSsr: true,
    });

    const [navOpen, setNavOpen] = useState(false);

    const { notificationsCount, refetchCount } = useNotificationsCount(user?.id, navOpen);
    const { notificationsResult, notifsLoading } = useNotifications(user?.id, navOpen);

    const handleNavOpen = useCallback(
        (open: boolean) => {
            setNavOpen(open);

            if (open) {
                refetchCount();
            }
        },
        [refetchCount]
    );

    //#region : Server request to fetch list of notifications

    const { items: notifications = [] } = notificationsResult ?? {
        items: [],
    };
    //#endregion : Server request to fetch list of notifications

    /**
     * Custom.
     *
     * Triggered when user clicks on the notification icon in the menu.
     * Opens the navigation menu.
     */
    const handleOnClickList = useCallback(() => {
        dropdownRef.current?.toggleDropdown(prev => !prev);
        logAnalyticsEvent('Click Notification');
    }, []);

    /**
     * Custom.
     *
     * Called by child component UserNotification
     * whenever user clicks on any of the actions of the notificatio item.
     */
    const onUserNotifAction = useCallback(() => {
        dropdownRef.current?.toggleDropdown(false);
    }, []);

    /**
     * Custom.
     *
     * Closes the notification menu and Navigates to the full list of notifications.
     */
    const handleNotifViewAllClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();

            dropdownRef.current?.toggleDropdown(false);

            navigate('/manage/profile/notifications');
            logAnalyticsEvent('Click Notification Page');
        },
        [navigate]
    );

    //#endregion : Variables, functions and api calls

    return (
        <React.Fragment>
            <StyledIconButton
                className={clsx({
                    'text-blue': navOpen,
                    'text-gray-t0': !navOpen,
                })}
                ref={navRef}
                aria-haspopup="true"
                onClick={handleOnClickList}
                aria-label="Notifications"
            >
                <HeaderNotificationCountBadge
                    showZero={false}
                    max={MAX_HEADER_NOTIFICATION_COUNT}
                    badgeContent={notificationsCount?.count || 0}
                >
                    <NotificationsIcon className="h-24 w-24 md:h-28 md:w-28" />
                </HeaderNotificationCountBadge>
            </StyledIconButton>
            <HeaderDropdownNav
                width={320}
                css={StyledNotificationsMenu}
                ref={dropdownRef}
                navRef={navRef}
                onDropdownToggled={handleNavOpen}
                showArrow={showArrow}
            >
                <MenuItem
                    disableRipple
                    className="cursor-auto pt-[10px] !pb-[2px] hover:bg-transparent"
                    focusVisibleClassName="!bg-transparent"
                >
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid display="flex" item className="space-x-[8px]">
                            <Grid item>
                                <Typography variant="subtitle2" className="!text-[16px] !font-semibold">
                                    Notifications
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography className="text-blue" variant="subtitle2">
                                    {notificationsCount?.count ?? 0}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid display="flex" item>
                            <a
                                href="#"
                                title="View all notifications"
                                onClick={handleNotifViewAllClick}
                                className="text-[12px] font-semibold uppercase text-blue"
                            >
                                View All
                            </a>
                        </Grid>
                    </Grid>
                </MenuItem>
                <div
                    className={clsx('mt-[10px]', {
                        'border-b border-solid border-[#e6e6e6] dark:border-[#444]': notifications.length > 0,
                    })}
                ></div>
                {notifsLoading && notifications.length === 0 && (
                    <MenuItem className="content-dead-center" dense disableGutters>
                        <CircularProgress className="m-[8px]" color="secondary" disableShrink />
                    </MenuItem>
                )}
                <div className="max-h-[290px] overflow-y-auto">
                    {notifications.map(notif => (
                        <MenuItem
                            className={clsx('cursor-auto !p-0', {
                                'bg-[#f3f3f3] dark:bg-[#13141580]': notif.status !== NotificationItem_Status.Unread,
                            })}
                            key={notif.id}
                            dense
                            disableGutters
                            disableRipple
                        >
                            <UserNotification onAction={onUserNotifAction} notification={notif} />
                        </MenuItem>
                    ))}
                </div>
                <div className="mb-[10px] border-t border-solid border-[#e6e6e6] dark:border-[#444]"></div>
                <MenuItem
                    className="!cursor-default !pt-px !pb-[2px] hover:!bg-transparent"
                    disableRipple
                    disableTouchRipple
                >
                    <div className="flex flex-1 items-center">
                        <MarkAllAsReadTxt />
                        <PushNotificationsLink />
                    </div>
                </MenuItem>
            </HeaderDropdownNav>
        </React.Fragment>
    );
}
//#endregion : Main component
