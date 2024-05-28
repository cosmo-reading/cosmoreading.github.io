import type { NovelItem } from '@app/_proto/Protos/novels';
import { logAnalyticsEvent } from '@app/analytics';
import { extractAmplitudeParams } from '@app/analytics/utils';
import type { ChapterForLog } from '@app/domains/chapter/types';
import { NOVEL_EVENT_NAMES, NovelEvents } from '@app/domains/novel/analytics/amplitude/events';
import type { VoteStateForLog } from '@app/domains/novel/types';
import { pick } from 'lodash-es';

export enum NovelLogNames {
    SeriesId = 'Series Id',
    SeriesTitle = 'Series Title',
    CompletionStatus = 'Completion Status',
    ChapterId = 'Chapter Id',
    ChapterNo = 'Chapter No',
    ChapterTitle = 'Chapter Title',
    ReviewId = 'Review Id',
    ReviewerId = 'Reviewer Id',
    ReviewerUserName = 'Reviewer Username',
    ReviewStatus = 'Review Status',
}

export const novelAmplitudeHandler = (event: NovelEvents, el: HTMLElement | undefined) => {
    const {
        on: relatedSeriesOn,
        itemSlot: relatedSeriesItemSlot,
        ...relatedSeriesParams
    }: any = extractAmplitudeParams({ el, reverseMerge: true });
    switch (event) {
        case NovelEvents.ClickRelatedSeries:
            return logAnalyticsEvent(NOVEL_EVENT_NAMES[event], {
                On: relatedSeriesOn,
                ...pick(novelCommonLoggingParamsAdapter(relatedSeriesParams), [
                    NovelLogNames.SeriesId,
                    NovelLogNames.SeriesTitle,
                    'Genres',
                    NovelLogNames.CompletionStatus,
                ]),
                Slot: relatedSeriesItemSlot,
            });
        default:
            throw new Error('Not Implemented');
    }
};

// TODO: COZE: Refactor: change any to conditional type
export const novelAnalyticsFactory = (event: NovelEvents): any => {
    switch (event) {
        case NovelEvents.ClickSeriesReviews:
            return ({ novel, on }) => {
                if (novel) {
                    logAnalyticsEvent(NOVEL_EVENT_NAMES[event], {
                        On: on,
                        [NovelLogNames.SeriesId]: novel.id,
                        [NovelLogNames.SeriesTitle]: novel.name,
                        Writer: novel.authorName?.value,
                        Translator: novel.translatorName?.value || novel.translator?.userName,
                        Genres: novel.genres,
                        [NovelLogNames.CompletionStatus]: novel.status,
                    });
                }
            };
        case NovelEvents.ClickContinueReading:
        case NovelEvents.ClickStartReading:
            return ({ novel, chapter }: ChapterForLog) => {
                logAnalyticsEvent(NOVEL_EVENT_NAMES[event], {
                    On: 'Series Cover',
                    [NovelLogNames.SeriesId]: novel.id,
                    [NovelLogNames.SeriesTitle]: novel.name,
                    Writer: novel.authorName?.value || null,
                    Translator: novel.translatorName?.value || novel.translator?.userName || null,
                    Genres: novel.genres,
                    [NovelLogNames.CompletionStatus]: novel.status,
                    [NovelLogNames.ChapterId]: chapter?.entityId || null,
                    [NovelLogNames.ChapterNo]: chapter?.offset || null,
                    [NovelLogNames.ChapterTitle]: chapter?.name || null,
                });
            };
        case NovelEvents.ClickSeriesReviewLikeDislike:
            return ({ entity, review, voteState }: VoteStateForLog) => {
                if (entity) {
                    const inputParamMap = {
                        up: 'Like',
                        down: 'Dislike',
                    };
                    logAnalyticsEvent(NOVEL_EVENT_NAMES[event], {
                        [NovelLogNames.SeriesId]: entity.id,
                        [NovelLogNames.SeriesTitle]: entity.name,
                        [NovelLogNames.ReviewId]: review.id || null,
                        [NovelLogNames.ReviewerId]: review.reviewUser?.id || null,
                        [NovelLogNames.ReviewerUserName]: review.reviewUser?.userName || null,
                        Input: inputParamMap[voteState],
                    });
                }
            };
        case NovelEvents.ClickSubmitSeriesReview:
            return ({ entity, review, on }) => {
                logAnalyticsEvent(NOVEL_EVENT_NAMES[event], {
                    On: on,
                    [NovelLogNames.SeriesId]: entity.id,
                    [NovelLogNames.SeriesTitle]: entity.name,
                    Writer: entity.authorName?.value || null,
                    Translator: entity.translatorName?.value || entity.translator?.userName || null,
                    Genres: entity.genres,
                    [NovelLogNames.CompletionStatus]: entity.status,
                    [NovelLogNames.ReviewStatus]: review.voteType > 0 ? 'Like' : 'Dislike',
                });
            };
    }
};

// note: can be exposed by user
export const novelCommonLoggingParamsParser = (novel: NovelItem | undefined) => {
    return {
        novelId: novel?.id,
        novelName: novel?.name,
        novelWriter: novel?.authorName?.value,
        novelTranslator: novel?.translatorName?.value || novel?.translator?.userName,
        novelGenres: novel?.genres,
        novelStatus: novel?.status,
    };
};

export type NovelCommonLoggingParamsAdapterParam = {
    novelId?: NovelItem['id'];
    novelName?: NovelItem['name'];
    novelWriter?: string | undefined;
    novelTranslator?: string | undefined;
    novelGenres?: NovelItem['genres'];
    novelStatus?: NovelItem['status'];
};

export const novelCommonLoggingParamsAdapter = (params: NovelCommonLoggingParamsAdapterParam) => {
    const { novelId, novelName, novelWriter, novelTranslator, novelGenres, novelStatus } = params;
    return {
        [NovelLogNames.SeriesId]: novelId,
        [NovelLogNames.SeriesTitle]: novelName,
        Writer: novelWriter,
        Translator: novelTranslator,
        Genres: novelGenres,
        [NovelLogNames.CompletionStatus]: novelStatus,
    };
};
