export enum ChapterEvents {
    BuyChapter = 'ChapterEvents.BuyChapter',
    ClickPreviousChapter = 'ChapterEvents.ClickPreviousChapter',
    ClickNextChapter = 'ChapterEvents.ClickNextChapter',
    ClickChapterCommentSort = 'ChapterEvents.ClickChapterCommentSort',
    ClickSubmitYourChapterComment = 'ChapterEvents.ClickSubmitYourChapterComment',
    ViewLockedScreen = 'ChapterEvents.ViewLockedScreen',
    ViewChapterScreen = 'ChapterEvents.ViewChapterScreen',
    ClickChapter = 'ChapterEvents.ClickChapter',
    ClickByKarma = 'ChapterEvents.ClickByKarma',
    ClickByChampion = 'ChapterEvents.ClickByChampion',
    UnlockChapter = 'ChapterEvents.UnlockChapter',
}

export const CHAPTER_EVENT_NAMES = {
    [ChapterEvents.ClickPreviousChapter]: 'Click Previous Chapter',
    [ChapterEvents.ClickNextChapter]: 'Click Next Chapter',
    [ChapterEvents.ViewChapterScreen]: 'View Chapter Screen',
    [ChapterEvents.ViewLockedScreen]: 'View Locked Screen',
    [ChapterEvents.BuyChapter]: 'Buy Chapter',
    [ChapterEvents.ClickChapterCommentSort]: 'Click Chapter Comment Sort',
    [ChapterEvents.ClickSubmitYourChapterComment]: 'Click Submit Your Chapter Comment',
    [ChapterEvents.ClickChapter]: 'Click Chapter',
    [ChapterEvents.ClickByKarma]: 'Click By Karma',
    [ChapterEvents.ClickByChampion]: 'Click By Champion',
    [ChapterEvents.UnlockChapter]: 'Unlock Chapter',
};
