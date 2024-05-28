import type { NovelAnnouncementItem } from '@app/_proto/Protos/novel_announcements';
import Link from '@app/components/link';
import UserFlairBadge from '@app/domains/user/components/UserFlairBadge';
import { timestampToUnix } from '@app/libs/utils';
import { useTimeAgo } from '@app/utils/time';
import { Typography } from '@mui/material';
import * as React from 'react';

//#region : Main component

/** Custom. Main component parameters type */
export type NovelAnnouncementsItemProps = JSX.IntrinsicElements['div'] & {
    announcement: NovelAnnouncementItem;
    className?: string;
};

/**
 * Custom.
 *
 * Displays individual novel announcement.
 * Only a part of the announcement text is displayed.
 * The hidden announcement text is collapsible.
 */
export default function NovelAnnouncementsItem({ announcement, ...rest }: NovelAnnouncementsItemProps) {
    /** Custom. Formatted announcement publish datetime. */
    const timeAgo = useTimeAgo(timestampToUnix(announcement.timePublished), {
        refreshInterval: 0,
    });

    return (
        <div {...rest}>
            <Link
                className="text-[14px] text-gray-t0"
                color="inherit"
                href={`/announcements/${announcement.novelInfo?.slug}/${announcement.slug}`}
            >
                {announcement.title}
            </Link>
            <div className="flex text-[14px]">
                <div className="text-[#888888]">by</div>
                <div className="ml-[5px] flex flex-1 items-center break-word">
                    <span className="mr-[5px] text-[#666666] dark:text-[#999999]">{announcement.poster?.userName}</span>
                    <UserFlairBadge flair={announcement.poster?.flair?.value} />
                </div>
            </div>
            <Typography color="#888" fontSize="13px">
                {timeAgo}
            </Typography>
        </div>
    );
}
//#endregion : Main component
