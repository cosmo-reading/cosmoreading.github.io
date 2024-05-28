import { AppContext } from '@app/App';
import useCookie from '@app/domains/common/hooks/useCookie';
import { type Theme, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import {
    type ClassNameMap,
    type Components,
    type ComponentsPropsList,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import { createContext, useContext, useDeferredValue, useMemo } from 'react';

import { MaterialDarkTheme, MaterialLightTheme } from './theme';

const ThemeContext = createContext<Theme | null>(null);
const ThemeCookie = 'theme-name';

export const getThemeByName = (name: string | null | undefined) => {
    let theme: Theme;

    switch (name) {
        case 'light':
            theme = MaterialLightTheme;
            break;
        case 'dark':
            theme = MaterialDarkTheme;
            break;
        default:
            theme = MaterialDarkTheme;
            break;
    }

    return theme;
};

export const useTheme = () => {
    return useContext(ThemeContext)! || MaterialDarkTheme;
};

type ComponentClasses<K extends keyof Components> = ComponentsPropsList[K] extends {
    classes?: infer U;
}
    ? keyof U
    : never;

type ComponentClassesResult<K extends (keyof Components)[]> = {
    [T in K[number]]: ClassNameMap<ComponentClasses<T>>;
};

export const useComponentClasses = <K extends (keyof Components)[]>(...Components: K): ComponentClassesResult<K> => {
    const theme = useTheme();

    const classes = useMemo(
        () =>
            Components.reduce(
                (prev, current) => {
                    const props = theme?.components?.[current]?.defaultProps;

                    if (props && 'classes' in props) {
                        prev[current] = props?.classes;
                    } else {
                        prev[current] = {};
                    }

                    return prev;
                },
                {} as ComponentClassesResult<K>
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [Components, theme?.palette.mode]
    );

    return classes;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const appContext = useContext(AppContext);
    const { cookie } = useCookie(ThemeCookie, appContext?.themeName || MaterialDarkTheme.name);

    const theme = useDeferredValue(getThemeByName(cookie || appContext?.themeName));

    return (
        <ThemeContext.Provider value={theme}>
            <MuiThemeProvider theme={theme}>
                <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}
