import { useMemo } from 'react';
import { helmetJsonLdProp } from 'react-schemaorg';
import type { Thing, WithContext } from 'schema-dts';

type WithNotNullValues<T> = { [K in keyof T]: Exclude<T[K], undefined | null> };

export const makeAbsoluteUrl = (path: string) => {
    const siteUrl = process.env.VITE_REACT_APP_SITE;

    if (!siteUrl) {
        throw new Error('Site URL missing');
    }

    const baseUrl = new URL(siteUrl);
    baseUrl.pathname = path;

    return baseUrl.toString();
};

export const useSchemaWith = function useSchemaWith<TThing extends Thing, TWith>(
    withObj: TWith | null,
    item: (obj: NonNullable<WithNotNullValues<TWith>>) => WithContext<TThing>
) {
    return useMemo(() => {
        if (!withObj || Object.values(withObj).some(val => val === null)) {
            return [];
        }

        return [helmetJsonLdProp(item(withObj as WithNotNullValues<TWith>))];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withObj]);
};
