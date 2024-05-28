export enum AudiobookEvents {
    ClickAudiobookReview = 'AudiobookEvents.ClickAudiobookReview',
    ClickAudiobookSample = 'AudiobookEvents.ClickAudiobookSample',
    ClickBuyAudiobook = 'AudiobookEvents.ClickBuyAudiobook',
    BuyAudiobook = 'AudiobookEvents.BuyAudiobook',
    ClickDownloadAudiobook = 'AudiobookEvents.ClickDownloadAudiobook',
}

export enum SettingsEvents {
    ToggleUnlockingChapters = 'SettingsEvents.ToggleUnlockingChapters',
    ToggleChapterUpdates = 'SettingsEvents.ToggleChapterUpdates',
    ClickSetUpAuthenticator = 'SettingsEvents.ClickSetUpAuthenticator',
    ClickResetAuthenticator = 'SettingsEvents.ClickResetAuthenticator',
    ClickDeleteAccount = 'SettingsEvents.ClickDeleteAccount',
    ClickDeleteAccountPopupButton = 'SettingsEvents.ClickDeleteAccountPopupButton',
    CompleteDeleteAccount = 'SettingsEvents.CompleteDeleteAccount',
    ToggleMarketingEmails = 'SettingsEvents.ToggleMarketingEmails',
}

export enum ChatEvents {
    StartedChat = 'ChatEvents.StartedChat',
    ChatCompleted = 'ChatEvents.ChatCompleted',
    ChatFailed = 'ChatEvents.ChatFailed',
    ChatCleared = 'ChatEvents.ChatCleared',
}

export const EVENT_NAMES = {
    [AudiobookEvents.ClickAudiobookReview]: 'Click Audiobook Review',
    [AudiobookEvents.ClickAudiobookSample]: 'Click Audiobook Sample',
    [AudiobookEvents.ClickBuyAudiobook]: 'Click Buy Audiobook',
    [AudiobookEvents.BuyAudiobook]: 'Buy Audiobook',
    [AudiobookEvents.ClickDownloadAudiobook]: 'Click Download Audiobook',

    EbookEvents: {
        ClickBuyEbook: 'Click Buy Ebook',
        BuyEbook: 'Buy Ebook',
        ClickDownloadEbook: 'Click Download Ebook',
    },

    [SettingsEvents.ToggleUnlockingChapters]: 'Toggle Unlocking Chapters',
    [SettingsEvents.ToggleChapterUpdates]: 'Toggle Chapter Updates',
    [SettingsEvents.ClickSetUpAuthenticator]: 'Click Set Up Authenticator',
    [SettingsEvents.ClickResetAuthenticator]: 'Click Reset Authenticator',
    [SettingsEvents.ClickDeleteAccount]: 'Click Delete Account',
    [SettingsEvents.ClickDeleteAccountPopupButton]: 'Click Delete Account Popup Button',
    [SettingsEvents.CompleteDeleteAccount]: 'Complete Delete Account',
    [ChatEvents.StartedChat]: 'Started a Chat',
    [ChatEvents.ChatCompleted]: 'Completed a Chat',
    [ChatEvents.ChatFailed]: 'Chat Failed',
    [ChatEvents.ChatCleared]: 'Chat Cleared',
};

export enum EVENT_SOURCES {
    NovelCover = 'Series Cover',
    ChapterViewer = 'Chapter Viewer',
}

export enum CHAPTER_EVENT_SOURCES {
    NovelCover = 'Series Cover',
    ChapterViewer = 'Chapter Viewer',
    ChapterViewerTopNavigation = 'Chapter Viewer Top Navigation',
    ChapterViewerSideNavigation = 'Chapter Viewer Side Navigation',
    ChapterViewerArrow = 'Chapter Viewer Arrow',
    ChapterViewBottom = 'Chapter View Bottom',
    NavigationBarArrow = 'Navigation Bar Arrow',
    KarmaLock = 'Karma Lock',
    WtuLock = 'WTU Lock',
    Server = 'Server',
}

export enum CHAPTER_UNLOCK_TYPES {
    Unknown = 'Unknown',
    WaitedCoupon = 'Waited Coupon',
    Karma = 'Karma',
    Free = 'Free',
    Owned = 'Owned',
    ChampionSubscription = 'Champion Subscription',
    VipSubscription = 'VIP Subscription',
}
