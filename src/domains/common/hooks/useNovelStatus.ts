import type { NovelItem } from '@app/_proto/Protos/novels';
import { type ParseNovelStatusReturn, parseNovelStatus } from '@app/domains/common/utils';
import { useMemo } from 'react';

export type UseNovelStatusParam = {
    novel: NovelItem | undefined;
};

type UseNovelStatusReturn = ParseNovelStatusReturn;

export default function useNovelStatus({ novel }: UseNovelStatusParam): UseNovelStatusReturn {
    return useMemo(() => {
        return parseNovelStatus(novel);
    }, [novel]);
}
