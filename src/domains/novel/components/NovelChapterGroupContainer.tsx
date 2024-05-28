import type { ChapterGroupItem } from '@app/_proto/Protos/chapters';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { ReactComponent as ArrowUp } from '@app/assets/arrow-up.svg';
import { ChapterListSortOrder } from '@app/domains/chapter/types';
import CircularProgress from '@app/domains/common/components/CircularProgress';
import NovelChapterGroup from '@app/domains/novel/components/NovelChapterGroup';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import clsx from 'clsx';
import { Suspense, useCallback, useState } from 'react';

type Props = {
    advanced?: boolean;
    index: number;
    totalLength: number;
    novel: NovelItem;
    chapterGroup: ChapterGroupItem;
    initialExpanded?: boolean;
    sort: ChapterListSortOrder;
    chunked?: boolean;
    onExpandGroup?: (cg: ChapterGroupItem) => void;
};
export default function NovelChapterGroupContainer({
    advanced,
    index,
    totalLength,
    novel,
    chapterGroup,
    sort,
    initialExpanded,
    onExpandGroup,
    chunked,
}: Props) {
    const [hasExpanded, setHasExpanded] = useState(initialExpanded ?? false);
    const groupNumber = sort === ChapterListSortOrder.Newest ? totalLength - index : index + 1;
    const handleChange = useCallback(
        (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
            onExpandGroup?.(chapterGroup);
            setHasExpanded(expanded);
        },
        [chapterGroup, onExpandGroup]
    );
    return (
        <Accordion
            disableGutters
            expanded={hasExpanded}
            className={clsx([
                'my-0 overflow-hidden overflow-clip rounded-none border-b-0 shadow-none first:rounded-none last:rounded-none dark:bg-[#202020]',
                'md:mb-[12px] md:rounded-[12px] md:bg-white md:shadow-ww-text-container md:first:rounded-[12px] md:last:rounded-[12px] md:dark:bg-gray-850',
            ])}
            onChange={handleChange}
            TransitionProps={{
                timeout: 500,
                appear: false,
            }}
        >
            <AccordionSummary
                className={clsx([
                    'border-b border-solid !border-b-gray-300 px-0 dark:!border-b-gray-800 dark:bg-[#202020]',
                    'md:border-b-0 md:bg-white md:px-[16px] md:dark:bg-gray-850',
                ])}
                expandIcon={
                    <ArrowUp
                        className={clsx('origin-center rotate-180', {
                            'text-gray-600': !hasExpanded,
                            'text-blue-500': hasExpanded,
                        })}
                    />
                }
            >
                <section className="flex h-[27px] items-center md:h-[40px]">
                    {advanced ? (
                        <img
                            className="mr-4 h-36 w-36"
                            src="/images/champion-badge@3x.png"
                            alt="champion-badge"
                            width={36}
                            height={36}
                        />
                    ) : (
                        <div className="font-set-b16 mr-[8px] inline-block h-[32px] min-w-[32px] rounded-[4px] bg-gray-container-base text-gray-t1">
                            <span className="flex h-full w-full items-center justify-center">{groupNumber}</span>
                        </div>
                    )}
                    <span className="font-set-sb18 text-gray-t1 line-clamp-1">{chapterGroup.title}</span>
                </section>
            </AccordionSummary>
            <AccordionDetails className="bg-white px-0 py-0 dark:bg-[#202020] md:bg-gray-50 md:py-[21px] md:px-[28px] md:dark:bg-gray-850">
                <Suspense
                    fallback={
                        <div className="py-[12px] content-dead-center">
                            <CircularProgress />
                        </div>
                    }
                >
                    <NovelChapterGroup
                        advanced={advanced}
                        novel={novel}
                        chapterGroup={chapterGroup}
                        sort={sort}
                        active={hasExpanded}
                        chunked={chunked ?? false}
                    />
                </Suspense>
            </AccordionDetails>
        </Accordion>
    );
}
