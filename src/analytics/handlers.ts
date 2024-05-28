import { BookmarkEvents } from '@app/domains/bookmark/analytics/amplitude/events';
import { bookmarkAnalyticsFactory } from '@app/domains/bookmark/analytics/amplitude/handlers';
import { ChampionEvents } from '@app/domains/champion/analytics/amplitude/events';
import { championAmplitudeHandler, championAnalyticsFactory } from '@app/domains/champion/analytics/amplitude/handlers';
import { ChapterEvents } from '@app/domains/chapter/analytics/amplitude/events';
import { chapterAmplitudeHandler, chapterAnalyticsFactory } from '@app/domains/chapter/analytics/amplitude/handlers';
import { HeaderEvents } from '@app/domains/header/analytics/amplitude/events';
import { headerAmplitudeHandler } from '@app/domains/header/analytics/amplitude/handlers';
import { HomeEvents } from '@app/domains/home/analytics/amplitude/events';
import { homeAmplitudeHandler } from '@app/domains/home/analytics/amplitude/handlers';
import { NovelEvents } from '@app/domains/novel/analytics/amplitude/events';
import { novelAmplitudeHandler, novelAnalyticsFactory } from '@app/domains/novel/analytics/amplitude/handlers';
import { StoreEvents } from '@app/domains/store/analytics/amplitude/events';
import { storeAnalyticsFactory } from '@app/domains/store/analytics/amplitude/handlers';

export type AllEvents =
    | HomeEvents
    | HeaderEvents
    | BookmarkEvents
    | NovelEvents
    | ChapterEvents
    | StoreEvents
    | ChampionEvents;

export const analyticsFactory = (event: AllEvents): any => {
    if (Object.values(BookmarkEvents).includes(event as BookmarkEvents)) {
        return bookmarkAnalyticsFactory(event as BookmarkEvents);
    }
    if (Object.values(ChapterEvents).includes(event as ChapterEvents)) {
        return chapterAnalyticsFactory(event as ChapterEvents);
    }
    if (Object.values(NovelEvents).includes(event as NovelEvents)) {
        return novelAnalyticsFactory(event as NovelEvents);
    }
    if (Object.values(StoreEvents).includes(event as StoreEvents)) {
        return storeAnalyticsFactory(event as StoreEvents);
    }
    if (Object.values(ChampionEvents).includes(event as ChampionEvents)) {
        return championAnalyticsFactory(event as ChampionEvents);
    }
    return () => {}; // fallback
};

export const amplitudeHandler = (event: AllEvents, el: HTMLElement | undefined) => {
    if (Object.values(HomeEvents).includes(event as HomeEvents)) {
        return homeAmplitudeHandler(event as HomeEvents, el);
    }
    if (Object.values(HeaderEvents).includes(event as HeaderEvents)) {
        return headerAmplitudeHandler(event as HeaderEvents);
    }
    if (Object.values(ChapterEvents).includes(event as ChapterEvents)) {
        return chapterAmplitudeHandler(event as ChapterEvents, el);
    }
    if (Object.values(ChampionEvents).includes(event as ChampionEvents)) {
        return championAmplitudeHandler(event as ChampionEvents, el);
    }
    if (Object.values(NovelEvents).includes(event as NovelEvents)) {
        return novelAmplitudeHandler(event as NovelEvents, el);
    }
    return () => {}; // fallback
};
