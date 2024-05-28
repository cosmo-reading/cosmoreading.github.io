export enum HomeCollectionSlots {
    Featured = 11,
    Announcement = 12,
    InitialRecommendation = 13.2,
    RelatedRecommendation = 13.1,
    Popular = 14,
    Recent = 15,
    Genre = 16,
    SneakPeek = 17,
    RecentUpdate = 18,
}

export const HomeCollectionNameMap = {
    [HomeCollectionSlots.Featured]: 'Featured Card',
    [HomeCollectionSlots.Announcement]: 'Announcements',
    [HomeCollectionSlots.InitialRecommendation]: 'First Read',
    [HomeCollectionSlots.RelatedRecommendation]: 'Because You Read',
    [HomeCollectionSlots.Popular]: 'Popular This Week',
    [HomeCollectionSlots.Recent]: 'New Releases',
    [HomeCollectionSlots.Genre]: 'Popular Genres',
    [HomeCollectionSlots.SneakPeek]: 'Sneak Peeks',
    [HomeCollectionSlots.RecentUpdate]: 'Most Recently Updated',
};
