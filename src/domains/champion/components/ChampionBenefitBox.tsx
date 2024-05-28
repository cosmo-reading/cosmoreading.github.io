import { ReactComponent as PlusIcon } from '@app/assets/plus.svg';
import type { ClassNameType } from '@app/domains/common/types';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { useMeasure } from 'react-use';
import { twMerge } from 'tailwind-merge';

type Props = {
    advanceChapterCount?: number;
};

export default function ChampionBenefitBox({ advanceChapterCount }: Props) {
    const [measureRef, { width: containerWidth }] = useMeasure<HTMLElement>();
    const shouldScaleDown = containerWidth < CONTAINER_MIN_WIDTH;

    return (
        <>
            <section
                ref={measureRef}
                className="w-full"
                style={{ height: shouldScaleDown ? `${containerWidth * HEIGHT_RELATIVE_TO_WIDTH}px` : 'auto' }}
            >
                <div
                    style={{
                        transform: shouldScaleDown
                            ? `perspective(${containerWidth}px) translateZ(calc(${containerWidth}px - ${CONTAINER_MIN_WIDTH}px))`
                            : 'none',
                    }}
                    className="relative inline-flex origin-top-left"
                >
                    <div className="mr-15 inline-block">
                        <BenefitBox>
                            <Title className="bg-gradient-ww-benefit-box-free" title="FREE" />
                            <ContentRows>
                                <span className={CONTENT_SUB_TEXT_STYLE}>&nbsp;</span>
                                <span className={CONTENT_MAIN_TEXT_STYLE}>ALL</span>
                                <span className={CONTENT_SUB_TEXT_STYLE}>{'Published\nChapters'}</span>
                            </ContentRows>
                        </BenefitBox>
                    </div>
                    <PlusCircle />
                    <BenefitBox>
                        <Title className="bg-gradient-ww-benefit-box-advance" title="Early Access" />
                        <ContentRows>
                            <span className={CONTENT_SUB_TEXT_STYLE}>up to</span>
                            <span className={CONTENT_MAIN_TEXT_STYLE}>{advanceChapterCount ?? '...'}</span>
                            <span className={CONTENT_SUB_TEXT_STYLE}>{'Advance\nChapters'}</span>
                        </ContentRows>
                    </BenefitBox>
                </div>
            </section>
        </>
    );
}

const BenefitBox = ({ children }: PropsWithChildren<{}>) => {
    return <div className="h-160 w-160 overflow-hidden rounded-20 shadow-ww-text-container">{children}</div>;
};

const Title = ({ className, title }: { title: string } & ClassNameType) => {
    return (
        <div className={twMerge(clsx('flex h-40 items-center justify-center', className))}>
            <span className="font-set-sb15 text-white">{title}</span>
        </div>
    );
};

const ContentRows = ({ children }: PropsWithChildren<ClassNameType>) => {
    return (
        <div className="h-120 bg-gray-bg-elevate pt-12">
            <div className="flex flex-col items-center space-y-1">{children}</div>
        </div>
    );
};

const PlusCircle = () => {
    return (
        <div className="absolute top-1/2 left-1/2 h-29 w-29 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-850 text-white dark:bg-gray-100 dark:text-gray-800">
            <div className="relative flex h-full items-center justify-center">
                <PlusIcon className="h-19 w-19" />
            </div>
        </div>
    );
};

const CONTENT_MAIN_TEXT_STYLE = 'font-set-sb26 text-gray-t2';
const CONTENT_SUB_TEXT_STYLE = 'font-set-m14 text-gray-desc whitespace-pre-line';

const CONTAINER_MIN_WIDTH = 335;
const HEIGHT_RELATIVE_TO_WIDTH = 160 / 335;
