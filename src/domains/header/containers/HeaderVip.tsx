import { MissionItem_MissionType } from '@app/_proto/Protos/missions';
import { VipItem_VipType } from '@app/_proto/Protos/vips';
import { logAnalyticsEvent } from '@app/analytics';
import { ReactComponent as DiamondIcon } from '@app/assets/diamond.svg';
import HeaderDropdownNav, { type HeaderDropdownRef } from '@app/components/header/dropdown.nav';
import PlainMenuItem from '@app/components/header/plain.menu.item';
import { StyledIconButton } from '@app/components/header/styles';
import { getMissionLimit } from '@app/components/karma/utils';
import { ContentAlignCenter } from '@app/components/shared/generic.styles';
import useCompleteMyLoginMission from '@app/domains/common/hooks/useCompleteMyLoginMission';
import useMyCompletedMissions from '@app/domains/common/hooks/useMyCompletedMissions';
import useMyKarma from '@app/domains/common/hooks/useMyKarma';
import useUserStatus from '@app/domains/common/hooks/useUserStatus';
import { HeaderEvents } from '@app/domains/header/analytics/amplitude/events';
import { headerAnalyticsFactory } from '@app/domains/header/analytics/amplitude/handlers';
import {
    Button,
    Divider,
    Grid,
    ListItemText as MuiListItemText,
    type ListItemTextProps,
    MenuItem,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { YinYang } from 'mdi-material-ui';
import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderVip() {
    const navigate = useNavigate();
    const { user, isLegacyVip } = useUserStatus();
    const queryClient = useQueryClient();
    const vipNavRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HeaderDropdownRef | null>(null);

    const [navOpen, setNavOpen] = useState(false);
    const [checkedIn, setCheckedIn] = useState(false);

    const showArrow = useMediaQuery('(min-width: 1500px)', {
        noSsr: true,
    });

    const { goldenKarma, earnedKarma, refetch: refetchMyKarma } = useMyKarma();
    const { myCheckInTimesToday, refetch: refetchMyCompletedMissions } = useMyCompletedMissions();
    const { executeRequest: completeCheckIn, loading: checkingIn } = useCompleteMyLoginMission({
        onCompleted: () => {
            headerAnalyticsFactory(HeaderEvents.ClickLoginCheckIn)({ on: 'GNB' });
            refetchMyKarma();
            refetchMyCompletedMissions();
            queryClient.invalidateQueries(['karma-transactions', user?.id]);
        },
    });

    useEffect(() => {
        setCheckedIn(prev => (checkingIn ? true : prev));
    }, [checkingIn]);

    const handleNavOpen = useCallback(
        (open: boolean) => {
            refetchMyKarma();
            refetchMyCompletedMissions();
            setNavOpen(open);
        },
        [refetchMyKarma, refetchMyCompletedMissions]
    );

    /** Custom. Closes the menu and Navigates to the given url. */
    const goToRoute = useCallback(
        (url: string) => {
            dropdownRef.current?.toggleDropdown(false);

            navigate(url);
        },
        [navigate]
    );

    const vipSubscriptionType = useMemo(() => {
        let packageName: string | null = null;

        switch (user?.vip?.type) {
            case VipItem_VipType.Silver:
                packageName = 'Silver';
                break;
            case VipItem_VipType.Gold:
                packageName = 'Gold';
                break;
            case VipItem_VipType.Diamond:
                packageName = 'Diamond';
                break;
        }

        return user?.isVipActive ? packageName || 'Active' : 'Inactive';
    }, [user?.isVipActive, user?.vip?.type]);

    const checkInLimit = getMissionLimit(MissionItem_MissionType.MissionTypeCheckIn);

    const checkInDisabled = checkingIn || checkedIn || myCheckInTimesToday >= checkInLimit;

    return (
        <>
            <StyledIconButton
                className={clsx({
                    'text-blue': navOpen,
                    'text-gray-t0': !navOpen,
                })}
                ref={vipNavRef}
                aria-haspopup="true"
                onClick={() => {
                    dropdownRef.current?.toggleDropdown(prev => !prev);
                    logAnalyticsEvent('Click Store');
                }}
                aria-label="VIP"
            >
                <DiamondIcon className="h-24 w-24 md:h-28 md:w-28" />
            </StyledIconButton>
            <HeaderDropdownNav
                width={260}
                ref={dropdownRef}
                navRef={vipNavRef}
                onDropdownToggled={handleNavOpen}
                showArrow={showArrow}
            >
                <PlainMenuItem>
                    <Grid container flexDirection="column" className="space-y-[8px]">
                        <Grid item>
                            <Grid container alignItems="center" className="space-x-[16px]">
                                <Grid item css={ContentAlignCenter}>
                                    <YinYang fontSize="small" className="text-[#FFE000]" />
                                    &nbsp;
                                    <Typography
                                        className="!text-[14px] dark:text-white"
                                        variant="body1"
                                        color="GrayText"
                                    >
                                        {goldenKarma
                                            ? goldenKarma.toLocaleString('en-US')
                                            : status === 'loading'
                                              ? '...'
                                              : 0}
                                    </Typography>
                                </Grid>
                                <Grid item css={ContentAlignCenter}>
                                    <YinYang fontSize="small" />
                                    &nbsp;
                                    <Typography
                                        className="!text-[14px] dark:text-white"
                                        variant="body1"
                                        color="GrayText"
                                    >
                                        {earnedKarma
                                            ? earnedKarma.toLocaleString('en-US')
                                            : status === 'loading'
                                              ? '...'
                                              : 0}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className="space-x-[8px]" item>
                            {user?.isVipActive && (
                                <Button
                                    onClick={() => goToRoute('/manage/subscriptions/vip')}
                                    variant="contained"
                                    color="primary"
                                    className={clsx('h-[36px] py-[7px] px-0 md:h-[35px]', {
                                        'w-[139px] md:w-[123px]': user?.vip?.type === VipItem_VipType.Diamond,
                                        'w-[117px] md:w-[98px]': user?.vip?.type === VipItem_VipType.Gold,
                                        'w-[111px] md:w-[102px]': user?.vip?.type === VipItem_VipType.Silver,
                                        'w-[111px]': !user.vip,
                                    })}
                                >
                                    <DiamondIcon
                                        fontSize="inherit"
                                        className="h-[22px] w-[22px] fill-current text-white"
                                    />
                                    VIP {vipSubscriptionType}
                                </Button>
                            )}
                            {!user?.isVipActive && isLegacyVip && (
                                <Button
                                    onClick={() => {
                                        goToRoute('/manage/subscriptions/vip');
                                        headerAnalyticsFactory(HeaderEvents.ClickVip)({ on: 'GNB Get VIP' });
                                    }}
                                    variant="contained"
                                    color="primary"
                                    className="h-[36px] w-[108px] px-[30px] py-[7px] md:h-[35px] md:w-[94px] md:px-[25px] md:py-[7px]"
                                >
                                    GET VIP
                                </Button>
                            )}

                            <Button
                                onClick={() => {
                                    goToRoute('/manage/subscriptions/karma');
                                    logAnalyticsEvent('Click Karma', { On: 'Get Karma' });
                                }}
                                variant="outlined"
                                color="secondary"
                                className="h-[36px] w-[108px] px-[16px] py-[7px] text-[#1E1E1E] dark:text-current md:h-[35px] md:w-[94px] md:px-[13px] md:py-[7px]"
                            >
                                GET KARMA
                            </Button>
                        </Grid>
                    </Grid>
                </PlainMenuItem>
                <Divider className="!mt-[10px] !mb-[10px] border-current text-[#F0F0F0] dark:text-[#444] sm:!mb-[0px]" />
                <PlainMenuItem>
                    <div className="flex flex-col py-[5px]">
                        <div>
                            <ListItemText
                                primary="Check-in"
                                secondary="Earn 100 regular Karma everyday"
                                secondaryTypographyProps={{
                                    className: 'mt-[5px] !text-[#888888] !text-[13px] !leading-tight',
                                }}
                            />
                        </div>
                        <div className="mt-[11px]">
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={clsx(
                                    'h-[36px] w-[108px] px-[16px] text-[#1E1E1E] dark:text-current md:h-[27px] md:min-w-[103px] md:px-[13px]',
                                    {
                                        '!border-[#D7D7D7] bg-[#D7D7D7] text-[#888888] !shadow-none dark:!border-[#505050] dark:bg-[#505050]':
                                            checkInDisabled,
                                    }
                                )}
                                disabled={checkInDisabled}
                                onClick={completeCheckIn}
                            >
                                {checkInDisabled ? 'COMPLETED' : 'COMPLETE'}
                            </Button>
                        </div>
                    </div>
                </PlainMenuItem>
                <Divider className="!mt-[0px] !mb-[10px] border-current text-[#F0F0F0] dark:text-[#444] sm:!mb-[0px]" />
                <MenuItem
                    onClick={() => {
                        goToRoute('/manage/subscriptions/sponsorships');
                    }}
                    data-amplitude-click-event={HeaderEvents.ClickChampion}
                >
                    <MenuItemText>Champion</MenuItemText>
                </MenuItem>
                {isLegacyVip && (
                    <MenuItem
                        onClick={() => {
                            goToRoute('/manage/subscriptions/vip');
                            logAnalyticsEvent('Click Vip', { On: 'Adfree Line' });
                        }}
                    >
                        <MenuItemText>VIP</MenuItemText>
                    </MenuItem>
                )}
                <MenuItem
                    onClick={() => {
                        goToRoute('/manage/subscriptions/karma');
                        logAnalyticsEvent('Click Karma', { On: 'Karma' });
                    }}
                >
                    <MenuItemText>Karma</MenuItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        goToRoute('/manage/subscriptions/billing');
                        logAnalyticsEvent('Click Billing');
                    }}
                >
                    <MenuItemText>Billing</MenuItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        goToRoute('/manage/subscriptions/faq');
                        logAnalyticsEvent('Click FAQ');
                    }}
                >
                    <MenuItemText>FAQ</MenuItemText>
                </MenuItem>
            </HeaderDropdownNav>
        </>
    );
}
//#endregion : Main component

const MenuItemText = ({ children }: PropsWithChildren<{}>) => {
    return <span className="font-set-sb15 text-gray-900 dark:text-[#b6b6b6]">{children}</span>;
};

const ListItemText = (props: ListItemTextProps) => {
    return <MuiListItemText {...props} primaryTypographyProps={{ fontWeight: 600 }} />;
};

export default HeaderVip;
