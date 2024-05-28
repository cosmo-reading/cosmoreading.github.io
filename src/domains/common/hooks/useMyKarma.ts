import { GetMyKarmaTotalsRequest, KarmaGroup } from '@app/_proto/Protos/karma';
import { KarmaClient } from '@app/_proto/Protos/karma.client';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';

type UseMyKarmaReturn = {
    goldenKarma: number | undefined;
    earnedKarma: number | undefined;
    isLoading: boolean;
    refetch: any; // TODO: Kevin: proper typing required.
};

export default function useMyKarma(): UseMyKarmaReturn {
    const { user } = useAuth();
    const getMyKarmaRequest = useGrpcRequest(GetMyKarmaTotalsRequest, {});

    const { data, isLoading, refetch } = useGrpcApiWithQuery(
        KarmaClient,
        c => c.getMyKarmaTotals,
        getMyKarmaRequest,
        ['karma', user?.id],
        {
            cacheTime: 0, //Don't cache
        }
    );

    return {
        goldenKarma: data?.totals[KarmaGroup.GoldenKarma],
        earnedKarma: data?.totals[KarmaGroup.EarnedKarma],
        isLoading,
        refetch,
    };
}
