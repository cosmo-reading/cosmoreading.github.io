import type { NovelItem } from '@app/_proto/Protos/novels';
import { logAnalyticsEvent } from '@app/analytics';
import { HEADER_EVENT_NAMES, HeaderEvents } from '@app/domains/header/analytics/amplitude/events';

export const headerAmplitudeHandler = (event: HeaderEvents) => {
    switch (event) {
        case HeaderEvents.ClickChampion:
        case HeaderEvents.ClickWuxiaLogo:
            return logAnalyticsEvent(HEADER_EVENT_NAMES[event]);
        default:
            throw new Error('Not Implemented');
    }
};

export const headerAnalyticsFactory = (event: HeaderEvents): any => {
    switch (event) {
        case HeaderEvents.Search:
        case HeaderEvents.ClickSearchResult:
            return ({ on, novel }: { on: string; novel: NovelItem }) => {
                logAnalyticsEvent(HEADER_EVENT_NAMES[event], {
                    On: on,
                    'Series Id': novel.id,
                    'Series Title': novel.name,
                    Writer: novel.authorName?.value,
                    Translator: novel.translator?.userName ?? novel.translatorName?.value,
                    Genres: novel.genres,
                    'Completion Status': novel.status,
                });
            };
        case HeaderEvents.ClickKarma:
        case HeaderEvents.ClickVipSubscription:
        case HeaderEvents.ClickVip:
        case HeaderEvents.ClickLoginCheckIn:
            return ({ on }: { on: string }) => {
                logAnalyticsEvent(HEADER_EVENT_NAMES[event], {
                    On: on,
                });
            };
        case HeaderEvents.ClickMode:
            return ({ mode }: { mode: string }) => {
                logAnalyticsEvent(HEADER_EVENT_NAMES[event], {
                    'Background Mode': mode,
                });
            };
        case HeaderEvents.ClickWuxiaLogo:
        case HeaderEvents.ClickSeriesTab:
        case HeaderEvents.ClickBookmarksTab:
        case HeaderEvents.ClickResourcesTab:
        case HeaderEvents.ClickAudiobooksTab:
        case HeaderEvents.ClickEbooksTab:
        case HeaderEvents.ClickStore:
        case HeaderEvents.ClickBilling:
        case HeaderEvents.ClickFaq:
        case HeaderEvents.ClickNotification:
        case HeaderEvents.ClickNotificationPage:
        case HeaderEvents.ClickMyPage:
        case HeaderEvents.ClickProfile:
        case HeaderEvents.ClickNotifications:
        case HeaderEvents.ClickMyAudiobooks:
        case HeaderEvents.ClickMyEbooks:
        case HeaderEvents.ClickSetting:
            return () => {
                logAnalyticsEvent(HEADER_EVENT_NAMES[event]);
            };
        default:
            throw new Error('Not Implemented');
    }
};
