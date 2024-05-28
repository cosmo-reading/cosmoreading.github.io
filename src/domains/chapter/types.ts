import type { ChapterItem } from '@app/_proto/Protos/chapters';
import type { NovelItem } from '@app/_proto/Protos/novels';

export type ChapterForLog = {
    novel: NovelItem;
    chapter: ChapterItem;
};

export type ChapterWhereForLog = ChapterForLog & {
    on: string;
};

export type UnlockParams = {
    karmaCount: number;
    chapterCount: number;
    autoUnlock: boolean;
};

export type UnlockBy = 'Karma' | 'subscribe' | 'complete' | 'WTU';

export enum ChapterListSortOrder {
    Newest = 0,
    Oldest = 1,
}

export type ViewerContrast = {
    backgroundColor: string;
    color: string;
};
