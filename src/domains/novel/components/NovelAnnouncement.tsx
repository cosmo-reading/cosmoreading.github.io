import { ReactComponent as Flag } from '@app/assets/flag.svg';
import { ReactComponent as Close } from '@app/assets/x.svg';
import { useTimeAgo } from '@app/utils/time';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type NovelAnnouncementProps = {
    className?: string;
    publishedDate?: Date;
    title?: string;
    link?: string;
    onClose?: () => void;
};

export default function NovelAnnouncement({
    className,
    publishedDate,
    title = '',
    link = '',
    onClose,
}: NovelAnnouncementProps) {
    const agoStr = useTimeAgo(dayjs(publishedDate).unix());
    if (!title) return null;

    return (
        <article
            className={twMerge(
                'rounded-[12px] pl-[12px] pr-[8px] pb-[12px] shadow-ww-text-container dark:bg-gray-950',
                className
            )}
        >
            <div className="flex">
                <div className="flex flex-1 pt-[10px] pb-[6px]">
                    <Flag className="h-[16px] w-[16px] text-blue-600" />
                    {publishedDate && (
                        <span className="font-set-r13 ml-[4px] text-gray-600 dark:text-gray-400">{agoStr}</span>
                    )}
                </div>
                <button className="-mr-[8px] p-[8px]" onClick={onClose}>
                    <Close className="h-[16px] w-[16px] text-gray-500 dark:text-gray-700" />
                </button>
            </div>
            <Link to={link} className="font-set-sb14 text-gray-t1 line-clamp-2 md:font-set-sb16 md:line-clamp-1">
                {title}
            </Link>
        </article>
    );
}
