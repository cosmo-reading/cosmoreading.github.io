import type { NovelItem } from '@app/_proto/Protos/novels';
import type { ProductItem } from '@app/_proto/Protos/products';
import { logAnalyticsEvent } from '@app/analytics';
import { STORE_EVENT_NAMES, StoreEvents } from '@app/domains/store/analytics/amplitude/events';

export const storeAnalyticsFactory = (event: StoreEvents): any => {
    switch (event) {
        case StoreEvents.ClickLoginCheckIn:
            return ({ on }: { on: string }) => {
                logAnalyticsEvent(STORE_EVENT_NAMES[event], {
                    On: on,
                });
            };
        case StoreEvents.ViewStoreChampionSearch:
            return input => {
                logAnalyticsEvent(STORE_EVENT_NAMES[event], { 'Input Keyword': input });
            };
        case StoreEvents.ClickVipSubscribe:
            return ({
                price,
                vipId,
                vipInterval,
                vipType,
                vipProductId,
            }: {
                price: string;
                vipId: number;
                vipInterval: number;
                vipType: string;
                vipProductId: string | number;
            }) => {
                logAnalyticsEvent(STORE_EVENT_NAMES[event], {
                    Price: price,
                    'VIP ID': vipId,
                    'VIP Interval': vipInterval,
                    'VIP Type': vipType,
                    'VIP Product ID': vipProductId,
                });
            };
        case StoreEvents.BuyVipSubscription:
            return ({
                actionType,
                price,
                vipId,
                vipInterval,
                vipType,
                vipProductId,
                paymentMethod,
            }: {
                actionType: string;
                price: string;
                vipId: number;
                vipInterval: number;
                vipType: string;
                vipProductId: string | number;
                paymentMethod: string;
            }) => {
                logAnalyticsEvent(STORE_EVENT_NAMES[event], {
                    'Action Type': actionType,
                    'Payment Method': paymentMethod,
                    Price: price,
                    'VIP ID': vipId,
                    'VIP Interval': vipInterval,
                    'VIP Type': vipType,
                    'VIP Product ID': vipProductId,
                });
            };
        case StoreEvents.SelectVipSeries:
            return ({ on, novel }: { on: string; novel?: NovelItem }) => {
                if (novel) {
                    logAnalyticsEvent(STORE_EVENT_NAMES[event], {
                        On: on,
                        'Series Id': novel.id,
                        'Series Title': novel.name,
                        Writer: novel.authorName?.value,
                        Translator: novel.translatorName?.value ?? novel.translator?.userName,
                        Genres: novel.genres,
                    });
                }
            };
        case StoreEvents.ClickStoreChampionPageNumber:
            return ({ pageNumber }: { pageNumber: number }) => {
                logAnalyticsEvent(STORE_EVENT_NAMES[event], {
                    'Page Number': pageNumber,
                });
            };
        case StoreEvents.ClickBuyKarma:
        case StoreEvents.BuyKarma:
            return ({ product, price, productType }: { product: ProductItem; price: string; productType: string }) => {
                logAnalyticsEvent(STORE_EVENT_NAMES[event], {
                    Quantity: product.quantity,
                    Price: price,
                    'Karma ID': product.id,
                    'Product Type': productType,
                });
            };
    }
};
