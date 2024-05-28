import type { ChapterItem } from '@app/_proto/Protos/chapters';
import { type NovelItem, NovelItem_Status } from '@app/_proto/Protos/novels';
import { FreePricingModel, type KarmaPricingModel, WaitToUnlockPricingModel } from '@app/_proto/Protos/pricing';
import type { SeriesPricingInfo_WaitToUnlockInfo } from '@app/_proto/Protos/series';
import type { SponsorPlanItem } from '@app/_proto/Protos/sponsors';
import type { SubscriptionItem } from '@app/_proto/Protos/subscriptions';
import { UserItem } from '@app/_proto/Protos/users';
import { VipItem_VipType } from '@app/_proto/Protos/vips';
import { VIP_FREE_NOVELS_LIMIT, VIP_TYPE_TO_READABLE } from '@app/domains/common/constants';
import type { VipType } from '@app/domains/common/types';
import type { NovelPricingModelType, WtuStatus } from '@app/domains/novel/types';
import { getOneofValue, getSelectedOneofValue, isOneOfKind } from '@app/libs/grpc';

export type ParseUserStatusReturn = {
    hasUser: boolean;
    isLegacy: boolean | undefined;
    isLegacyVip: boolean | undefined;
    isLegacyNonVip: boolean | undefined;
    isVipActive?: boolean;
    vipType?: keyof typeof VipItem_VipType;
    vipTypeReadable?: VipType;
    vipFreeNovelsLimit?: number;
    autoUnlockEnabled?: boolean;
};

export const parseUserVipStatus = (user: UserItem | null | undefined) => {
    const isVipActive = user?.isVipActive;
    const vipType = VipItem_VipType[user?.vip?.type ?? 'WW_EXCEPTION'] as keyof typeof VipItem_VipType;

    const vipTypeReadable = VIP_TYPE_TO_READABLE[
        user?.vip?.type ?? 'WW_EXCEPTION'
    ] as (typeof VIP_TYPE_TO_READABLE)[VipItem_VipType];

    const vipFreeNovelsLimit = VIP_FREE_NOVELS_LIMIT[
        user?.vip?.type ?? 'WW_EXCEPTION'
    ] as (typeof VIP_FREE_NOVELS_LIMIT)[VipItem_VipType];

    const autoUnlockEnabled = user?.settings?.autoUnlockChapters;
    return {
        isVipActive,
        vipType,
        vipTypeReadable,
        vipFreeNovelsLimit,
        autoUnlockEnabled,
    };
};

export const parseUserStatus = (user: UserItem | null | undefined): ParseUserStatusReturn => {
    const hasUser = !!user;
    const isLegacy = user?.isLegacy;
    const isLegacyVip = user?.isLegacyVip;
    const isLegacyNonVip = user?.isLegacy && !user?.isLegacyVip;
    const vipStatus = parseUserVipStatus(user);

    return {
        hasUser,
        isLegacy,
        isLegacyVip,
        isLegacyNonVip,
        ...vipStatus,
    };
};

export type ParsePricingModelStatusParams = {
    novel?: NovelItem | null;
    chapter?: ChapterItem | null;
};

export type ParsePricingModelStatusReturn = {
    info: WaitToUnlockPricingModel | KarmaPricingModel | FreePricingModel | undefined;
    wtuInfo: WaitToUnlockPricingModel | undefined;
    freeInfo: FreePricingModel | undefined;
    userWtuInfo?: SeriesPricingInfo_WaitToUnlockInfo;
    wtuStatus?: WtuStatus;
    activePricingModelType: NovelPricingModelType | undefined;
    isPricingModeledNovel: boolean;
    isWtuCompleted: boolean;
};

