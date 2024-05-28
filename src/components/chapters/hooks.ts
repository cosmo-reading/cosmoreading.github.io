import { CONTRASTS } from '@app/domains/chapter/components/ChapterFontSelector';
import type { ViewerContrast } from '@app/domains/chapter/types';
import { isBrowser } from '@app/utils/utils';
import { EventEmitter } from 'eventemitter3';
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';

export const ChapterSettingsKey = 'chapter-settings';

/**
 * Custom type.
 */
export type ChapterSettings = {
    /** Increment the version number, whenever you make any logic change. **/
    version: number;

    fontSizeStep: number;
    lineHeightStep: number;

    fontFamily: string;
    viewerContrast: {
        light: ViewerContrast;
        dark: ViewerContrast;
    };
    paragraphComments: boolean;
};

/**
 * Custom.
 *
 * Font menu defaults.
 *
 * Increment the version number, whenever you make any logic change.
 */
export const ChapterFontMenuDefaults = {
    /** Increment the version number, whenever you make any logic change. **/
    version: 3,

    /** Denotes px value */
    fontSizeStep: 16,
    maxFontSizeCounter: 48,

    /** Denotes px value */
    lineHeightStep: 24,
    maxLineHeightCounter: 64,

    fontSizeMultiplier: 1,
    lineHeightMultiplier: 1,

    viewerContrast: {
        light: CONTRASTS[0],
        dark: CONTRASTS[2],
    },
};

export const ChapterSettingsDefaults: ChapterSettings = {
    fontFamily: 'Open Sans',
    fontSizeStep: ChapterFontMenuDefaults.fontSizeStep,
    lineHeightStep: ChapterFontMenuDefaults.lineHeightStep,
    viewerContrast: ChapterFontMenuDefaults.viewerContrast,
    version: ChapterFontMenuDefaults.version,
    paragraphComments: true,
};

/**
 * Custom.
 */
export function calculateFontSize(fontSizeStep: number): number {
    return fontSizeStep * ChapterFontMenuDefaults.fontSizeMultiplier;
}

/**
 * Custom.
 */
export function calculateLineHeight(lineHeightStep: number): number {
    return lineHeightStep * ChapterFontMenuDefaults.lineHeightMultiplier;
}

export type ChapterSettingsContextType = ChapterSettings;

const SettingsEmitter = new EventEmitter();

export const useChapterSettings = () => {
    const setChapterSettings = useCallback((value: ChapterSettings) => {
        if (!value) {
            localStorage.removeItem(ChapterSettingsKey);
        } else {
            localStorage.setItem(ChapterSettingsKey, JSON.stringify(value));
        }

        SettingsEmitter.emit('SetChapterSettings', value);
    }, []);

    const [subscribe, getSnapshot, getServerSnapshot] = useMemo(() => {
        const storedJson = isBrowser() ? localStorage.getItem(ChapterSettingsKey) : null;
        let storedSettings = ChapterSettingsDefaults;

        if (storedJson) {
            storedSettings = JSON.parse(storedJson);

            if (storedSettings.version !== ChapterSettingsDefaults.version) {
                storedSettings = ChapterSettingsDefaults;
            }
        }

        return [
            notify => {
                const handleChange = (settings: ChapterSettings) => {
                    storedSettings = settings;

                    notify();
                };

                SettingsEmitter.addListener('SetChapterSettings', handleChange);

                return () => {
                    SettingsEmitter.removeListener('SetChapterSettings', handleChange);
                };
            },
            () => storedSettings,
            () => ChapterSettingsDefaults,
        ];
    }, []);

    const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return [settings, setChapterSettings] as const;
};

export const IsVipBenefitContext = createContext<boolean | undefined>(undefined);

export const useIsVipBenefit = () => useContext(IsVipBenefitContext);
