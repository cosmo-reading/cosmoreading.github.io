import type { ChapterGroupItem, ChapterItem } from '@app/_proto/Protos/chapters';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { ObjectType } from '@app/_proto/Protos/objects';
import type { UnlockedItem } from '@app/_proto/Protos/unlocks';
import { VipItem_VipType } from '@app/_proto/Protos/vips';
import { GUEST_CHAPTERS_READ_STORAGE_KEY, GUEST_MAX_CHAPTERS_ALLOWED } from '@app/domains/chapter/constants';
import { parseUserStatus } from '@app/domains/common/utils';
import type { User } from '@app/libs/auth';
import { getOneofValue } from '@app/libs/grpc';
import { decimalToNumber } from '@app/libs/utils';
import { isBrowser } from '@app/utils/utils';

/**
 * Custom.
 *
 * Returns the total number of chapters a user has read as anonymous.
 */
export type AnonChaptersRead = {
    count: number;
    urlsAllowed: string[];
};
export function getAnonChaptersReadDetails(): AnonChaptersRead {
    if (!isBrowser()) {
        return { count: 0, urlsAllowed: [] };
    }

    const chaptersReadJson = localStorage.getItem(GUEST_CHAPTERS_READ_STORAGE_KEY);

    if (chaptersReadJson) {
        const chaptersRead: AnonChaptersRead = JSON.parse(chaptersReadJson);

        return chaptersRead;
    }

    return { count: 0, urlsAllowed: [] };
}

/**
 * Custom.
 *
 * Increments by one the total number of chapters a user has read as anonymous.
 */
export function setAnonChaptersRead(novelSlug: string, chapterSlug: string) {
    if (!isBrowser()) {
        return;
    }

    const slug = `${novelSlug}/${chapterSlug}`;

    const chaptersRead = getAnonChaptersReadDetails();

    if (chaptersRead.urlsAllowed.some(x => x === slug) || chaptersRead.count >= GUEST_MAX_CHAPTERS_ALLOWED) {
        return;
    }

    chaptersRead.urlsAllowed.push(slug);
    chaptersRead.count += 1;

    localStorage.setItem(GUEST_CHAPTERS_READ_STORAGE_KEY, JSON.stringify(chaptersRead));
}

export const checkHavingAdvChapterAccess = ({ user, novelId }: { user: User | undefined; novelId: number }) => {
    if (user?.permissions?.roles.some(role => ['Admin', 'Translator'].includes(role?.name))) {
        return true;
    }
    if (user?.permissions?.roles.some(role => ['Analyst', 'Translator_B', 'Editor'].includes(role?.name))) {
        if (user.permissions?.objects.some(object => object.type === ObjectType.NovelObject && object.id === novelId))
            return true;
    }
    return false;
};

export const checkHavingSneakPeekAccess = ({
    user,
    novelId,
}: {
    user: User | undefined;
    novelId: number | undefined;
}) => {
    const hasManagerRole = user?.permissions?.roles.some(role => ['Admin', 'Translator'].includes(role.name));
    const hasRoleOfNovel = user?.permissions?.objects.some(
        object => object.type === ObjectType.NovelObject && object.id === novelId
    );
    return hasManagerRole || hasRoleOfNovel;
};

export const checkVipFreeNovelSelectable = ({
    user,
    novel,
    vipFreeNovels,
    unlockedNovels,
}: {
    user: User | undefined;
    novel: NovelItem;
    vipFreeNovels: NovelItem[] | undefined;
    unlockedNovels: UnlockedItem[] | undefined;
}) => {
    if (!user || !vipFreeNovels || !unlockedNovels) return false;
    const { isVipActive, vipFreeNovelsLimit } = parseUserStatus(user);
    const canAddUnlock = unlockedNovels.length < (vipFreeNovelsLimit ?? 0);
    if (!isVipActive) return false;
    if (![VipItem_VipType.Silver, VipItem_VipType.Gold].includes(user.vip?.type ?? -1)) return false;
    if (!canAddUnlock) return false;
    if (unlockedNovels.some(unlockedNovel => getOneofValue(unlockedNovel.id, 'novelId') === novel.id)) return false;
    if (!vipFreeNovels.map(vipFreeNovel => vipFreeNovel.id).includes(novel.id)) return false;
    return true;
};

export const checkChapterInGroup = ({
    chapter,
    chapterGroup,
}: {
    chapter?: ChapterItem;
    chapterGroup: ChapterGroupItem;
}) =>
    !!chapter &&
    decimalToNumber(chapterGroup.fromChapterNumber) <= decimalToNumber(chapter.number) &&
    decimalToNumber(chapterGroup.toChapterNumber) >= decimalToNumber(chapter.number);
