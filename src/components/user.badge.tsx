import { VipItem_VipType } from '@app/_proto/Protos/vips';
import { ReactComponent as DiamondIcon } from '@app/assets/diamond.svg';
import { ReactComponent as PurchasedIcon } from '@app/assets/purchased.svg';
import type { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

//#region : Global constants and types
type BadgeType = 'vip' | 'purchased';

const getBadgeIcon = (badge: BadgeType): ReactElement | undefined => {
    switch (badge) {
        case 'vip':
            return <DiamondIcon className="h-10 w-10" />;
        case 'purchased':
            return <PurchasedIcon className="h-12 w-12" />;
    }
};

const getBadgeText = (badge: BadgeType): string | undefined => {
    switch (badge) {
        case 'vip':
            return 'VIP';
        case 'purchased':
            return 'Purchased';
    }
};

//#endregion : Global constants and types

//#region : Main component

/** Custom. Main component parameters type */
export type UserBadgeProps = {
    badgeType: BadgeType;
    vipType?: VipItem_VipType;
    className?: string;
};

/**
 * Custom helper component.
 *
 * Use it to display user's vip badge. Does not show the level of vip at the moment.
 */
export default function UserBadge(props: UserBadgeProps) {
    return (
        <span className={twMerge('flex items-center rounded-[3px] bg-gray-container-base px-4 py-2', props.className)}>
            <span
                className={twMerge(
                    'text-gray-550',
                    (props.badgeType === 'vip' || props.vipType === VipItem_VipType.Silver) && 'text-gray-550',
                    props.vipType === VipItem_VipType.Gold && 'text-[#FFA740]',
                    props.vipType === VipItem_VipType.Diamond && 'text-[#734BED]'
                )}
            >
                {getBadgeIcon(props.badgeType)}
            </span>
            <span className="font-set-b10 ml-2 text-gray-t1">{getBadgeText(props.badgeType)}</span>
        </span>
    );
}
