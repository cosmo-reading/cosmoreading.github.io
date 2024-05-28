import { ReactComponent as ArrowUpIcon } from '@app/assets/arrow-up.svg';
import { ChampionEvents } from '@app/domains/champion/analytics/amplitude/events';
import type { TierActionType } from '@app/domains/champion/types';
import TruncateDisclosure from '@app/domains/common/components/TruncateDisclosure';
import ActivateButton from '@app/domains/common/components/button/ActivateButton';
import CancelButton from '@app/domains/common/components/button/CancelButton';
import useMediaQueries from '@app/domains/common/hooks/useMediaQueries';
import type { ClassNameType } from '@app/domains/common/types';
import { useHtmlToReact } from '@app/utils/html';
import { formatAmountForDisplay } from '@app/utils/utils';
import clsx from 'clsx';
import { type HTMLAttributes, type MouseEvent, type PropsWithChildren, type Ref, forwardRef } from 'react';
import { useMeasure } from 'react-use';
import { twMerge } from 'tailwind-merge';

type Props = {
    actionType: TierActionType;
    name: string;
    htmlDesc: string | undefined;
    advChapterCount: number;
    price: number;
    onAction?: (action: TierActionType) => void;
    onChangePaymentMethod?: (e: MouseEvent) => void;
} & HTMLAttributes<HTMLElement>;

export default forwardRef(function ChampionPlan(
    { actionType, name, htmlDesc, advChapterCount, price, onAction, onChangePaymentMethod, ...props }: Props,
    ref: Ref<HTMLDivElement>
) {
    const desc = useHtmlToReact(htmlDesc ?? '', {
        removeTags: ['hr', 'img'],
    });

    const cancelling = ['unsubscribe', 'reactivate'].includes(actionType);
    const activating = !cancelling;

    const { isDownSm } = useMediaQueries();

    return (
        <div
            className="flex h-full w-full max-w-[400px] flex-col overflow-hidden rounded-12 shadow-ww-text-container dark:bg-gray-900 dark:shadow-ww-text-container-dark"
            {...props}
            ref={ref}
        >
            <BenefitContainer className="flex items-center shadow-ww-underline">
                <div className="mr-4">
                    {!activating && <div className="font-set-sb12 text-blue-500">Subscribed</div>}
                    <div className="flex flex-col space-y-4">
                        <AdvanceChapterInfo advChapterCount={advChapterCount} />
                        <PriceInfo price={price} />
                    </div>
                </div>
                <div className="ml-auto">
                    {activating ? (
                        <ActivateButton
                            className="h-32 w-108"
                            onClick={() => {
                                onAction?.(actionType);
                            }}
                            data-amplitude-click-event={ChampionEvents.ClickChampionSubscribe}
                        >
                            {actionType.toUpperCase()}
                        </ActivateButton>
                    ) : (
                        <div className="flex w-110 flex-col items-end gap-y-4">
                            <CancelButton
                                className="h-32 w-108"
                                onClick={() => {
                                    onAction?.(actionType);
                                }}
                            >
                                {actionType.toUpperCase()}
                            </CancelButton>
                            {actionType === 'unsubscribe' && (
                                <div
                                    className="flex cursor-pointer items-center gap-x-2 text-gray-desc hover:text-blue-600 dark:hover:text-blue-500"
                                    onClick={onChangePaymentMethod}
                                >
                                    <div className="font-set-m10 text-right sm:font-set-m12">Change payment method</div>
                                    <ArrowUpIcon className="h-10 w-10 rotate-90" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </BenefitContainer>
            <TierContainer className="flex-grow text-gray-desc">
                <>
                    <div className="font-set-sb12 sm:font-set-sb13">{name}</div>
                    {isDownSm ? (
                        <TruncateDisclosure>
                            <TruncateDisclosure.Content className="font-set-r12 scroll-ww-plan-card max-h-[102px] overflow-y-auto pt-2">
                                {desc}
                            </TruncateDisclosure.Content>
                            <TruncateDisclosure.Toggle
                                className="font-set-m12"
                                showingComponent={<span>Show more</span>}
                                hidingComponent={<span>Show less</span>}
                            />
                        </TruncateDisclosure>
                    ) : (
                        <div className="font-set-r13 scroll-ww-plan-card max-h-[114px] overflow-y-auto pt-2">
                            {desc}
                        </div>
                    )}
                </>
            </TierContainer>
        </div>
    );
});

const BenefitContainer = ({ children, className }: PropsWithChildren<ClassNameType>) => {
    return <div className={twMerge('bg-white py-10 px-12 dark:bg-black/20', className)}>{children}</div>;
};

const TierContainer = ({ children, className }: PropsWithChildren<ClassNameType>) => {
    return <div className={twMerge('bg-gray-50 px-12 pt-8 pb-12 dark:bg-transparent', className)}>{children}</div>;
};

const AdvanceChapterInfo = ({ advChapterCount }: Pick<Props, 'advChapterCount'>) => {
    let appendText = '';
    if (advChapterCount) {
        const advChapterCountText = (() => {
            if (advChapterCount === -1) return 'All';
            return `${advChapterCount}`;
        })();
        appendText += ` + ${advChapterCountText} Advance`;
    }
    return (
        <div className="font-set-sb14 flex flex-wrap text-gray-t2">
            <div>All Chapters</div>
            {appendText && <div className="w-100 whitespace-pre">{appendText}</div>}
        </div>
    );
};

const PriceInfo = ({ price }: Pick<Props, 'price'>) => {
    const [measureRef, { width: containerWidth }] = useMeasure<HTMLDivElement>();
    const isSmallContainer = containerWidth < 124;

    return (
        <div ref={measureRef} className={clsx(isSmallContainer ? 'gap-x-2' : 'gap-x-4', 'flex items-center')}>
            <div
                className={clsx(isSmallContainer ? 'font-set-sb15' : 'font-set-sb16 sm:font-set-sb18', 'text-blue-600')}
            >
                {formatAmountForDisplay(price)}
            </div>
            <div className={clsx(isSmallContainer ? 'font-set-r10' : 'font-set-r13 sm:font-set-r14', 'text-gray-desc')}>
                / month
            </div>
        </div>
    );
};