export const parsePricingModelStatus = ({ novel, chapter }: ParsePricingModelStatusParams) => {
    const series = chapter?.novelInfo?.series ?? novel?.series;
    const pricingModel = series?.pricingModel;
    const pricingInfo = series?.relatedUserInfo?.pricingInfo;

    const isPricingModeledNovel = !!pricingModel?.active;
    const activePricingModel = isPricingModeledNovel ? pricingModel.pricing : undefined;
    const activePricingModelType = activePricingModel?.oneofKind;

    const userInfo = pricingInfo?.info;

    const isWtuCompleted = !!(
        activePricingModelType === 'waitToUnlock' && getOneofValue(pricingInfo?.info, 'waitToUnlock')?.waitCompleted
    );

    const userWtuInfo = (isOneOfKind(userInfo, 'waitToUnlock') && userInfo.waitToUnlock) || undefined;

    // It should be decided by server-side, because the server knows when it should be changed.
    // We guess it at the client-side now.
    const wtuStatus: WtuStatus | undefined = (() => {
        if (activePricingModelType !== 'waitToUnlock') {
            return undefined;
        }
        if (userWtuInfo === undefined) {
            return 'standBy';
        }
        if (userWtuInfo.timeLeft) {
            // TODO: COZE: replace with timeleft-now
            if (userWtuInfo.waitCompleted) {
                return 'holdingCoupon';
            }
            return 'waitingCoupon';
        }
        return 'standBy';
    })();

    const info = getSelectedOneofValue(pricingModel?.pricing);
    const wtuInfo = WaitToUnlockPricingModel.is(info) ? info : undefined;
    const freeInfo = FreePricingModel.is(info) ? info : undefined;

    return {
        info,
        wtuInfo,
        freeInfo,
        userWtuInfo,
        wtuStatus,
        activePricingModelType,
        isPricingModeledNovel,
        isWtuCompleted,
    };
};

type ParseChampionSubscriptionStatusReturn = {
    plan: SponsorPlanItem | undefined;
};

export const parseChampionSubscriptionStatus = (
    subscription: SubscriptionItem | undefined
): ParseChampionSubscriptionStatusReturn => {
    const plan = getOneofValue(subscription?.plan?.plan, 'sponsor');
    return { plan };
};

export type ParseChampionStatusFromNovelReturn = {
    hasAnyChampionPlans: boolean | undefined;
    championTiers: SponsorPlanItem[] | undefined;
    championDescHtml: string | undefined;
    advanceChapterCount: number | undefined;
};

export const parseChampionStatusFromNovel = (novel: NovelItem | undefined): ParseChampionStatusFromNovelReturn => {
    const hasAnyChampionPlans = novel?.sponsorInfo?.hasAnyPlans?.value;
    const championTiers = novel?.sponsorInfo?.plans;
    const championDescHtml = novel?.sponsorInfo?.description?.value;
    const advanceChapterCount = novel?.sponsorInfo?.advanceChapterCount?.value;

    return { hasAnyChampionPlans, championTiers, championDescHtml, advanceChapterCount };
};

export type ParseNovelStatusReturn = {
    activePricingModelType?: NovelPricingModelType;
    hasNovel: boolean;
    author?: string;
    translator?: string;
    reviewRating: number | undefined;
    coverUrl: string | undefined;
    coverBlurHash: string | undefined;
    slug: string | undefined;
    name: string | undefined;
    genres: string[] | undefined;
    synopsis: string | undefined;
    status: NovelItem_Status | undefined;
    language: string | undefined;
    firstChapter: ChapterItem | undefined;
    latestChapter: ChapterItem | undefined;
    isSneakPeekNovel?: boolean;
    isExcludedFromVipBenefitNovel?: boolean;
    ongoing: boolean;
    completed: boolean;
} & ParseChampionStatusFromNovelReturn;

