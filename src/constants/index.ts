interface PageLogNameMap {
    readonly HOME: string;
    readonly NOVELS: string;
    readonly NOVEL: string;
    readonly CHAPTER: string;
    readonly BOOKMARKS: string;
    readonly VIP: string;
    readonly CHAMPION: string;
    readonly KARMA: string;
    readonly BILLING: string;
    readonly FAQ: string;
    readonly SETTING: string;
    readonly EBOOK: string;
    readonly AUDIOBOOK: string;
}

export const PAGE_LOGNAME_MAP: PageLogNameMap = Object.freeze({
    HOME: 'View Home Page Screen',
    NOVELS: 'View Series Search Screen',
    NOVEL: 'View Series Cover Screen',
    CHAPTER: 'View Chapter Screen',
    BOOKMARKS: 'View Bookmarks Screen',
    VIP: 'View Store VIP Screen',
    CHAMPION: 'View Store Champion Screen',
    KARMA: 'View Store Karma Screen',
    BILLING: 'View Store Billing Screen',
    FAQ: 'View Store FAQ Screen',
    SETTING: 'View Settings Screen',
    EBOOK: 'View Ebooks Screen',
    AUDIOBOOK: 'View Audiobooks Screen',
});

export const PORTAL_TOAST_ID = 'portal-toast';
