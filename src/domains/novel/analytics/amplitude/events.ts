export enum NovelEvents {
    ClickSeriesReviews = 'NovelEvents.ClickSeriesReviews',
    ClickContinueReading = 'NovelEvents.ClickContinueReading',
    ClickStartReading = 'NovelEvents.ClickStartReading',
    ClickSeriesReviewLikeDislike = 'NovelEvents.ClickSeriesReviewLikeDislike',
    ClickSubmitSeriesReview = 'NovelEvents.ClickSubmitSeriesReview',
    ClickRelatedSeries = 'NovelEvents.ClickRelatedSeries',
}

export const NOVEL_EVENT_NAMES = {
    [NovelEvents.ClickSeriesReviews]: 'Click Series Reviews',
    [NovelEvents.ClickContinueReading]: 'Click Continue Reading',
    [NovelEvents.ClickStartReading]: 'Click Start Reading',
    [NovelEvents.ClickSeriesReviewLikeDislike]: 'Click Series Review Like-Dislike',
    [NovelEvents.ClickSubmitSeriesReview]: 'Click Submit Series Review',
    [NovelEvents.ClickRelatedSeries]: 'Click Related Series',
};
