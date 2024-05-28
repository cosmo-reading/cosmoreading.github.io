import { VipItem_VipType } from '@app/_proto/Protos/vips';

export const VIP_FREE_NOVELS_LIMIT = {
    [VipItem_VipType.Silver]: 1,
    [VipItem_VipType.Gold]: 3,
    [VipItem_VipType.Diamond]: Number.POSITIVE_INFINITY,
} as const;

export const VIP_TYPE_TO_READABLE = {
    [VipItem_VipType.Silver]: 'SILVER',
    [VipItem_VipType.Gold]: 'GOLD',
    [VipItem_VipType.Diamond]: 'DIAMOND',
} as const;

export const LIMITED_VIP_TYPES = [VipItem_VipType.Silver, VipItem_VipType.Gold];
