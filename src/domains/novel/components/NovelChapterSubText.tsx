import { ReactComponent as Karma } from '@app/assets/karma.svg';
import clsx from 'clsx';
import dayjs from 'dayjs';

export type Props = {
    publishedDate?: Date;
    isOwned: boolean;
    advanced?: boolean;
    shouldPayKarma?: boolean;
    karmaPrice?: number;
};

export default function NovelChapterSubText({ publishedDate, isOwned, advanced, shouldPayKarma, karmaPrice }: Props) {
    return (
        <div
            className={clsx(
                'font-set-r13 flex items-center text-gray-desc group-visited:text-gray-350 dark:group-visited:text-gray-750'
            )}
        >
            <span>
                {advanced ? 'Early access chapter' : publishedDate && dayjs(publishedDate).format('YYYY.MM.DD')}
            </span>
            {isOwned ? (
                <div className="flex" data-testid="owned">
                    <SubTextConnector />
                    <div className="font-set-m13">Owned</div>
                </div>
            ) : shouldPayKarma && karmaPrice ? (
                <div className="flex items-center">
                    <SubTextConnector />
                    <Karma className="h-[11px] w-[11px] text-gray-400" data-testid="karma-icon" />
                    <span className="font-set-sb13 ml-[3px] text-gray-600 dark:text-gray-400">{karmaPrice}</span>
                </div>
            ) : null}
        </div>
    );
}

const SubTextConnector = () => {
    return <div className="w-[10px] text-center">&middot;</div>;
};
