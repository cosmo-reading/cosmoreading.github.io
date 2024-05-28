import type { NovelItem } from '@app/_proto/Protos/novels';
import WithNoSsr from '@app/domains/common/containers/WithNoSsr';
import { getNovelAnnouncementUrl } from '@app/domains/common/utils/path';
import NovelAnnouncement from '@app/domains/novel/components/NovelAnnouncement';
import useNovelAnnouncements from '@app/domains/novel/hooks/useNovelAnnouncements';
import { useLocalStorage } from '@app/libs/hooks';
import { timestampToDate, timestampToUnix } from '@app/libs/utils';
import { Collapse } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const ReadAnnouncementsKey = 'read-announcements';

type Props = {
    classes?: {
        collapse?: string;
        root?: string;
    };
    novelId: NovelItem['id'];
    novelStatus: NovelItem['status'];
    novelSlug: NovelItem['slug'];
};

function NovelLatestAnnouncement({ classes, novelId, novelStatus, novelSlug }: Props) {
    const [readAnnouncements, setReadAnnouncements, , loaded] = useLocalStorage(ReadAnnouncementsKey, Array<number>());
    const [announceClosed, setAnnounceClosed] = useState(false);

    const { data: announcements = [] } = useNovelAnnouncements({
        novelId,
        novelStatus,
    });

    const [latestAnnouncement] = announcements;
    const { title, entityId, whenToPublish, slug: novelAnnouncementSlug } = latestAnnouncement ?? {};

    const isRecent = useMemo(() => {
        if (!latestAnnouncement) {
            return false;
        }

        const now = dayjs();
        const timePosted = dayjs.unix(timestampToUnix(whenToPublish)!);

        if (timePosted.isBefore(now.subtract(7, 'day'))) {
            return false;
        }

        return true;
    }, [latestAnnouncement, whenToPublish]);

    const handleDismiss = useCallback(() => {
        const set = new Set(readAnnouncements);
        set.add(entityId);

        setReadAnnouncements(Array.from(set));
        setAnnounceClosed(true);
    }, [entityId, readAnnouncements, setReadAnnouncements]);

    if (!latestAnnouncement || !isRecent || readAnnouncements.includes(entityId) || !loaded) {
        return null;
    }

    return (
        <Collapse in={!announceClosed} appear={false} className={twMerge('px-0', classes?.collapse)}>
            <NovelAnnouncement
                className={classes?.root}
                publishedDate={timestampToDate(whenToPublish) ?? undefined}
                title={title}
                link={getNovelAnnouncementUrl({ novelSlug, novelAnnouncementSlug })}
                onClose={handleDismiss}
            />
        </Collapse>
    );
}

export default WithNoSsr<Props>(NovelLatestAnnouncement);