export const parseNovelStatus = (novel: NovelItem | undefined): ParseNovelStatusReturn => {
    const { activePricingModelType } = parsePricingModelStatus({
        novel,
    });

    const championStatus = parseChampionStatusFromNovel(novel);

    const legacyActivePricingModelType: NovelPricingModelType = (() => {
        if (!activePricingModelType) {
            if (novel?.karmaInfo?.isFree) return 'free';
            if (novel?.karmaInfo?.isActive) return 'karma';
        }
        if (activePricingModelType) return activePricingModelType;
        return 'free'; // legacy will be classified to free here
    })();

    const author = novel?.authorName?.value;
    const translator = novel?.translatorName?.value || novel?.translator?.userName;
    const reviewRating = novel?.reviewInfo?.rating?.value;
    const coverUrl = novel?.coverUrl?.value;
    const coverBlurHash = novel?.coverBlurHash?.value;
    const slug = novel?.slug;
    const name = novel?.name;
    const genres = novel?.genres;
    const synopsis = novel?.synopsis?.value;
    const status = novel?.status;
    const language = novel?.language?.value;

    const firstChapter = novel?.chapterInfo?.firstChapter;
    const latestChapter = novel?.chapterInfo?.latestChapter;

    const hasNovel = !!novel;

    const isSneakPeekNovel = novel?.isSneakPeek;

    const isExcludedFromVipBenefitNovel = novel?.karmaInfo?.canUnlockWithVip === false;

    const ongoing = novel?.status === NovelItem_Status.Active;

    const completed = novel?.status === NovelItem_Status.Finished;

    return {
        activePricingModelType: legacyActivePricingModelType,
        hasNovel,
        author,
        translator,
        reviewRating,
        coverUrl,
        coverBlurHash,
        slug,
        name,
        genres,
        synopsis,
        status,
        language,
        firstChapter,
        latestChapter,
        isSneakPeekNovel,
        isExcludedFromVipBenefitNovel,
        ongoing,
        completed,
        ...championStatus,
    };
};

export type ParseChapterStatusReturn = {
    nextChapterSlug: string | undefined;
    prevChapterSlug: string | undefined;
    hasChapter: boolean;
    hasNextChapter: boolean;
    hasPrevChapter: boolean;
    isAdvancedChapter?: boolean;
    advanced: boolean | undefined;
    isFreeChapter?: boolean;
    isLastHoldBack?: boolean;
    isKarmaChapter?: boolean;
    isUnlockedChapter?: boolean;
    unlockedByUser: boolean | undefined;
    isOwnedChapter?: boolean;
};

export const parseChapterStatus = (chapter: ChapterItem | undefined) => {
    const nextChapterSlug = chapter?.relatedChapterInfo?.nextChapter?.slug;
    const prevChapterSlug = chapter?.relatedChapterInfo?.previousChapter?.slug;

    const hasChapter = !!chapter;

    const hasNextChapter = !!chapter?.relatedChapterInfo?.nextChapter?.slug;

    const hasPrevChapter = !!chapter?.relatedChapterInfo?.previousChapter?.slug;

    const isAdvancedChapter = chapter?.sponsorInfo?.advanceChapter;
    const advanced = isAdvancedChapter; // alias

    const isFreeChapter = chapter?.pricingInfo?.isFree;
    const isLastHoldBack = chapter?.pricingInfo?.isLastHoldback;

    const isKarmaChapter = chapter?.karmaInfo?.isKarmaRequired;

    const isUnlockedChapter = chapter?.relatedUserInfo?.isChapterUnlocked?.value;
    const unlockedByUser = isUnlockedChapter; // alias but more accurate
    const isOwnedChapter = chapter?.relatedUserInfo?.isChapterOwned?.value;

    return {
        nextChapterSlug,
        prevChapterSlug,
        hasChapter,
        hasNextChapter,
        hasPrevChapter,
        isAdvancedChapter,
        advanced,
        isFreeChapter,
        isLastHoldBack,
        isKarmaChapter,
        isUnlockedChapter,
        unlockedByUser,
        isOwnedChapter,
    };
};

export function concatTypedArrays<T extends Uint8Array>(a: T, b: T) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const c = new (a as any).constructor(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

export const pluralize = (number: number | undefined, target: string) => {
    if (number === undefined) return target;
    return `${number} ${target}${number > 1 ? 's' : ''}`;
};

export const capitalize = (str?: string) => {
    if (!str) return;
    return str
        .split(' ')
        .map(word => {
            const charCodeOfFirstLetter = word.charCodeAt(0);
            if (97 <= charCodeOfFirstLetter && charCodeOfFirstLetter <= 122) {
                return `${String.fromCharCode(charCodeOfFirstLetter - 32)}${word.slice(1)}`;
            }
            return word;
        })
        .join(' ');
};

export const noop = () => {};
