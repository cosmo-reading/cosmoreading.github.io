type GetChapterPathParams = {
    novelSlug?: string;
    chapterSlug?: string;
};

export const getNovelPath = (novelSlug: string) => {
    return `/novel/${novelSlug}`;
};

export const getChapterPath = ({ novelSlug, chapterSlug }: GetChapterPathParams) => {
    return `/novel/${novelSlug}/${chapterSlug}`;
};

export const getSiteAnnouncementUrl = (siteAnnouncementSlug: string): string => {
    return `/news/${siteAnnouncementSlug}`;
};

export const getNovelAnnouncementUrl = ({
    novelSlug,
    novelAnnouncementSlug,
}: {
    novelSlug: string;
    novelAnnouncementSlug: string;
}) => {
    return `/announcements/${novelSlug}/${novelAnnouncementSlug}`;
};

export const ROUTE_PATH_MAP = {
    VIP_SUBSCRIPTION: '/manage/subscriptions/vip',
} as const;
