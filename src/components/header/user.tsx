import { logAnalyticsEvent } from '@app/analytics';
import { ReactComponent as UserIcon } from '@app/assets/user.svg';
import HeaderDropdownNav, { type HeaderDropdownRef } from '@app/components/header/dropdown.nav';
import PlainMenuItem from '@app/components/header/plain.menu.item';
import { StyledIconButton } from '@app/components/header/styles';
import HeaderThemeSwitcher from '@app/components/header/theme.switcher';
import { MarkAllAsReadTxt } from '@app/components/notifications/notifications';
import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import HeaderNotificationCountBadge from '@app/domains/header/components/HeaderNotificationCountBadge';
import { MAX_HEADER_NOTIFICATION_COUNT } from '@app/domains/header/constants';
import { useAuth } from '@app/libs/auth';
import { useNotificationsCount } from '@app/libs/notifications';
import { breakpoints } from '@app/utils/breakpoints';
import {
    Avatar,
    Grid,
    ListItemIcon,
    ListItemText as MuiListItemText,
    type ListItemTextProps,
    MenuItem,
    Typography,
} from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//#region : Main component

/** Custom. Main component parameters type */
export type Props = {
    showHeaderNotificationCounter?: boolean;
};

type UserItemsProps = {
    notificationCount?: number;
    onChangeRoute: (route: string) => void;
    onLogout: () => void;
};

const ListItemText = (props: ListItemTextProps) => {
    return <MuiListItemText {...props} primaryTypographyProps={{ fontWeight: 600 }} />;
};

function UserItems({ onChangeRoute, onLogout, notificationCount }: UserItemsProps) {
    const { user } = useAuth();

    return (
        <>
            <MenuItem>
                <div className="flex flex-row space-x-[8px]">
                    <div>
                        <Avatar alt={user?.userName} src={user?.avatarUrl?.value} />
                    </div>
                    <div className="flex-1 self-center whitespace-normal break-all font-semibold">{user?.userName}</div>
                </div>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onChangeRoute('/manage/profile/edit-profile');
                    logAnalyticsEvent('Click Profile');
                }}
            >
                <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onChangeRoute('/manage/profile/notifications');
                    logAnalyticsEvent('Click Notifications');
                }}
            >
                <ListItemText primary="Notifications" className="flex-none" />
                {!!notificationCount && notificationCount > 0 && (
                    <>
                        <ListItemIcon className="ml-[8px]">
                            <span className="font-set-b10 inline-flex h-16 items-center rounded-full bg-blue px-5 py-2 text-white">
                                {(notificationCount > MAX_HEADER_NOTIFICATION_COUNT
                                    ? `${MAX_HEADER_NOTIFICATION_COUNT}+`
                                    : notificationCount) || 0}
                            </span>
                        </ListItemIcon>
                        <div className="flex grow justify-end md:hidden">
                            <MarkAllAsReadTxt />
                        </div>
                    </>
                )}
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onChangeRoute('/manage/products/audiobooks');
                    logAnalyticsEvent('Click My Audiobooks');
                }}
            >
                <ListItemText primary="My Audiobooks" />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onChangeRoute('/manage/products/ebooks');
                    logAnalyticsEvent('Click My Ebooks');
                }}
            >
                <ListItemText primary="My Ebooks" />
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onChangeRoute('/manage/profile/settings');
                    logAnalyticsEvent('Click Setting');
                }}
            >
                <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem onClick={onLogout}>
                <ListItemText primary="Log out" />
            </MenuItem>
            <PlainMenuItem className="!pt-[0px] !pb-[0px]">
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography fontWeight={600}>Mode</Typography>
                    </Grid>
                    <Grid item>
                        <HeaderThemeSwitcher />
                    </Grid>
                </Grid>
            </PlainMenuItem>
        </>
    );
}

/**
 * Custom.
 *
 * Displays user menu icon and it's sub menu.
 */
function HeaderUser({ showHeaderNotificationCounter }: Props) {
    //General
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const dropdownRef = useRef<HeaderDropdownRef | null>(null);
    const navRef = useRef<HTMLButtonElement | null>(null);

    const showArrow = useMediaQuery('(min-width: 1500px)');

    const [navOpen, setNavOpen] = useState(false);

    const handleNavOpen = useCallback((open: boolean) => {
        setNavOpen(open);
    }, []);

    const handleLogout = useCallback(() => {
        logAnalyticsEvent('Click Logout');
        dropdownRef.current?.toggleDropdown(false);

        logout();
    }, [logout]);

    const handleGoToRoute = useCallback(
        (route: string) => {
            dropdownRef.current?.toggleDropdown(false);

            navigate(route);
        },
        [navigate]
    );

    const { notificationsCount } = useNotificationsCount(user?.id, !!user);

    //#endregion : Server request to fetch notifications count.

    return (
        <>
            <StyledIconButton
                className={clsx({
                    'text-blue': navOpen,
                    'text-gray-t0': !navOpen,
                })}
                disableRipple
                ref={navRef}
                aria-haspopup="true"
                onClick={() => {
                    dropdownRef.current?.toggleDropdown(prev => !prev);
                    logAnalyticsEvent('Click My Page');
                }}
                aria-label="profile nav"
                data-cy="header-button-user"
            >
                <HeaderNotificationCountBadge
                    showZero={false}
                    max={MAX_HEADER_NOTIFICATION_COUNT}
                    badgeContent={showHeaderNotificationCounter ? notificationsCount?.count || 0 : 0}
                >
                    <UserIcon className="h-24 w-24 md:h-28 md:w-28" />
                </HeaderNotificationCountBadge>
            </StyledIconButton>
            <HeaderDropdownNav
                css={{
                    [breakpoints.downMd]: {
                        '& .MuiList-root': {
                            paddingBottom: '15px !important',
                        },
                    },
                }}
                ref={dropdownRef}
                width={260}
                navRef={navRef}
                onDropdownToggled={handleNavOpen}
                showArrow={showArrow}
            >
                <UserItems
                    onLogout={handleLogout}
                    onChangeRoute={handleGoToRoute}
                    notificationCount={notificationsCount?.count}
                />
            </HeaderDropdownNav>
        </>
    );
}

/** Custom. Main component parameters default value */
HeaderUser.defaultProps = {
    showHeaderNotificationCounter: false,
};

export default HeaderUser;

//#endregion : Main component
