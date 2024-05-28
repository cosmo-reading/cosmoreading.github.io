import { logAnalyticsEvent } from '@app/analytics';
import Divider from '@app/components/Divider';
import type { TabProps } from '@app/components/tabs/tab';
import { BOOKMARK_EVENT_NAMES, BookmarkEvents } from '@app/domains/bookmark/analytics/amplitude/events';
import { Tab, Tabs as MuiTabs } from '@mui/material';
import clsx from 'clsx';
import {
    type ComponentType,
    type HTMLProps,
    type ReactElement,
    type ReactNode,
    type Ref,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import SwipeableViews from 'react-swipeable-views';
import { twMerge } from 'tailwind-merge';

//#region : Global constants and types

/**
 * Custom.
 *
 * Passed as parameter using ... spread operator to 'Tab' function component.
 * It generates individual tab's id and a11y props based on the index passed.
 */
function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

/** Custom. Used as type of 'items' - one of the parameter of main component. */
export type TabItem<K> = {
    key: K;
    name: string;
    component?: React.ReactNode | (() => React.ReactNode);
    hidden?: boolean;
    icon?: ReactElement | undefined;
};

/** Custom. Used as type of 'TabsContainer' - one of the parameter of main component. */
export type TabsContainerProps<T> = {
    children: React.ReactNode;
    selectedTab: TabItem<T> | null;
};

//#endregion : Global constants and types

//#region : Helper local function components to reduce main component code length

/** Custom. Helper function component - acts as an empty wrapper. */
const NoOpContainer = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    return <div className={className}>{children}</div>;
};

/** Custom. 'TabPanel' component parameter type */
type TabPanelProps = Omit<HTMLProps<HTMLDivElement>, 'value'> & {
    children?: ReactNode;
    index?: number;
    keepMounted?: boolean;
    value: number | null;
};

