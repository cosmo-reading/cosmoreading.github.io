import { logAnalyticsEvent } from '@app/analytics';
import { extractAmplitudeParams } from '@app/analytics/utils';
import { HomeCollectionNameMap } from '@app/domains/home/analytics/amplitude/constants';
import { HOME_EVENT_NAMES, HomeEvents } from '@app/domains/home/analytics/amplitude/events';
import type { CollectionForLog, CollectionItemForLog, CollectionParams } from '@app/domains/home/types';

export const homeAmplitudeHandler = (event: HomeEvents, el: HTMLElement | undefined) => {
    const { collectionSlot, itemSlot, genre }: CollectionParams = extractAmplitudeParams({ el });
    const collectionTitle = HomeCollectionNameMap[collectionSlot ?? 'WW_EXCEPTION'];

    switch (event) {
        case HomeEvents.ViewCollection:
            return logAnalyticsEvent(HOME_EVENT_NAMES[event], {
                On: 'Home',
                ...createCollectionEventProps({ collectionSlot, collectionTitle, genre }),
            });
        case HomeEvents.ClickPreviousCollectionArrow:
        case HomeEvents.ClickNextCollectionArrow:
            return logAnalyticsEvent(
                HOME_EVENT_NAMES[event],
                createCollectionEventProps({ collectionSlot, collectionTitle })
            );
        case HomeEvents.ViewCollectionItem:
        case HomeEvents.ClickCollectionItem:
            return logAnalyticsEvent(HOME_EVENT_NAMES[event], {
                On: 'Home',
                ...createCollectionItemEventProps({ collectionSlot, collectionTitle, itemSlot, genre }),
            });
    }
};

enum LogNames {
    CollectionSlot = 'Collection Slot',
    CollectionTitle = 'Collection Title',
    ItemSlot = 'Item Slot',
}

const createCollectionEventProps = ({ collectionSlot, collectionTitle, genre }: CollectionForLog) => {
    return {
        [LogNames.CollectionSlot]: collectionSlot,
        [LogNames.CollectionTitle]: collectionTitle,
        ...(genre ? { Genre: genre } : {}),
    };
};

const createCollectionItemEventProps = ({ collectionSlot, collectionTitle, itemSlot, genre }: CollectionItemForLog) => {
    return {
        ...createCollectionEventProps({ collectionSlot, collectionTitle }),
        [LogNames.ItemSlot]: itemSlot,
        ...(genre ? { Genre: genre } : {}),
    };
};
