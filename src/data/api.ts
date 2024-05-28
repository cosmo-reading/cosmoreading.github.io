export type ApiResult = true | false | null | undefined;

export type ApiResponse<T extends ApiResult = ApiResult> = T extends true
    ? {
          result: true;
      }
    : T extends false
      ? {
              result: false;
          }
      : {
              result: true;
          };

export type ApiSuccess = ApiResponse<true>;

export type ApiError = ApiResponse<false> & {
    error?: string;
};

export type ApiSuccessOrError = ApiSuccess | ApiError;

export type Item<T> =
    | (ApiSuccess & {
          item: T;
      })
    | (ApiError & {
          item: null | undefined;
      });

export type Items<T> =
    | (ApiSuccess & {
          items: T[];
      })
    | (ApiError & {
          items: null | undefined;
      });

export type PagedItems<T> = Items<T> & {
    total: number;
};

export type CommentsResponse = PagedItems<EntityComment> & {
    totalTopLevel: number;
};

export type Home = {
    announcements: SiteAnnouncement[];
    posts: NovelAnnouncement[];
    updates: Chapter[];
    sneakPeekNovels: Novel[];
    topNovels: TopNovels[];
    sliders: Slider[];
};

export type Slider = {
    order: number;
    name: string;
    items: Novel[];
};

export type SiteAnnouncement = {
    id: number;
    content: string;
    contentIsMarkdown: boolean;
    allowComments: boolean;
    timePosted: number;
    title: string;
    slug: string;
    sticky: boolean;
    announcer: string;
    announcerAvatarUrl: string;
    important: boolean;
};

export type TopNovels = {
    type: 'Daily' | 'Weekly' | 'Monthly';
    novels: Novel[];
};

export type TagNovels = {
    name: string;
    index: number;
    novels: Novel[];
};

export type Novel = {
    id: number;
    name: string;
    active: boolean;
    abbreviation: string;
    slug: string;
    language: string;
    visible: boolean;
    description: string;
    synopsis: string;
    coverUrl: string;
    translatorName: string;
    translatorUserName: string;
    authorName: string;
    chapterGroups: ChapterGroup[];
    tags: NovelTag[];
    genres: NovelGenre[];
    sponsorPlans: NovelSponsorPlan[];
    latestAnnouncement: NovelAnnouncement;
    userHasEbook: boolean;
    userHasNovelUnlocked: boolean;
    ebooks: NovelEbook[];
    karmaActive: boolean;
    freeMaxChapterNumber: boolean;
    isFree?: boolean;
    reviewScore?: number;
    timeCreated?: number;
    chapterCount?: number;
    reviewCount?: number;
};

export type NovelAnnouncement = {
    id: number;
    novelId: number;
    novelName: string;
    novelCoverUrl: string;
    novelSlug: string;
    novelTranslatorUserName: string;
    novelTranslatorId: string;
    slug: string;
    content: string;
    contentIsMarkdown: boolean;
    title: string;
    allowComments: boolean;
    whenToPublish: number;
    lastModified: number;
    poster: string;
    posterAvatarUrl: string;
    sponsorsOnly: boolean;
};

export type NovelGenre = {
    id: number;
    name: string;
};

export type NovelTag = {
    id: number;
    name: string;
};

export type NovelGenr = {
    id: number;
    name: string;
};

export type NovelEbook = {
    id: number;
    name: string;
    order: number;
    coverUrl: string;
    description: string;
    dateCreated: number;
    // product: WuxiaworldProduct;
};

export type ChapterGroup = {
    id: number;
    fromChapterNumber: number;
    toChapterNumber: number;
    novelId: number;
    order: number;
    title: string;
    chapters: Chapter[];
};

export type Chapter = {
    id: number;
    name: string;
    slug: string;
    prevChapterSlug: string;
    nextChapterSlug: string;
    content: string;
    teaserContent: string;
    translatorThoughts: string;
    contentIsMarkdown: boolean;
    number: number;
    visible: boolean;
    spoilerTitle: boolean;
    advanceChapter: boolean;
    advanceChapterNumber: number;
    isTeaser: boolean;
    published: number;
    novelId: number;
    novelName: string;
    novelAbbreviation: string;
    novelSlug: string;
    novelTranslatorId: string;
    novelTranslatorName: string;
    novelTranslatorUserName: string;
    novelTeaserMessage: string;
    novelIsSneakPeek: boolean;
    allowComments: boolean;
    novel: Novel;
    latestNovelAnnouncement: NovelAnnouncement;
    // latestSiteAnnouncement: SiteAnnouncement;
    sponsorPlans: any[];
    whenToPublish: number | null;
    isKarmaLocked: boolean;
    isKarmaUnlocked: boolean;
    // karmaUnlockSource: KarmaSource;
    karmaAmountRequired: number;
    isChapterFreeUnlock: boolean;
    isFirstChapterUnlock: boolean;

    downloaded: boolean;
    type: 'api';
};

