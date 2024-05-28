export enum BookmarkEvents {
    ClickCurrentReads = 'BookmarkEvents.ClickCurrentReads',
    ViewCurrentReads = 'BookmarkEvents.ViewCurrentReads',
    ClickSeries = 'BookmarkEvents.ClickSeries',
    ToggleNotification = 'BookmarkEvents.ToggleNotification',
    ToggleLockCurrentRead = 'BookmarkEvents.ToggleLockCurrentRead',
    ClickFavoriteChapters = 'BookmarkEvents.ClickFavoriteChapters',
    ViewBookmarkedSort = 'BookmarkEvents.ViewBookmarkedSort',
    ClickDeleteBookmark = 'BookmarkEvents.ClickDeleteBookmark',
    ClickDeleteFavoriteChapters = 'BookmarkEvents.ClickDeleteFavoriteChapters',
    ViewFavoriteChaptersSort = 'BookmarkEvents.ViewFavoriteChaptersSort',
    ViewCurrentReadsSort = 'BookmarkEvents.ViewCurrentReadsSort',
}

export const BOOKMARK_EVENT_NAMES = {
    [BookmarkEvents.ClickCurrentReads]: 'Click Current Reads',
    [BookmarkEvents.ViewCurrentReads]: 'View Current Reads',
    [BookmarkEvents.ClickSeries]: 'Click Series',
    [BookmarkEvents.ToggleNotification]: 'Toggle Notification',
    [BookmarkEvents.ToggleLockCurrentRead]: 'Toggle Lock Current Read',
    [BookmarkEvents.ClickFavoriteChapters]: 'Click Favorite Chapters',
    [BookmarkEvents.ViewBookmarkedSort]: 'View Bookmarked Sort',
    [BookmarkEvents.ClickDeleteBookmark]: 'Click Delete Bookmark',
    [BookmarkEvents.ClickDeleteFavoriteChapters]: 'Click Delete Favorite Chapters',
    [BookmarkEvents.ViewFavoriteChaptersSort]: 'View Favorite Chapters Sort',
    [BookmarkEvents.ViewCurrentReadsSort]: 'View Current Reads Sort',
};
