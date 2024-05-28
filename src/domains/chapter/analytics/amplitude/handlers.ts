import type { ChapterItem } from '@app/_proto/Protos/chapters';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { logAnalyticsEvent } from '@app/analytics';
import { extractAmplitudeParams } from '@app/analytics/utils';
import { CHAPTER_EVENT_NAMES, ChapterEvents } from '@app/domains/chapter/analytics/amplitude/events';
import type { ChapterWhereForLog } from '@app/domains/chapter/types';
import {
    type NovelCommonLoggingParamsAdapterParam,
    novelCommonLoggingParamsAdapter,
    novelCommonLoggingParamsParser,
} from '@app/domains/novel/analytics/amplitude/handlers';

enum ChapterLogNames {
    On = 'On',
    ChapterId = 'Chapter Id',
    ChapterNo = 'Chapter No',
    ChapterTitle = 'Chapter Title',
    ReviewId = 'Review Id',
    KarmaCount = 'Karma Count',
    AutoUnlock = 'Auto-Unlock',
    SortBy = 'Sort by',
    Published = 'Published',
    Type = 'Type',
    From = 'From',
}

export const chapterAmplitudeHandler = (event: ChapterEvents, el: HTMLElement | undefined) => {
    const {
        on,
        ...params
    }: { on?: string; 'Karma Count'?: number; 'Auto-Unlock'?: boolean } & ChapterCommonLoggingParamsAdapterParam &
        NovelCommonLoggingParamsAdapterParam = extractAmplitudeParams({ el });
    switch (event) {
        case ChapterEvents.ClickChapter:
        case ChapterEvents.ClickNextChapter:
        case ChapterEvents.ClickPreviousChapter:
            return logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                [ChapterLogNames.On]: on,
                ...chapterCommonLoggingParamsAdapter(params),
                ...novelCommonLoggingParamsAdapter(params),
            });
        case ChapterEvents.ClickByKarma:
            return logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                [ChapterLogNames.On]: on,
                ...chapterCommonLoggingParamsAdapter(params),
                ...novelCommonLoggingParamsAdapter(params),
                [ChapterLogNames.KarmaCount]: params['Karma Count'],
                [ChapterLogNames.AutoUnlock]: params['Auto-Unlock'] ? 'On' : 'Off',
            });
        case ChapterEvents.ClickByChampion:
            return logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                [ChapterLogNames.On]: on,
                ...chapterCommonLoggingParamsAdapter(params),
                ...novelCommonLoggingParamsAdapter(params),
                [ChapterLogNames.AutoUnlock]: params['Auto-Unlock'] ? 'On' : 'Off',
            });
        default:
            throw new Error('Not Implemented');
    }
};

export const chapterAnalyticsFactory = (event: ChapterEvents): any => {
    switch (event) {
        case ChapterEvents.ClickPreviousChapter:
        case ChapterEvents.ClickNextChapter:
            return ({ on, novel, chapter }: { on: string; novel?: NovelItem; chapter?: ChapterItem }) => {
                if (novel && chapter) {
                    logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                        [ChapterLogNames.On]: on,
                        ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                        ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                    });
                }
            };
        case ChapterEvents.ViewLockedScreen:
            return ({
                novel,
                chapter,
                type,
                from,
            }: {
                novel?: NovelItem;
                chapter?: ChapterItem;
                type: string;
                from: string;
            }) => {
                if (novel && chapter && type && from) {
                    logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                        [ChapterLogNames.Type]: type,
                        [ChapterLogNames.From]: from,
                        ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                        ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                    });
                }
            };
        case ChapterEvents.ClickSubmitYourChapterComment:
        case ChapterEvents.ViewChapterScreen:
            return ({
                novel,
                chapter,
                published,
                type,
                from,
            }: {
                novel?: NovelItem;
                chapter?: ChapterItem;
                published: boolean;
                type: string;
                from: string;
            }) => {
                if (novel && chapter) {
                    logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                        ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                        ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                        [ChapterLogNames.Published]: published ? 'Published' : 'Advanced',
                        [ChapterLogNames.Type]: type ?? 'Etc',
                        [ChapterLogNames.From]: from ?? 'Etc',
                    });
                }
            };
        case ChapterEvents.ClickByKarma:
        case ChapterEvents.ClickByChampion:
            return ({
                on,
                novel,
                chapter,
                autoUnlock,
            }: {
                on: 'Karma Lock' | 'WTU Lock';
                novel: NovelItem;
                chapter: ChapterItem;
                autoUnlock;
                chapterCount;
            }) => {
                if (on && novel && chapter) {
                    logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                        [ChapterLogNames.On]: on,
                        ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                        ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                        [ChapterLogNames.AutoUnlock]: autoUnlock ? 'On' : 'Off',
                    });
                }
            };
        case ChapterEvents.ClickChapterCommentSort:
            return ({ sortBy, novel, chapter }: { sortBy: string; novel?: NovelItem; chapter?: ChapterItem }) => {
                if (novel && chapter) {
                    logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                        [ChapterLogNames.SortBy]: sortBy,
                        ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                        ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                    });
                }
            };
        case ChapterEvents.ClickChapter:
            return ({ novel, chapter, on }: ChapterWhereForLog) => {
                logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                    [ChapterLogNames.On]: on,
                    ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                    ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                });
            };
        case ChapterEvents.UnlockChapter:
            return ({
                novel,
                chapter,
                on,
                published,
                type,
                autoUnlock,
            }: ChapterWhereForLog & { published: boolean; type: string; autoUnlock: boolean }) => {
                logAnalyticsEvent(CHAPTER_EVENT_NAMES[event], {
                    ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                    ...chapterCommonLoggingParamsAdapter(chapterCommonLoggingParamsParser(chapter)),
                    [ChapterLogNames.Published]: published ? 'Published' : 'Advanced',
                    [ChapterLogNames.Type]: type ?? 'Etc',
                    [ChapterLogNames.On]: on,
                    [ChapterLogNames.AutoUnlock]: autoUnlock ? 'On' : 'Off',
                });
            };
        default:
            throw new Error('Not Implemented');
    }
};

// note: can be exposed by user
export const chapterCommonLoggingParamsParser = (chapter: ChapterItem | undefined) => {
    return {
        chapterId: chapter?.entityId,
        chapterNo: chapter?.offset,
        chapterTitle: chapter?.name,
    };
};

type ChapterCommonLoggingParamsAdapterParam = {
    chapterId?: ChapterItem['entityId'];
    chapterNo?: ChapterItem['offset'];
    chapterTitle?: ChapterItem['name'];
};

export const chapterCommonLoggingParamsAdapter = (params: ChapterCommonLoggingParamsAdapterParam) => {
    const { chapterId, chapterNo, chapterTitle } = params;
    return {
        [ChapterLogNames.ChapterId]: chapterId,
        [ChapterLogNames.ChapterNo]: chapterNo,
        [ChapterLogNames.ChapterTitle]: chapterTitle,
    };
};
