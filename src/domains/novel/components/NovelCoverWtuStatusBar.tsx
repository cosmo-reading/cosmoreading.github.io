import { ReactComponent as QuestionIcon } from '@app/assets/question-old.svg';
import Tooltip from '@app/domains/common/components/Tooltip';
import { capitalize, pluralize } from '@app/domains/common/utils';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import type { WtuStatus } from '@app/domains/novel/types';
import { formatDurationAsDigitalClock, waitTimeSecToStr } from '@app/domains/novel/utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useInterval } from 'react-use';

type Props = {
    isLoading: boolean;
    wtuStatus: WtuStatus;
    waitTimeSec?: number;
    waitCompleteDate?: Date;
    remainingCoupons?: number;
    maxCoupons?: number;
    vipBenefitedNovel?: boolean;
    championedNovel?: boolean;
};

export default function NovelCoverWtuStatusBar({
    isLoading,
    wtuStatus,
    waitTimeSec,
    waitCompleteDate,
    remainingCoupons,
    maxCoupons = 2,
    vipBenefitedNovel,
    championedNovel,
}: Props) {
    const benefited = vipBenefitedNovel || championedNovel;
    const waitTimeStr = waitTimeSec !== undefined ? waitTimeSecToStr({ waitTimeSec, isTimeUnitAbbreviated: true }) : '';
    const waitTimeReadableStr =
        waitTimeSec !== undefined ? waitTimeSecToStr({ waitTimeSec, isTimeUnitAbbreviated: false }) : '';

    const remainMs = (() => {
        if (wtuStatus === 'standBy' && waitTimeSec) return waitTimeSec * 1000;
        if (!waitCompleteDate) {
            return waitTimeSec === undefined ? undefined : waitTimeSec * 1000;
        }

        const remain = dayjs(waitCompleteDate).diff(dayjs());
        if (remain < 0) return 0;
        return remain;
    })();

    let status = wtuStatus;

    if (wtuStatus === 'waitingCoupon' && remainMs !== undefined && remainMs <= 0) {
        status = 'holdingCoupon';
    }

    const running = status === 'waitingCoupon' && waitCompleteDate;

    const waitProgressRatio = (() => {
        if (benefited) return 1;
        if (status === 'standBy') return 0;
        if (status === 'holdingCoupon') return 1;
        if (waitTimeSec === undefined || remainMs === undefined) return undefined;
        const progress = 1 - remainMs / 1000 / (waitTimeSec || 1);
        if (progress > 1) return 1;
        if (progress < 0) return 0;
        return progress;
    })();

    const [, setNow] = useState(() => dayjs());

    useInterval(
        () => {
            setNow(dayjs());
        },
        running ? DELAY : null
    );

    const remainStr = remainMs === undefined ? '' : formatDurationAsDigitalClock(remainMs);
    const isLongRemainStr = (remainStr?.length || 0) > 13;

    return (
        <HeroTextPlaceholder item={!isLoading} className="rounded-[12px]" skeletonProps={BASE_SKELETON_PROPS}>
            <div className="flex h-[40px] items-center rounded-[12px] bg-gray-bg-elevate">
                <img
                    className="ml-[4px] h-[32px] w-[32px] min-w-[32px]"
                    src="/images/clock@3x.png"
                    alt="wait to unlock status icon"
                />
                <span
                    className={clsx('font-set-b13 grow', benefited ? 'text-gray-400' : 'text-blue-600')}
                    role="status"
                >
                    {`${pluralize(maxCoupons, 'Free Chapter')} Every ${capitalize(waitTimeStr)}`}
                </span>
                <span
                    className={clsx(
                        'flex w-84 flex-col items-center space-y-3',
                        isLongRemainStr ? 'font-set-sb9' : 'font-set-sb10'
                    )}
                >
                    <Status
                        vipBenefited={!!vipBenefitedNovel}
                        championed={!!championedNovel}
                        status={status}
                        remainingCoupons={remainingCoupons}
                        remainStr={remainStr}
                        waitProgressRatio={waitProgressRatio}
                    />
                </span>
                <Tooltip
                    title={`If you wait ${waitTimeReadableStr} after reading an episode, you can read ${pluralize(
                        maxCoupons,
                        'chapter'
                    )} for free.`}
                >
                    <div className="mr-6">
                        <QuestionIcon className="h-[13px] w-[13px] text-black/20 dark:text-white/20" />
                    </div>
                </Tooltip>
            </div>
        </HeroTextPlaceholder>
    );
}

type StatusProps = {
    vipBenefited?: boolean;
    championed?: boolean;
    status: WtuStatus;
    remainingCoupons?: number;
    remainStr?: string;
    waitProgressRatio?: number;
};
const Status = ({ waitProgressRatio, ...props }: StatusProps) => {
    return (
        <>
            <div data-testid="status-text">
                <StatusText {...props} />
            </div>
            <StatusBar waitProgressRatio={waitProgressRatio} />
        </>
    );
};

type StatusTextProps = {
    vipBenefited?: boolean;
    championed?: boolean;
    status: WtuStatus;
    remainingCoupons?: number;
    remainStr?: string;
};
const StatusText = ({ vipBenefited, championed, status, remainingCoupons, remainStr }: StatusTextProps) => {
    if (vipBenefited || championed) {
        const benefitText = (() => {
            if (championed) return 'Subscribing';
            return 'VIP Access';
        })();
        return (
            <div className="flex items-center">
                <div className="text-blue-600">{benefitText}</div>
            </div>
        );
    } else if (status === 'holdingCoupon') {
        return <div className="text-blue-600">{pluralize(remainingCoupons, 'Free Chapter')}</div>;
    } else {
        return (
            <div className="h-[12px] text-gray-desc" role="timer">
                {remainStr}
            </div>
        );
    }
};

const StatusBar = ({ waitProgressRatio }: { waitProgressRatio?: number }) => {
    const waitProgress = waitProgressRatio ? Number((waitProgressRatio * 100).toFixed(1)) : 0;
    return (
        <div className={clsx('h-[3px] w-72 rounded-full bg-gray-300 dark:bg-gray-850')}>
            <div
                data-testid="wait-progress"
                className="h-[3px] rounded-full bg-gradient-ww-blue-button"
                style={{ width: `${waitProgress}%` }}
            />
        </div>
    );
};

const DELAY = 1000;
