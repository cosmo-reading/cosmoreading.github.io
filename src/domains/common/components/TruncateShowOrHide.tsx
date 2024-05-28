import { ReactComponent as ArrowUpIcon } from '@app/assets/arrow-up.svg';
import clsx from 'clsx';

type Props = {
    showing: boolean;
};
export default function TruncateShowOrHide({ showing }: Props) {
    const text = showing ? 'Show more' : 'Show less';
    return (
        <div className="flex items-center text-gray-desc">
            <span className="font-set-sb13 sm2:font-set-sb15">{text}</span>
            <ArrowUpIcon className={clsx('ml-2 h-12 w-12 sm2:h-14 sm2:w-14', showing && 'rotate-180')} />
        </div>
    );
}
