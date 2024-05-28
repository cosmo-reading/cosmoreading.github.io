import { logAnalyticsEvent } from '@app/analytics';
import { ReactComponent as Menu } from '@app/assets/menu.svg';
import HeaderDropdownNav, { type HeaderDropdownRef } from '@app/components/header/dropdown.nav';
import { ResourceItems } from '@app/components/header/resources';
import { StyledIconButton } from '@app/components/header/styles';
import { useChatInfo } from '@app/domains/chat/hooks';
import HeaderSearchFetcher from '@app/domains/header/containers/HeaderSearchFetcher';
import {
    Collapse,
    Divider,
    Hidden,
    List,
    ListItemText as MuiListItemText,
    type ListItemTextProps,
    MenuItem,
    Typography,
} from '@mui/material';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'mdi-material-ui';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ListItemText = (props: ListItemTextProps) => {
    return <MuiListItemText {...props} primaryTypographyProps={{ fontWeight: 700 }} />;
};

export default function HeaderMobileMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const { canUseChat } = useChatInfo();

    const [navOpen, setNavOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);

    const handleNavOpen = useCallback((open: boolean) => {
        setNavOpen(open);
    }, []);

    const navRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HeaderDropdownRef | null>(null);

    const handleMenuClick = useCallback(() => {
        dropdownRef.current?.toggleDropdown(prev => !prev);
    }, []);

    const handleResourcesClick = useCallback(() => {
        setResourcesOpen(prev => !prev);
        logAnalyticsEvent('Click Resources Tab');
    }, []);

    const onChangeRoute = useCallback(
        (route: string) => {
            dropdownRef.current?.toggleDropdown(false);

            navigate(route);
        },
        [navigate]
    );

    useEffect(() => {
        const ref = dropdownRef.current;

        return () => {
            ref?.toggleDropdown(false);
        };
    }, [location.pathname]);

    return (
        <Hidden implementation="css" mdUp>
            <StyledIconButton
                ref={navRef}
                className={clsx({
                    'text-blue': navOpen,
                    'text-gray-t0': !navOpen,
                })}
                onClick={handleMenuClick}
                aria-label="menu"
            >
                <Menu className="h-24 w-24 md:h-28 md:w-28" />
            </StyledIconButton>
            <HeaderDropdownNav
                ref={dropdownRef}
                navRef={navRef}
                onDropdownToggled={handleNavOpen}
                css={{
                    //First level of menu
                    '& > .MuiPaper-root > .MuiList-root > .MuiMenuItem-root .MuiTypography-root': {
                        fontSize: '17px',
                        lineHeight: '17px',
                    },
                }}
            >
                <MenuItem
                    css={{
                        '&:focus, &:hover, &.Mui-focusVisible': {
                            backgroundColor: 'transparent !important',
                        },
                    }}
                    disableRipple
                >
                    <div className="m-auto w-full">
                        <HeaderSearchFetcher />
                    </div>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onChangeRoute('/novels');
                        logAnalyticsEvent('Click Series Tab');
                    }}
                >
                    <ListItemText primary="Series" />
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onChangeRoute('/manage/bookmarks');
                        logAnalyticsEvent('Click Bookmarks Tab');
                    }}
                >
                    <ListItemText primary="Bookmarks" />
                </MenuItem>
                <MenuItem onClick={() => window.open('https://forum.wuxiaworld.com', '_blank')}>
                    <ListItemText primary="Forum" />
                </MenuItem>
                {canUseChat && (
                    <MenuItem
                        onClick={() => {
                            onChangeRoute('/chat');
                            logAnalyticsEvent('Click Bookmarks Tab');
                        }}
                    >
                        <ListItemText primary="Chat" />
                    </MenuItem>
                )}
                <MenuItem onClick={handleResourcesClick}>
                    <Typography component="span" className="font-bold text-[#212121] dark:text-[#B6B6B6]">
                        Resources
                        {resourcesOpen ? (
                            <ChevronUp className="h-[17px] w-[17px] font-semibold text-blue" />
                        ) : (
                            <ChevronDown className="h-[17px] w-[17px] font-semibold text-gray-400" />
                        )}
                    </Typography>
                </MenuItem>
                <div>
                    {resourcesOpen && <Divider className="mt-[10px] mb-[10px]" />}
                    <Collapse in={resourcesOpen} mountOnEnter unmountOnExit>
                        <List className="flex-1 !py-0">
                            <ResourceItems onChangeRoute={onChangeRoute} />
                        </List>
                    </Collapse>
                </div>
            </HeaderDropdownNav>
        </Hidden>
    );
}
