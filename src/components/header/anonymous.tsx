import { ReactComponent as UserIcon } from '@app/assets/user.svg';
import HeaderDropdownNav, { type HeaderDropdownRef } from '@app/components/header/dropdown.nav';
import PlainMenuItem from '@app/components/header/plain.menu.item';
import { StyledIconButton } from '@app/components/header/styles';
import HeaderThemeSwitcher from '@app/components/header/theme.switcher';
import { useComponentClasses } from '@app/components/hooks';
import { useAuth } from '@app/libs/auth';
import { Button, Divider, Grid, Typography } from '@mui/material';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

function AnonymousItems() {
    const { login } = useAuth();

    const { MuiButton: buttonClasses } = useComponentClasses('MuiButton');

    const handleClickLogin = useCallback(() => {
        login();
    }, [login]);

    return (
        <>
            <PlainMenuItem className="mb-[10px]">
                <Grid container justifyContent="center" alignItems="center" className="space-x-[10px]">
                    <Grid item>
                        <Button
                            classes={{
                                ...buttonClasses,
                                root: twMerge(buttonClasses.root, 'h-[36px] w-[180px] md:h-[35px] p-0'),
                            }}
                            onClick={handleClickLogin}
                            size="medium"
                            data-cy="header-button-login"
                        >
                            LOG IN
                        </Button>
                    </Grid>
                </Grid>
            </PlainMenuItem>
            <Divider className="!m-0 dark:border-[#444444]" />
            <PlainMenuItem>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography component="span" fontWeight={600}>
                            Mode
                        </Typography>
                    </Grid>
                    <Grid item>
                        <HeaderThemeSwitcher />
                    </Grid>
                </Grid>
            </PlainMenuItem>
        </>
    );
}

export default function HeaderAnonymous() {
    const navRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HeaderDropdownRef | null>(null);

    const [navOpen, setNavOpen] = useState(false);

    const handleNavOpen = useCallback((open: boolean) => {
        setNavOpen(open);
    }, []);

    return (
        <>
            <StyledIconButton
                className={clsx({
                    'text-blue': navOpen,
                    'text-gray-t0': !navOpen,
                })}
                ref={navRef}
                aria-haspopup="true"
                onClick={() => dropdownRef.current?.toggleDropdown(prev => !prev)}
                aria-label="profile nav"
                data-cy="header-button-user-anonymous"
            >
                <UserIcon className="h-24 w-24 md:h-28 md:w-28" />
            </StyledIconButton>
            <HeaderDropdownNav
                width={280}
                ref={dropdownRef}
                navRef={navRef}
                onDropdownToggled={handleNavOpen}
                css={{
                    '& .MuiList-root': {
                        paddingBottom: '0px !important',
                    },
                }}
            >
                <AnonymousItems />
            </HeaderDropdownNav>
        </>
    );
}
