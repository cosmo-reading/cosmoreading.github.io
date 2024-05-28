export enum HomeEvents {
    ViewCollection = 'HomeEvents.ViewCollection',
    ClickPreviousCollectionArrow = 'HomeEvents.ClickPreviousCollectionArrow',
    ClickNextCollectionArrow = 'HomeEvents.ClickNextCollectionArrow',
    ViewCollectionItem = 'HomeEvents.ViewCollectionItem',
    ClickCollectionItem = 'HomeEvents.ClickCollectionItem',
}

export const HOME_EVENT_NAMES = {
    [HomeEvents.ViewCollection]: 'View Collection',
    [HomeEvents.ClickPreviousCollectionArrow]: 'Click Previous Collection Arrow',
    [HomeEvents.ClickNextCollectionArrow]: 'Click Next Collection Arrow',
    [HomeEvents.ViewCollectionItem]: 'View Collection Item',
    [HomeEvents.ClickCollectionItem]: 'Click Collection Item',
};
