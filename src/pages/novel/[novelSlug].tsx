import { GetBookmarksRequest, ReadingListType } from '@app/_proto/Protos/bookmarks';
import { BookmarksClient } from '@app/_proto/Protos/bookmarks.client';
import type { NovelItem } from '@app/_proto/Protos/novels';
import type { TabsRef } from '@app/components/tabs/tabs';
import { AnalyticsTracking } from '@app/domains/common/components/AnalyticsTracking';
import SeoHelmet, { type SeoHelmetProps } from '@app/domains/common/components/SeoHelmet';
import { parseNovelStatus } from '@app/domains/common/utils';
import { getNovelPath } from '@app/domains/common/utils/path';
import { novelCommonLoggingParamsParser } from '@app/domains/novel/analytics/amplitude/handlers';
import type { TAB_ITEMS, TabItemKeys } from '@app/domains/novel/constants';
import NovelBody from '@app/domains/novel/containers/NovelBody';
import NovelCover from '@app/domains/novel/containers/NovelCover';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';
import { timestampToDate } from '@app/libs/utils';
import { makeAbsoluteUrl, useSchemaWith } from '@app/utils/schema';
import { useQueryClient } from '@tanstack/react-query';
import animateScrollTo from 'animated-scroll-to';
import { useCallback, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import type { Book, BreadcrumbList, WithContext } from 'schema-dts';

type Props = {
    novel: NovelItem;
};

export default function NovelPage({ novel }: Props) {
    //General variables
    const { user } = useAuth();

    //#region Get novel data

    //Get novel slug from query string
    const { novelSlug } = useParams();
    const { search, pathname } = useLocation();

    const searchParams = new URLSearchParams(search);
    const seeReview = searchParams.get('seeReview');

    //#endregion Get novel data

    //#region "Start Reading" / "Continue Reading" button

    const getBookmarksRequest = useGrpcRequest(GetBookmarksRequest, {
        listType: ReadingListType.Current,
        selector: {
            oneofKind: 'novelSlug',
            novelSlug: novelSlug!,
        },
        pagination: {
            oneofKind: 'pageInfo',
            pageInfo: {
                page: 1,
                count: 1,
            },
        },
    });

    //Server request to fetch the bookmark's list
    const { data: bookmarkItems } = useGrpcApiWithQuery(
        BookmarksClient,
        c => c.getBookmarks,
        getBookmarksRequest,
        ['bookmarks', user?.id, novelSlug],
        {
            enabled: !!user,
            refetchOnMount: true,
            //this data is secondary, do not show error dialog for it
            onError: undefined,
        }
    );

    const [bookmark] = bookmarkItems?.items || [];

    const containerRef = useRef<HTMLDivElement | null>(null);
    const novelTabsRef = useRef<TabsRef<(typeof TAB_ITEMS)[number]> | null>(null);

    const queryClient = useQueryClient();
    const novelData = queryClient.getQueryData(['bookmarks', user?.id, novelSlug]);
    const isNovelDetailLoading = !!(!novel || (user && novelData === undefined));

    const goToTop = async () => {
        if (containerRef.current) {
            await animateScrollTo(containerRef.current, {
                verticalOffset: -100,
                maxDuration: 500,
            });
        }
    };

    const handleGoToTab = useCallback(async (tab: TabItemKeys) => {
        await goToTop();

        novelTabsRef.current?.setItem(tab);
    }, []);
    //#endregion Tabs

    return (
        <div
            data-amplitude-params={JSON.stringify(novelCommonLoggingParamsParser(novel ?? undefined))}
            className="overflow-x-hidden"
        >
            <SeoHelmet
                {...parseNovelPageMetaData(novel)}
                script={[
                    ...useSchemaWith(
                        novel,
                        (novel): WithContext<Book> => ({
                            '@context': 'https://schema.org',
                            '@type': 'Book',
                            bookFormat: 'https://schema.org/EBook',
                            inLanguage: 'en',
                            mainEntityOfPage: makeAbsoluteUrl(pathname),
                            name: novel.name,
                            headline: novel.name,
                            url: makeAbsoluteUrl(pathname),
                            datePublished: timestampToDate(novel.createdAt)?.toISOString(),
                            image: novel.coverUrl?.value
                                ? {
                                      '@type': 'ImageObject',
                                      url: novel.coverUrl?.value,
                                  }
                                : undefined,
                            publisher: {
                                '@type': 'Organization',
                                name: 'Wuxiaworld',
                                url: makeAbsoluteUrl(''),
                                // logo: makeAbsoluteUrl(''), // TODO
                            },
                            author: novel.authorName?.value
                                ? {
                                      '@type': 'Person',
                                      name: novel.authorName.value,
                                  }
                                : undefined,
                            aggregateRating: {
                                '@type': 'AggregateRating',
                                name: novel.name,
                                ratingCount: novel.reviewInfo?.count ?? 0,
                                ratingValue: novel.reviewInfo?.rating?.value
                                    ? novel.reviewInfo.rating.value! * 100
                                    : undefined,
                                bestRating: 100,
                                worstRating: 0,
                                potentialAction: {
                                    '@type': 'ReadAction',
                                    target: {
                                        '@type': 'EntryPoint',
                                        actionPlatform: [
                                            'https://schema.org/DesktopWebPlatform',
                                            'https://schema.org/MobileWebPlatform',
                                            'https://schema.org/AndroidPlatform',
                                            'https://schema.org/IOSPlatform',
                                        ],
                                        urlTemplate: makeAbsoluteUrl(
                                            `/novel/${novel.slug}/${novel.chapterInfo?.firstChapter?.slug}`
                                        ),
                                    },
                                },
                            },
                        })
                    ),
                    ...useSchemaWith(
                        novel,
                        (novel): WithContext<BreadcrumbList> => ({
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: [
                                {
                                    '@type': 'ListItem',
                                    position: 1,
                                    name: 'Home',
                                    item: makeAbsoluteUrl(''),
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 2,
                                    name: 'Novels',
                                    item: makeAbsoluteUrl('/novels'),
                                },
                                {
                                    '@type': 'ListItem',
                                    position: 3,
                                    name: novel.name,
                                    item: makeAbsoluteUrl(`/novel/${novel.slug}`),
                                },
                            ],
                        })
                    ),
                ]}
            />
            <AnalyticsTracking
                extraProperties={{
                    dimension2: novel.translatorName?.value || novel.translator?.userName || null,
                    dimension4: novel.slug,
                    novel: novel.name,
                }}
            />
            <NovelCover
                novel={novel}
                bookmark={bookmark}
                novelSlug={novelSlug}
                isNovelDetailLoading={isNovelDetailLoading}
            />
            <NovelBody
                novel={novel}
                bookmark={!!seeReview ? undefined : bookmark}
                onGoToTab={handleGoToTab}
                containerRef={containerRef}
                novelTabsRef={novelTabsRef}
            />
        </div>
    );
}

const parseNovelPageMetaData = (novel: NovelItem): SeoHelmetProps => {
    const { name, genres, language, slug, coverUrl } = parseNovelStatus(novel);

    return {
        title: `${name} | Wuxiaworld`,
        description: [
            `${name} is a ${genres?.join(', ')} ${language} web novel.`,
            `Read the chapters of '${name}' from Wuxiaworld!`,
        ].join(' '),
        keywords: `${name}, ${language} webnovel, ${genres?.slice(0, 2).join(', ')}, Wuxiaworld`,
        siteImage: coverUrl,
        siteUrl: `${getNovelPath(slug ?? '')}`,
        schemas: [
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: process.env.VITE_REACT_APP_SITE,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Novels',
                        item: `${process.env.VITE_REACT_APP_SITE}/novels`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name,
                        item: `${process.env.VITE_REACT_APP_SITE}${getNovelPath(slug ?? '')}`,
                    },
                ],
            },
            {
                '@context': 'https://schema.org',
                '@type': 'Book',
                bookFormat: 'https://schema.org/EBook',
                inLanguage: 'en',
                mainEntityOfPage: makeAbsoluteUrl(`/novel/${novel.slug}`),
                name: novel.name,
                headline: novel.name,
                url: makeAbsoluteUrl(`/novel/${novel.slug}`),
                datePublished: timestampToDate(novel.createdAt)?.toISOString(),
                image: novel.coverUrl?.value
                    ? {
                          '@type': 'ImageObject',
                          url: novel.coverUrl?.value,
                      }
                    : undefined,
                publisher: {
                    '@type': 'Organization',
                    name: 'Wuxiaworld',
                    url: makeAbsoluteUrl(''),
                    // logo: makeAbsoluteUrl(''), // TODO
                },
                author: novel.authorName?.value
                    ? {
                          '@type': 'Person',
                          name: novel.authorName.value,
                      }
                    : undefined,
                aggregateRating: {
                    '@type': 'AggregateRating',
                    name: novel.name,
                    ratingCount: novel.reviewInfo?.count ?? 0,
                    ratingValue: novel.reviewInfo?.rating?.value ? novel.reviewInfo.rating.value! * 100 : undefined,
                    bestRating: 100,
                    worstRating: 0,
                    potentialAction: {
                        '@type': 'ReadAction',
                        target: {
                            '@type': 'EntryPoint',
                            actionPlatform: [
                                'https://schema.org/DesktopWebPlatform',
                                'https://schema.org/MobileWebPlatform',
                                'https://schema.org/AndroidPlatform',
                                'https://schema.org/IOSPlatform',
                            ],
                            urlTemplate: makeAbsoluteUrl(
                                `/novel/${novel.slug}/${novel.chapterInfo?.firstChapter?.slug}`
                            ),
                        },
                    },
                },
            },
        ],
    };
};
