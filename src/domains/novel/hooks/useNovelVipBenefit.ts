import type { NovelItem } from '@app/_proto/Protos/novels';
import useUnlocks from '@app/domains/common/hooks/useUnlocks';
import type { VipType } from '@app/domains/common/types';
import { parseUserStatus } from '@app/domains/common/utils';
import { checkIfVipBenefitNovel } from '@app/domains/novel/utils';
import { useAuth } from '@app/libs/auth';
import type { UseQueryResult } from '@tanstack/react-query';

type UseNovelVipBenefitReturn = {
    isVipBenefit: boolean;
    isLoading: boolean;
    isPending: boolean;
    queryResult: UseQueryResult;
};

export default function useNovelVipBenefit(novel: NovelItem | undefined): UseNovelVipBenefitReturn {
    const { user } = useAuth();
    const { vipTypeReadable, isVipActive } = parseUserStatus(user);
    const activeVipTypeReadable: VipType | undefined = isVipActive ? vipTypeReadable : undefined;
    const {
        data: unlocks,
        isLoading,
        isPending,
        queryResult,
    } = useUnlocks({
        staleTime: 1000 * 60 * 60,
        cacheTime: 1000 * 60 * 60,
    });

    const isVipBenefit = checkIfVipBenefitNovel({
        novel,
        activeVipTypeReadable,
        unlocks,
    });

    return {
        isVipBenefit,
        isLoading,
        isPending,
        queryResult,
    };
}
