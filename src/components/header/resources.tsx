import { ReactComponent as ArrowUp } from '@app/assets/arrow-up.svg';
import HeaderDropdownNav, { type HeaderDropdownRef } from '@app/components/header/dropdown.nav';
import { HeaderEvents } from '@app/domains/header/analytics/amplitude/events';
import { headerAnalyticsFactory } from '@app/domains/header/analytics/amplitude/handlers';
import { type ListItemTextProps, MenuItem, ListItemText as MuiListItemText } from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export type ResourceItemsProps = {
    onChangeRoute: (route: string) => void;
    disableGutters?: boolean;
};

const ListItemText = (props: ListItemTextProps) => {
    return <MuiListItemText {...props} primaryTypographyProps={{ fontWeight: 600 }} />;
};

export const ResourceItems = React.memo(function ResourceItems({ onChangeRoute, disableGutters }: ResourceItemsProps) {
    const handleOpenJobs = () => {
        window.open('https://www.careers-page.com/wuxiaworld', '_blank', 'noopener noreferrer');
    };

    return (
        <>
            <MenuItem
                disableGutters={disableGutters}
                onClick={() => {
                    onChangeRoute('/ebooks');
                    headerAnalyticsFactory(HeaderEvents.ClickEbooksTab)();
                }}
            >
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary="Ebooks" />
            </MenuItem>
            <MenuItem onClick={handleOpenJobs}>
                <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary="Jobs" />
            </MenuItem>
        </>
    );
});

function HeaderResources() {
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HeaderDropdownRef | null>(null);

    const handleClick = useCallback(() => {
        dropdownRef.current?.toggleDropdown(prev => !prev);
        headerAnalyticsFactory(HeaderEvents.ClickResourcesTab)();
    }, []);

    const handleChangeRoute = useCallback(
        (route: string) => {
            dropdownRef.current?.toggleDropdown(false);

            navigate(route);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigate]
    );

    const handleDropdownToggled = useCallback((open: boolean) => {
        setDropdownOpen(open);
    }, []);

    return (
        <>
            <button
                className="font-set-b16 flex h-full items-center pl-12 text-gray-t0"
                ref={navRef}
                type="button"
                onClick={handleClick}
                aria-haspopup="true"
            >
                Resources
                <ArrowUp
                    className={clsx('ml-2 h-14 w-14 font-semibold', {
                        'text-blue': dropdownOpen,
                        'rotate-180 text-gray-desc': !dropdownOpen,
                    })}
                />
            </button>
            <HeaderDropdownNav
                width={260}
                ref={dropdownRef}
                navRef={navRef}
                onDropdownToggled={handleDropdownToggled}
                css={{
                    '.MuiPaper-root': {
                        marginTop: '-14px',
                    },
                }}
            >
                <ResourceItems onChangeRoute={handleChangeRoute} />
            </HeaderDropdownNav>
        </>
    );
}

export default HeaderResources;