export type Bookmark = {
    novelName: string;
    novelSlug: string;
    novelCoverUrl: string;
    novelAbbreviation: string;
    chapterId: number;
    novelId: number;
    chapterName: string;
    chapterNumber: number;
    chapterSlug: string;
    timeRead: number;
    locked: boolean;
    notificationsEnabled: boolean;
    latestChapterId: number;
    latestChapterName: string;
    latestChapterNumber: number;
    latestChapterSlug: string;
    latestChapterPublishDate: number;
    unreadCount: number;
};

export type NotificationType = 'chapter' | 'post' | 'comment' | 'review' | 'page' | 'announcement' | 'product_review';

export enum NotificationStatus {
    Unread = 0,
    Read = 1,
}

export type NotificationObject = {
    id: number;
    actor: string;
    type: NotificationType;
    slug: string;
    data: any;
    userData: any;
    userTime: number;
    createdOn: number;
    status: NotificationStatus;
};

export type SearchNovelsModel = {
    title: string | null;
    tags: string[];
    language: string | null;
    genres: string[];
    active?: boolean;
    sortType: string | null;
    sortAsc: boolean;
    searchAfter?: number;
    count: number;
};

export enum SponsorPlanType {
    Stripe = 0,
    Apple = 1,
    Google = 2,
    Manual = 3,
}

export type NovelSponsorPlan = {
    id: number;
    name: string;
    description: string;
    enabled: boolean;
    visible: boolean;
    advancedChapters: number;
    planId: string;
    price: number;
    karmaPrice: number;
    paused: boolean;
    novelId: number;
    novelName: string;
};

export type SponsorPlan = {
    novelId: number;
    novelName: string;
    novelSlug: string;
    novelActive: boolean;
    planPurchased: string;
    planAmount: number;
    planKarmaAmount: number;
    planAdvanceChapterCount: number;
    planActive: boolean;
    currentPeriodStart?: number;
    currentPeriodEnd?: number;
    dateSubscriptionEnded?: number;
};

export enum VIPType {
    Silver = 0,
    Gold = 1,
    Diamond = 2,
}

export type EntityComment = {
    id: number;
    poster: string;
    posterId: string;
    content: string;
    avatar: string;
    depth: number;
    timeCommented: number;
    edited: boolean;
    flair: string;
    upVotes: number;
    downVotes: number;
    vip: boolean;
    vipType: VIPType;
    children: EntityComment[];
};

export type KarmaChapter = {
    id: number;
    name: string;
    slug: string;
    number: number;
    advanceChpater: boolean;
    whenToPublish?: number;
    novelName: string;
    novelSlug: string;
};

export type KarmaTransaction = {
    id: number;
    userId: string;
    amount: number;
    orderId?: number;
    reason: string;
    timeRecorded: number;
};

export enum ReviewVoteType {
    ThumbsDown = -1,
    ThumbsUp = 1,
}

export enum ReviewStateType {
    Rejected = 1,
    ReApproval = 2,
    Approved = 3,
}

export enum NovelReviewVoteType {
    DownVote = 0,
    UpVote = 1,
}

export enum ReviewSearchSort {
    None = 0,
    Relevance = 1,
    Newest = 2,
    Oldest = 3,
    Best = 4,
    Worst = 5,
}

export type Review = {
    id: number;
    novelId: number;
    userId: string;
    username: string;
    avatarUrl: string;
    reviewContent: string;
    reviewDate: number;
    editedDate: number;
    voteType: ReviewVoteType;
    isUserVip: boolean;
    purchased: boolean;
    upVotes: number;
    downVotes: number;
    commentsCount: number;
    rejectedReason?: string;
    rejectedDate?: number;
    stateType?: ReviewStateType;
};

export type ReviewComment = {
    id: number;
    username: string;
    avatarUrl: string;
    content: string;
    flair: string;
    timeCommented: number;
    sticky: boolean;
    reviewId: number;
};
