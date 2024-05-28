import type { ChapterItem } from '@app/_proto/Protos/chapters';
import { type NovelItem, NovelItem_Status } from '@app/_proto/Protos/novels';
import type { UnlockedItem } from '@app/_proto/Protos/unlocks';
import type { VipType } from '@app/domains/common/types';
import { parseChapterStatus, parseNovelStatus } from '@app/domains/common/utils';
import type { ChapterItemStatus } from '@app/domains/novel/types';
import { getOneofValue } from '@app/libs/grpc';
import dayjsEx from '@app/utils/dayjsEx';

type WaitTimeSecToStrParam = {
    waitTimeSec: number;
    isTimeUnitAbbreviated: boolean;
};

export const waitTimeSecToStr = ({ waitTimeSec, isTimeUnitAbbreviated }: WaitTimeSecToStrParam) => {
    const HOUR = 60 * 60;
    const DAY = HOUR * 24;
    const TIME_UNIT = {
        m: isTimeUnitAbbreviated ? 'min' : 'minute',
        h: isTimeUnitAbbreviated ? 'hr' : 'hour',
        d: isTimeUnitAbbreviated ? 'day' : 'day',
    };
    if (waitTimeSec < HOUR) {
        const min = waitTimeSec / 60;
        if (min === 1) return `${min} ${TIME_UNIT.m}`;
        if (min > 1) return `${min} ${TIME_UNIT.m}s`;
    } else if (waitTimeSec < DAY) {
        const hour = Number((waitTimeSec / HOUR).toFixed(1));
        if (hour === 1) return `${hour} ${TIME_UNIT.h}`;
        if (hour > 1) return `${hour} ${TIME_UNIT.h}s`;
    } else {
        const day = Number((waitTimeSec / DAY).toFixed(1));
        if (day === 1) return `${day} ${TIME_UNIT.d}`;
        if (day > 1) return `${day} ${TIME_UNIT.d}s`;
    }
};

const DAY_MS = 1000 * 60 * 60 * 24;

export const formatDurationAsDigitalClock = (durationMs: number) => {
    if (durationMs >= DAY_MS) {
        const day = Number((durationMs / DAY_MS).toFixed());
        if (day === 1) return dayjsEx.duration(durationMs).format('D [day] HH:mm:ss');
        if (day > 1) return dayjsEx.duration(durationMs).format('D [days] HH:mm:ss');
    }
    return dayjsEx.duration(durationMs).format('HH:mm:ss');
};

type CheckIfVipBenefitNovelParams = {
    novel?: NovelItem | undefined;
    activeVipTypeReadable?: VipType;
    unlocks?: UnlockedItem[];
};
export const checkIfVipBenefitNovel = ({
    novel,
    activeVipTypeReadable,
    unlocks,
}: CheckIfVipBenefitNovelParams): boolean => {
    const { ongoing } = parseNovelStatus(novel);

    if (activeVipTypeReadable === 'DIAMOND') return true;
    if (activeVipTypeReadable && ongoing) return true;
    const benefitNovel = (unlocks || []).find(unlock => {
        if (getOneofValue(unlock.id, 'novelId') === undefined || novel?.id === undefined) return false;
        return getOneofValue(unlock.id, 'novelId') === novel?.id;
    });
    return !!benefitNovel;
};

type DetermineChapterStatusParam = {
    chapter: ChapterItem;
    novel: NovelItem;
    isVipBenefitNovel: boolean | undefined;
    championedNovel: boolean;
};
export const determineChapterStatus = ({
    chapter,
    novel,
    isVipBenefitNovel,
    championedNovel,
}: DetermineChapterStatusParam): ChapterItemStatus => {
    const { activePricingModelType } = parseNovelStatus(novel);
    const { isFreeChapter, isLastHoldBack, isOwnedChapter, unlockedByUser, advanced } = parseChapterStatus(chapter);

    let status: ChapterItemStatus = 'unlockedByFree';

    // novel
    if (activePricingModelType === 'free') return 'unlockedByFree';

    // chapter
    if (activePricingModelType === 'waitToUnlock') {
        status = 'lockedByWtu';
        if (isLastHoldBack) {
            status = 'lockedByLastHoldBack';
        }
    }

    if (activePricingModelType === 'karma') {
        status = 'lockedByKarma';
    }

    if (advanced) {
        status = 'lockedByAdvanced';
    }

    if (isFreeChapter) {
        return 'unlockedByFree';
    }

    if (unlockedByUser) {
        if (isOwnedChapter) {
            return 'unlockedByOwned';
        }
        if (championedNovel) {
            return 'unlockedByChampion';
        }
        if (isVipBenefitNovel) {
            return 'unlockedByVip';
        }
        return 'unlockedByUnknown';
    }

    return status;
};

type ConvertNovelStatusToStrReturn = 'Completed' | 'Ongoing' | 'Hiatus' | 'All' | 'N/A';
export function convertNovelStatusToStr(status?: NovelItem_Status): ConvertNovelStatusToStrReturn {
    const statusConvertMap: Record<NovelItem_Status | 'WW_EXCEPTION', ConvertNovelStatusToStrReturn> = {
        [NovelItem_Status.Finished]: 'Completed',
        [NovelItem_Status.Active]: 'Ongoing',
        [NovelItem_Status.Hiatus]: 'Hiatus',
        [NovelItem_Status.All]: 'All',
        WW_EXCEPTION: 'N/A',
    };
    return statusConvertMap[status ?? 'WW_EXCEPTION'];
}
