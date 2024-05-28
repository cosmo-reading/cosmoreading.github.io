import { MissionItem_MissionType } from '@app/_proto/Protos/missions';

export const getMissionLimit = (type: MissionItem_MissionType) => {
    switch (type) {
        case MissionItem_MissionType.MissionTypeCheckIn:
            return 1;
        case MissionItem_MissionType.MissionTypeComment:
            return 5;
        default:
            return 0;
    }
};
