import { logAnalyticsEvent } from '@app/analytics';
import HeaderAuthenticated from '@app/components/header/authenticated';
import { HeaderDropdownEmitter } from '@app/components/header/dropdown.nav';
import HeaderMobileMenu from '@app/components/header/mobile.menu';
import HeaderResources from '@app/components/header/resources';
import { useNetworkStatus } from '@app/components/network.status';
import { useChatInfo } from '@app/domains/chat/hooks';
import Brand from '@app/domains/common/components/Brand';
import { ZINDEX_COMMON_USAGES, ZINDEX_USAGES } from '@app/domains/common/constants/zindex';
import HeaderSearchFetcher from '@app/domains/header/containers/HeaderSearchFetcher';
import { headerStickyAtom } from '@app/domains/header/recoils';
import { useScrollTrigger } from '@app/libs/hooks';
import { AppBar, Hidden, Slide } from '@mui/material';
import { type PropsWithChildren, memo } from 'react';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sticky from 'react-stickynode';
import { useSetRecoilState } from 'recoil';

export type HeaderProps = {
    showNavItems?: boolean;
};

function Header({ showNavItems = true }: HeaderProps) {
    const setHeaderSticky = useSetRecoilState(headerStickyAtom);
    const handleStickyHideChange = useCallback(
        hidden => {
            setHeaderSticky(!hidden);
        },
        [setHeaderSticky]
    );

    return (
        <>
            <HideOnScroll onHideChange={handleStickyHideChange}>
                {/* Do not remove the header id. Its used by chapter drawer to set the drawer top margins. */}
                <AppBar id="header" color="inherit" position="sticky" elevation={0}>
                    <div className="h-56 bg-gray-bg-elevate text-[14px] shadow-ww-underline sm:h-64 sm:shadow-ww-text-container md:h-72">
                        <div className="mx-auto flex h-full max-w-[1280px] flex-1 py-0 px-8 md:px-24">
                            <Brand>
                                <Brand.LogoIcon />
                                <Brand.Name className="hidden sm:inline" />
                            </Brand>
                            {showNavItems && (
                                <>
                                    <div className="hidden md:flex">
                                        <NavPartsItemCenter>
                                            <NavLinks />
                                        </NavPartsItemCenter>
                                    </div>
                                    <NavPartsItemRight>
                                        <Hidden implementation="css" mdDown>
                                            <div className="relative">
                                                <HeaderSearchFetcher />
                                            </div>
                                        </Hidden>
                                        <HeaderAuthenticated />
                                        <HeaderMobileMenu />
                                    </NavPartsItemRight>
                                </>
                            )}
                        </div>
                    </div>
                </AppBar>
            </HideOnScroll>
        </>
    );
}

export default memo(Header);

/**
 * Custom.
 *
 * If no collapsible header menus are open, it hides the header on scroll.
 *
 * We have to keep the header visible when any collapsible menu is open
 * because the header otherwise hides as soon as we click on the menu icon.
 * So, we are forced to keep the header visible even when it scrolls when any collapsible menu is open.
 *
 * If network is offline, it adds top margin to the header to accomodate the network error message.
 */

const HideOnScroll = memo(function HideOnScroll({
    children,
    headerStickyBoundary,
    onHideChange,
}: {
    children: ReactElement;
    headerStickyBoundary?: string;
    noOfExpandedMenu?: number;
    onHideChange?: (hidden: boolean) => void;
}) {
    const [transitionExited, setTransitionExited] = useState(false);
    const [menuExpanded, setMenuExpanded] = useState(false);
    const hidden = useScrollTrigger();

    const networkState = useNetworkStatus();
    const shouldSlideIn = !hidden || menuExpanded;

    const onTransitionEnter = () => {
        setTransitionExited(false);
    };

    const onTransitionExited = () => {
        setTransitionExited(true);
    };

    useEffect(() => {
        onHideChange?.(hidden);
    }, [hidden, onHideChange]);

    useEffect(() => {
        const openedListener = () => {
            setMenuExpanded(true);
        };

        const closedListener = () => {
            setMenuExpanded(false);
        };

        HeaderDropdownEmitter.addListener('dropdownOpened', openedListener);
        HeaderDropdownEmitter.addListener('dropdownClosed', closedListener);

        return () => {
            HeaderDropdownEmitter.removeListener('dropdownOpened', openedListener);
            HeaderDropdownEmitter.removeListener('dropdownClosed', closedListener);
        };
    }, []);

    return (
        <>
            <Sticky
                enabled
                top={!networkState ? 35 : 0}
                bottomBoundary={headerStickyBoundary}
                innerZ={transitionExited ? ZINDEX_COMMON_USAGES.HIDE_FROM_APP : ZINDEX_USAGES.HEADER}
                enableTransforms={false}
            >
                <Slide
                    direction="down"
                    in={shouldSlideIn}
                    appear={false}
                    onEnter={onTransitionEnter}
                    onExited={onTransitionExited}
                >
                    {children}
                </Slide>
            </Sticky>
        </>
    );
});

/** Custom. Misc. links to be shown in the header. */
function NavLinks() {
    const { canUseChat } = useChatInfo();

    return (
        <>
            <Link
                className="font-set-b16 flex h-full items-center px-12 text-gray-t0"
                to="/novels"
                onClick={() => {
                    logAnalyticsEvent('Click Series Tab');
                }}
            >
                Series
            </Link>
            <Link
                className="font-set-b16 flex h-full items-center px-12 text-gray-t0"
                to="/manage/bookmarks"
                onClick={() => {
                    logAnalyticsEvent('Click Bookmarks Tab');
                }}
            >
                Bookmarks
            </Link>
            <a
                className="font-set-b16 flex h-full items-center px-12 text-gray-t0"
                href="https://forum.wuxiaworld.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                Forum
            </a>
            {canUseChat && (
                <Link
                    className="font-set-b16 flex h-full items-center px-12 text-gray-t0"
                    to="/chat"
                    onClick={() => {
                        logAnalyticsEvent('Click Chat');
                    }}
                >
                    Chat
                </Link>
            )}
            <HeaderResources />
        </>
    );
}
//#endregion : Helper local function components to reduce main component code length

//#region : Main component

const NavPartsItemCenter = ({ children }: PropsWithChildren<{}>) => {
    return <div className="mr-8 flex flex-1 items-center pt-[8px] sm:pt-0 md:ml-13">{children}</div>;
};

const NavPartsItemRight = ({ children }: PropsWithChildren<{}>) => {
    return <div className="ml-auto flex items-center space-x-8">{children}</div>;
};
