import { StyledHeaderMenu, StyledHeaderMenuWithArrow } from '@app/components/header/styles';
import { ZINDEX_USAGES } from '@app/domains/common/constants/zindex';
import { HEADER_HEIGHT_DOWN_SM, HEADER_HEIGHT_ONLY_SM } from '@app/domains/header/constants';
import { headerStickyAtom } from '@app/domains/header/recoils';
import { breakpoints } from '@app/utils/breakpoints';
import { useMediaQuery } from '@mui/material';
import { ClickAwayListener, Drawer, List, Menu } from '@mui/material';
import clsx from 'clsx';
import EventEmitter from 'eventemitter3';
import * as React from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useConstant from 'use-constant';

export type HeaderDropdownNavProps = {
    className?: string;
    children?: React.ReactNode;
    navRef: React.RefObject<Element | null>;
    showArrow?: boolean;
    width?: number;
    onDropdownToggled?: (open: boolean) => void;
};

export type HeaderDropdownRef = {
    toggleDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

type EmitterFuncs = {
    dropdownOpened: (key: number) => void;
    dropdownClosed: (key: number) => void;
};

export const HeaderDropdownEmitter = new EventEmitter<EmitterFuncs>();

let keyCtr = 0;

const getNewKey = () => {
    return ++keyCtr;
};

function HeaderDropdownNav(
    { children, className, showArrow, navRef, width, onDropdownToggled }: HeaderDropdownNavProps,
    ref: React.Ref<HeaderDropdownRef>
) {
    const dropdownKey = useConstant(() => getNewKey());
    const hasMounted = useRef(false);
    const previousOpenState = useRef(false);

    const headerSticky = useRecoilValue(headerStickyAtom);

    const [navOpen, setNavOpen] = useState(false);

    const isDownMd = useMediaQuery(breakpoints.downMd, { noSsr: true });
    const isOnlySm = useMediaQuery(breakpoints.onlySm, { noSsr: true });

    useEffect(() => {
        if (!headerSticky) {
            setNavOpen(false);
        }
    }, [headerSticky]);

    useImperativeHandle(
        ref,
        () => ({
            toggleDropdown: setNavOpen,
        }),
        []
    );

    useEffect(() => {
        if (hasMounted.current) {
            onDropdownToggled?.(navOpen);

            if (navOpen) {
                HeaderDropdownEmitter.emit('dropdownOpened', dropdownKey);

                previousOpenState.current = true;
            } else if (previousOpenState.current) {
                HeaderDropdownEmitter.emit('dropdownClosed', dropdownKey);

                previousOpenState.current = false;
            }
        }

        hasMounted.current = true;
    }, [dropdownKey, navOpen, onDropdownToggled]);

    useEffect(() => {
        const listener = (key: number) => {
            if (key !== dropdownKey) {
                // Only allow one dropdown nav to be open at a time
                previousOpenState.current = false;

                setNavOpen(false);
            }
        };

        HeaderDropdownEmitter.addListener('dropdownOpened', listener);

        return () => {
            HeaderDropdownEmitter.removeListener('dropdownOpened', listener);
        };
    }, [dropdownKey]);

    if (isDownMd) {
        return (
            <Drawer
                css={theme => ({
                    '& .MuiList-root': {
                        backgroundColor: theme.palette.background.default,
                        padding: '10px 0px 20px 0px',
                    },
                    '& .MuiMenuItem-root': {
                        padding: '10px 15px',
                        fontSize: '15px',
                        minHeight: '0px',
                    },
                    '& .MuiMenuItem-root .MuiTypography-root': {
                        fontSize: '15px',
                        lineHeight: '15px',
                    },
                    '& .MuiButton-root': {
                        fontSize: '13px',
                        fontWeight: 700,
                    },
                })}
                variant="temporary"
                anchor="top"
                className={className}
                elevation={0}
                disableScrollLock
                hideBackdrop
                keepMounted
                ModalProps={{
                    style: {
                        top: (() => {
                            if (isOnlySm) return `${HEADER_HEIGHT_ONLY_SM}px`;
                            return `${HEADER_HEIGHT_DOWN_SM}px`;
                        })(),
                        zIndex: ZINDEX_USAGES.HEADER_DROPDOWN,
                    },
                }}
                PaperProps={{
                    style: {
                        position: 'relative',
                        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.16)',
                    },
                }}
                open={navOpen}
                onClose={() => setNavOpen(false)}
            >
                <ClickAwayListener
                    onClickAway={e => {
                        const ref = navRef.current;

                        if (!ref || !ref.contains(e.target as Node)) {
                            setNavOpen(false);
                        }
                    }}
                >
                    <List>{children}</List>
                </ClickAwayListener>
            </Drawer>
        );
    }

    return (
        <Menu
            css={showArrow ? StyledHeaderMenuWithArrow : StyledHeaderMenu}
            className={clsx('h-0', className)}
            anchorEl={navRef.current}
            open={navOpen}
            hideBackdrop
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            PaperProps={{
                elevation: 0,
                style: {
                    width: width ? `${width + 24}px` : '100%',
                    maxHeight: '100vh',
                },
            }}
            MenuListProps={{
                disablePadding: true,
            }}
            onClose={() => setNavOpen(false)}
        >
            <ClickAwayListener
                onClickAway={e => {
                    const ref = navRef.current;

                    if (!ref || !ref.contains(e.target as Node)) {
                        setNavOpen(false);
                    }
                }}
            >
                <div>{children}</div>
            </ClickAwayListener>
        </Menu>
    );
}

const ForwardedDropdownNav = React.forwardRef(HeaderDropdownNav);

ForwardedDropdownNav.defaultProps = {
    showArrow: true,
};

export default ForwardedDropdownNav;
