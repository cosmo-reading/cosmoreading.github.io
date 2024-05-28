import type { SiteAnnouncementItem } from '@app/_proto/Protos/site_announcements';
import { ReactComponent as Flag } from '@app/assets/flag.svg';
import Banner, { type BannerProps } from '@app/components/banner';
import WithNoSsr from '@app/domains/common/containers/WithNoSsr';
import useSiteAnnouncements from '@app/domains/common/hooks/useSiteAnnouncements';
import { useLocalStorage } from '@app/libs/hooks';
import { timestampToUnix } from '@app/libs/utils';
import { useTimeAgo } from '@app/utils/time';
import { isBrowser } from '@app/utils/utils';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useMatch } from 'react-router';

const ReadNewsKey = 'read-news';

export type NewsBannerProps = {
    className?: string;
    bannerProps?: Partial<BannerProps>;
    checkLayout?: boolean;
    count?: number;
};

function HeaderNews({ count = 1, className, bannerProps }: NewsBannerProps) {
    const [readSiteAnnouncements, setReadSiteAnnouncements, , loaded] = useLocalStorage(ReadNewsKey, Array<number>());
    const isHomePage = useMatch({
        path: '/',
        end: true,
    });

    const { data: siteAnnouncements } = useSiteAnnouncements({
        enabled: !isHomePage && isBrowser(),
        suspense: false,
        requestOption: {
            pageInfo: { page: 1, count },
        },
    });

    const filteredSiteAnnouncements = useMemo(() => {
        const now = dayjs();

        return siteAnnouncements?.filter(siteAnnouncement => {
            const timePosted = dayjs.unix(timestampToUnix(siteAnnouncement.timePosted)!);
            const isFresh = !timePosted.isBefore(now.subtract(14, 'day'));
            return !readSiteAnnouncements.includes(siteAnnouncement.entityId) && isFresh;
        });
    }, [readSiteAnnouncements, siteAnnouncements]);

    const handleDismissSiteAnnouncement = (siteAnnouncementId: number) => {
        const set = new Set(readSiteAnnouncements);
        set.add(siteAnnouncementId);
        setReadSiteAnnouncements(Array.from(set));
    };

    if (!loaded) {
        return null;
    }

    return (
        <>
            {filteredSiteAnnouncements?.map(siteAnnouncement => (
                <NewsBannerItem
                    key={siteAnnouncement.entityId}
                    siteAnnouncement={siteAnnouncement}
                    className={className}
                    bannerProps={bannerProps}
                    handleDismissSiteAnnouncement={handleDismissSiteAnnouncement}
                />
            ))}
        </>
    );
}

type NewsBannerItemProps = {
    siteAnnouncement: SiteAnnouncementItem;
    className?: string;
    bannerProps?: Partial<BannerProps>;
    handleDismissSiteAnnouncement: (siteAnnouncementId: number) => void;
};

function NewsBannerItem({
    siteAnnouncement,
    className,
    bannerProps,
    handleDismissSiteAnnouncement,
}: NewsBannerItemProps) {
    const { timePosted, title, slug, entityId } = siteAnnouncement;
    const timeAgo = useTimeAgo(timePosted ? timestampToUnix(timePosted) : null, {
        refreshInterval: 0,
    });

    return (
        <Banner
            className={className}
            innerClassName="mx-auto max-w-7xl px-[12px] sm:px-[24px] lg:px-[96px]"
            onDismiss={() => {
                handleDismissSiteAnnouncement(entityId);
            }}
            heading={title}
            subheading={timeAgo}
            link={`/news/${slug}`}
            linkText="Show more"
            icon={Flag}
            {...bannerProps}
        />
    );
}

export default WithNoSsr<NewsBannerProps>(HeaderNews);
