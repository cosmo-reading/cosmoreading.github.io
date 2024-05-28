import { logAnalyticsEvent } from '@app/analytics';
import { BOOKMARK_EVENT_NAMES, BookmarkEvents } from '@app/domains/bookmark/analytics/amplitude/events';

enum LogNames {
    SeriesId = 'Series Id',
    SeriesTitle = 'Series Title',
    SortType = 'Sort Type',
    SortBy = 'Sort By',
    ViewType = 'View Type',
    CompletionStatus = 'Completion Status',
    NotificationStatus = 'Notification Status',
    LockStatus = 'Lock Status',
    ChapterId = 'Chapter Id',
    ChapterNo = 'Chapter No',
    ChapterTitle = 'Chapter Title',
}

// TODO: COZE: Refactor: change any to conditional type
export const bookmarkAnalyticsFactory = (event: BookmarkEvents): any => {
    switch (event) {
        case BookmarkEvents.ViewCurrentReadsSort:
            return ({ sortType, sortBy, viewType }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    [LogNames.SortType]: sortType,
                    [LogNames.SortBy]: sortBy,
                    [LogNames.ViewType]: viewType,
                });
            };
        case BookmarkEvents.ClickSeries:
            return ({ novel, on }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    On: on,
                    [LogNames.SeriesId]: novel.id,
                    [LogNames.SeriesTitle]: novel.name,
                    Writer: novel.authorName?.value || null,
                    Translator: novel.translatorName?.value || novel.translator?.userName || null,
                    Genres: novel.genres,
                    [LogNames.CompletionStatus]: novel.status,
                });
            };
        case BookmarkEvents.ToggleNotification:
            return ({ novel, bookmark }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    [LogNames.SeriesId]: novel.id,
                    [LogNames.SeriesTitle]: novel.name,
                    Writer: novel.authorName?.value || null,
                    Translator: novel.translatorName?.value || novel.translator?.userName || null,
                    Genres: novel.genres,
                    [LogNames.NotificationStatus]: !bookmark.notificationsEnabled ? 'On' : 'Off',
                });
            };
        case BookmarkEvents.ToggleLockCurrentRead:
            return ({ novel, bookmark }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    [LogNames.SeriesId]: novel.id,
                    [LogNames.SeriesTitle]: novel.name,
                    Writer: novel.authorName?.value || null,
                    Translator: novel.translatorName?.value || novel.translator?.userName || null,
                    Genres: novel.genres,
                    [LogNames.LockStatus]: !bookmark.locked ? 'On' : 'Off',
                });
            };
        case BookmarkEvents.ViewBookmarkedSort:
            return ({ sortType, sortBy }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    [LogNames.SortType]: sortType,
                    [LogNames.SortBy]: sortBy,
                });
            };
        case BookmarkEvents.ViewFavoriteChaptersSort:
            return ({ sortType, sortBy }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    [LogNames.SortType]: sortType,
                    [LogNames.SortBy]: sortBy,
                });
            };
        case BookmarkEvents.ClickDeleteBookmark:
        case BookmarkEvents.ClickDeleteFavoriteChapters:
            return ({ novel, chapter }) => {
                logAnalyticsEvent(BOOKMARK_EVENT_NAMES[event], {
                    [LogNames.SeriesId]: novel.id,
                    [LogNames.SeriesTitle]: novel.name,
                    Writer: novel.authorName?.value || null,
                    Translator: novel.translatorName?.value || novel.translator?.userName || null,
                    Genres: novel.genres,
                    [LogNames.CompletionStatus]: novel.status,
                    [LogNames.ChapterId]: chapter?.entityId,
                    [LogNames.ChapterNo]: chapter?.offset,
                    [LogNames.ChapterTitle]: chapter?.name,
                });
            };
    }
};
