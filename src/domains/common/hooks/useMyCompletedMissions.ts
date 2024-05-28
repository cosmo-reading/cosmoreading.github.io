import { GetMyCompletedMissionsRequest, MissionItem_MissionType } from '@app/_proto/Protos/missions';
import { MissionsClient } from '@app/_proto/Protos/missions.client';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';
import { useMemo } from 'react';

type UseMyCompletedMissionsReturn = {
    myCheckInTimesToday: number;
    myCommentedTimesToday: number;
    isLoading: boolean;
    refetch: any; // TODO: Kevin: proper typing required.
};

export default function useMyCompletedMissions(): UseMyCompletedMissionsReturn {
    const { user } = useAuth();
    const completedMissionsRequest = useGrpcRequest(GetMyCompletedMissionsRequest, {
        timeCompleted: {
            oneofKind: 'today',
            today: true,
        },
    });

    const {
        data: myMissionData,
        refetch,
        isLoading,
    } = useGrpcApiWithQuery(
        MissionsClient,
        c => c.getMyCompletedMissions,
        completedMissionsRequest,
        ['missions', user?.id],
        {
            cacheTime: 0, //Don't cache
        }
    );

    const myMissionStatusMap = useMemo(() => {
        if (!myMissionData?.items) {
            return null;
        }

        return myMissionData.items.reduce((p, c) => {
            const status = p.get(c.missionType);

            if (!status) {
                p.set(c.missionType, { times: 1 });
            } else {
                status.times += 1;
            }

            return p;
        }, new Map<MissionItem_MissionType, { times: number }>());
    }, [myMissionData?.items]);

    return {
        myCheckInTimesToday: myMissionStatusMap?.get(MissionItem_MissionType.MissionTypeCheckIn)?.times ?? 0,
        myCommentedTimesToday: myMissionStatusMap?.get(MissionItem_MissionType.MissionTypeComment)?.times ?? 0,
        isLoading,
        refetch,
    };
}