function TabPanelContent({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

/** Custom. Helper function component to create tab's panel. */
function TabPanel({ children, className, value, index, keepMounted, ...other }: TabPanelProps) {
    const [mountBox, setMountBox] = useState(index === value);

    useEffect(() => {
        if (index === value) {
            setMountBox(true);
        } else if (!keepMounted) {
            setMountBox(false);
        }
    }, [index, keepMounted, value]);

    const hidden = index !== value;

    return (
        <div
            className={clsx(
                'h-full',
                {
                    'visibility-hidden': hidden,
                },
                className
            )}
            role="tabpanel"
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {mountBox && <TabPanelContent>{children}</TabPanelContent>}
        </div>
    );
}

//#endregion : Helper local function components to reduce main component code length

//#region : Main component

/** Custom. Main component parameters type */
export type TabsProps<K> = {
    items: readonly TabItem<K>[];
    className?: string;
    classes?: {
        tabFlexContainer?: string;
        tab?: string;
        divider?: string;
    };
    defaultItem?: TabItem<K> | null;
    children?: ReactElement<TabProps> | (ReactElement<TabProps> | null)[];
    TabsContainer?: ComponentType<TabsContainerProps<K>> | null;
    TabsPanelContainer?: ComponentType | null;
    onChange?: (item: TabItem<K>) => void;
    panelProps?: TabPanelProps;
    keepTabsMounted?: boolean;
    swipeable?: boolean;
    divider?: boolean;
    dividerClassName?: string;
};

/** Custom. Tab key type */
type TabKey<K> = K extends {
    key: infer U;
}
    ? U
    : never;

/** Custom. Main component parameters reference type */
export type TabsRef<K> = {
    setItem: (key: TabKey<K>) => void;
};

/**
 * Custom.
 *
 * Use it when you want a normal tabs component.
 * Clicking on the tab pill does not change the url.
 * Tab pills are swipeable when the screen space is not enough.
 */
function TabsComponent<T extends string | number>(
    {
        items,
        className,
        classes, // borrowed the concept from https://mui.com/api/tabs/#css
        panelProps,
        swipeable,
        defaultItem,
        keepTabsMounted,
        onChange,
        TabsContainer,
        TabsPanelContainer,
        divider,
        dividerClassName,
    }: TabsProps<T> = {
        swipeable: true,
        items: [],
        classes: {},
        defaultItem: null,
        TabsContainer: null,
        TabsPanelContainer: null,
        keepTabsMounted: true,
        divider: true,
        dividerClassName: '',
    },
    ref: Ref<TabsRef<T>>
) {
    //#region : Variables, functions and api calls

    const [selectedTabIndex, setSelectedTabIndex] = useState(() => (defaultItem ? items.indexOf(defaultItem) : 0));

    /**
     * Custom.
     *
     * We will expose this function to the parent component using imperativeHandle.
     * Parent component will be able to change the tab using ref.
     */
    const setItem = useCallback(
        (key: TabKey<T>) => {
            const index = items.filter(f => !f.hidden).findIndex(f => f.key === key);

            if (index === -1) {
                throw new Error('Item not found');
            }

            setSelectedTabIndex(index);
        },
        [items]
    );

    //Parent component can call the functions
    //declared inside the imperative handle using ref.
    useImperativeHandle(
        ref,
        () => ({
            setItem,
        }),
        [setItem]
    );

    //#region : Action handlers

    /** Custom. Used when tabs are not swipeable. */
    const handleChange = useCallback(
        (event, newValue: number) => {
            const tabName = event.target.innerText;
            const eventName = (() => {
                if (tabName === 'Current Reads') return BOOKMARK_EVENT_NAMES[BookmarkEvents.ClickCurrentReads];
                if (tabName === 'Favorite Chapters') return BOOKMARK_EVENT_NAMES[BookmarkEvents.ClickFavoriteChapters];
            })();

            if (eventName) {
                logAnalyticsEvent(eventName);
            }

            setSelectedTabIndex(newValue);

            onChange?.(items[newValue]);
        },
        [items, onChange]
    );

    /** Custom. Used when tabs are set to be swipeable. */
    const handleChangeIndex = useCallback(
        (index: number) => {
            setSelectedTabIndex(index);

            onChange?.(items[index]);
        },
        [items, onChange]
    );

    //#endregion : Action handlers

    //#endregion : Variables, functions and api calls

    const Container = TabsContainer || NoOpContainer;
    const PanelContainer = TabsPanelContainer || NoOpContainer;

    return (
        <div className={className}>
            <Container selectedTab={selectedTabIndex ? items[selectedTabIndex] : null}>
                <MuiTabs
                    className="!mb-0 min-h-0 overflow-visible"
                    value={selectedTabIndex}
                    classes={{
                        scroller: '!overflow-visible',
                        flexContainer: classes?.tabFlexContainer,
                    }}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    variant="scrollable"
                    TabIndicatorProps={{
                        className: 'h-[3px] bg-blue-600 z-20',
                    }}
                >
                    {items
                        .filter(f => !f.hidden)
                        .map((it, idx) => (
                            <Tab
                                className={twMerge('min-h-0 min-w-0 !text-grey-900 dark:!text-white', classes?.tab)}
                                key={String(it.key)}
                                label={<span>{it.name}</span>}
                                disableRipple
                                icon={it.icon}
                                {...a11yProps(idx)}
                            />
                        ))}
                </MuiTabs>
            </Container>
            {divider && <Divider className={twMerge(dividerClassName, classes?.divider)} />}
            <PanelContainer>
                {swipeable ? (
                    <SwipeableViews axis="x" index={selectedTabIndex} onChangeIndex={handleChangeIndex}>
                        {items
                            .filter(f => !f.hidden)
                            .map((it, idx) => (
                                <TabPanel
                                    key={it.key}
                                    value={selectedTabIndex}
                                    index={idx}
                                    keepMounted={keepTabsMounted}
                                    {...panelProps}
                                >
                                    {typeof it.component === 'function' ? it.component() : it.component}
                                </TabPanel>
                            ))}
                    </SwipeableViews>
                ) : (
                    <>
                        {items
                            .filter(f => !f.hidden)
                            .map((it, idx) => (
                                <TabPanel
                                    key={it.key}
                                    value={selectedTabIndex}
                                    index={idx}
                                    keepMounted={keepTabsMounted}
                                    {...panelProps}
                                >
                                    {typeof it.component === 'function' ? it.component() : it.component}
                                </TabPanel>
                            ))}
                    </>
                )}
            </PanelContainer>
        </div>
    );
}

/**
 * Custom.
 *
 * Use it when you want a normal tabs component.
 * Clicking on the tab pill does not change the url.
 * Tab pills are swipeable when the screen space is not enough.
 */
const Tabs = forwardRef(TabsComponent);
Tabs.defaultProps = {
    keepTabsMounted: true,
};

export default Tabs;

//#endregion : Main component
