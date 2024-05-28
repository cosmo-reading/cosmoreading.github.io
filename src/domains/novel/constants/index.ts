import type { TabItem } from '@app/components/tabs/tabs';
import type { SkeletonProps } from '@mui/material';

export const BASE_SKELETON_PROPS: SkeletonProps = {
    animation: 'wave',
    variant: 'rectangular',
};

export type TabItemKeys = 'about' | 'chapters' | 'champion';

export const TAB_ITEMS: TabItem<TabItemKeys>[] = [
    {
        name: 'About',
        key: 'about',
    },
    {
        name: 'Chapters',
        key: 'chapters',
    },
    {
        name: 'Champion',
        key: 'champion',
        hidden: false,
    },
];
