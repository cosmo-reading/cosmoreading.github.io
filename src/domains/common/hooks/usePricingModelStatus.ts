import type { ChapterItem } from '@app/_proto/Protos/chapters';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { type ParsePricingModelStatusReturn, parsePricingModelStatus } from '@app/domains/common/utils';
import { useMemo } from 'react';

export type UsePricingModelStatusParams = {
    novel?: NovelItem | null | undefined;
    chapter?: ChapterItem | null | undefined;
};

export type UsePricingModelStatusReturn = ParsePricingModelStatusReturn;

export default function usePricingModelStatus({
    novel,
    chapter,
}: UsePricingModelStatusParams): UsePricingModelStatusReturn {
    return useMemo(() => {
        return parsePricingModelStatus({ novel, chapter });
    }, [novel, chapter]);
}
