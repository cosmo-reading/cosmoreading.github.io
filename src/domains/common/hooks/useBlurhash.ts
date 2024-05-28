import { useCompareMemo } from '@app/libs/hooks';
import { decode } from 'blurhash';

export type BlurHashOptions = {
    punch?: number;
    width: number;
    height: number;
};

export type BlurhashEntry = {
    hash: string;
    options: BlurHashOptions;
    src?: string;
};

const entryCache = new Map<string, Uint8ClampedArray>();

const decodeBlurhash = ({ hash, options: { punch, width, height } }: BlurhashEntry) => {
    return decode(hash, width, height, punch);
};

const getEntryMapKey = ({ hash, options: { height, width, punch } }: BlurhashEntry) => {
    return `${hash}_${height}_${width}_${punch}`;
};

const getBlurhash = (entry: BlurhashEntry) => {
    const key = getEntryMapKey(entry);

    const cachedData = entryCache.get(key);

    if (cachedData) {
        return cachedData;
    }

    const data = decodeBlurhash(entry);

    entryCache.set(key, data);

    return data;
};

export const useBlurhash = (entry: BlurhashEntry) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, ...rest } = entry;

    return useCompareMemo(() => getBlurhash(entry), [rest]);
};
