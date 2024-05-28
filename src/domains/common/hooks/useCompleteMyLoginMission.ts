import {
    CompleteMissionRequest,
    type CompleteMissionResponse,
    MissionItem_MissionType,
    MissionItem_RewardType,
} from '@app/_proto/Protos/missions';
import { MissionsClient } from '@app/_proto/Protos/missions.client';
import { useGrpcApiWithRequest } from '@app/libs/api';
import { type GrpcMessage, useGrpcRequest } from '@app/libs/grpc';

type UseCompleteMyLoginMissionParam = {
    onCompleted: () => void;
};
type UseCompleteMyLoginMissionReturn = {
    executeRequest: () => Promise<GrpcMessage<CompleteMissionResponse> | undefined>;
    loading: boolean;
};

export default function useCompleteMyLoginMission({
    onCompleted,
}: UseCompleteMyLoginMissionParam): UseCompleteMyLoginMissionReturn {
    const completeLoginMissionRequest = useGrpcRequest(CompleteMissionRequest, {
        missionType: MissionItem_MissionType.MissionTypeCheckIn,
        rewardType: MissionItem_RewardType.RewardTypeKarma,
    });

    const { executeRequest, loading } = useGrpcApiWithRequest(
        MissionsClient,
        c => c.completeMission,
        completeLoginMissionRequest,
        {
            onCompleted,
        }
    );

    return {
        executeRequest,
        loading,
    };
}
