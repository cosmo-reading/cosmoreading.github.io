export enum StoreEvents {
    BuyKarma = 'StoreEvents.BuyKarma',
    BuyVipSubscription = 'StoreEvents.BuyVipSubscription',
    ClickVipSubscribe = 'StoreEvents.ClickVipSubscribe',
    ClickStoreChampionPageNumber = 'StoreEvents.ClickStoreChampionPageNumber',
    ClickBuyKarma = 'StoreEvents.ClickBuyKarma',
    ClickLoginCheckIn = 'StoreEvents.ClickLoginCheckIn',
    SelectVipSeries = 'StoreEvents.SelectVipSeries',
    ViewStoreChampionSearch = 'StoreEvents.ViewStoreChampionSearch',
    ViewStoreVipScreen = 'StoreEvents.ViewStoreVipScreen',
    ViewStoreBillingScreen = 'StoreEvents.ViewStoreBillingScreen',
    ViewStoreFaqScreen = 'StoreEvents.ViewStoreFAQScreen',
    ViewStoreKarmaScreen = 'StoreEvents.ViewStoreKarmaScreen',
}

export const STORE_EVENT_NAMES = {
    [StoreEvents.ViewStoreVipScreen]: 'View Store VIP Screen',
    [StoreEvents.ClickVipSubscribe]: 'Click VIP Subscribe',
    [StoreEvents.BuyVipSubscription]: 'Buy VIP Subscription',
    [StoreEvents.SelectVipSeries]: 'Select VIP Series',
    [StoreEvents.ViewStoreChampionSearch]: 'View Store Champion Search',
    [StoreEvents.ClickStoreChampionPageNumber]: 'Click Store Champion Page Number',
    [StoreEvents.ViewStoreKarmaScreen]: 'View Store Karma Screen',
    [StoreEvents.ClickBuyKarma]: 'Click Buy Karma',
    [StoreEvents.BuyKarma]: 'Buy Karma',
    [StoreEvents.ClickLoginCheckIn]: 'Click Login Check In',
    [StoreEvents.ViewStoreBillingScreen]: 'View Store Billing Screen',
    [StoreEvents.ViewStoreFaqScreen]: 'View Store FAQ Screen',
};
