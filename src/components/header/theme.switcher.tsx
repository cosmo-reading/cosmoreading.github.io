import { logAnalyticsEvent } from '@app/analytics';
import { ReactComponent as MoonIcon } from '@app/assets/moon.svg';
import { ReactComponent as SunIcon } from '@app/assets/sun.svg';
import { StyledSwitch } from '@app/components/header/styles';
import { MaterialDarkTheme } from '@app/components/theme';
import useCookie from '@app/domains/common/hooks/useCookie';
import { Switch } from '@mui/material';
import { useCallback } from 'react';

export default function HeaderThemeSwitcher() {
    const { cookie: themeName, update: updateCookieThemeName } = useCookie('theme-name', MaterialDarkTheme.name);

    const onSwitchTheme = useCallback(() => {
        const newTheme = themeName === 'light' ? 'dark' : 'light';
        logAnalyticsEvent('Click Mode', { 'Background Mode': newTheme === 'light' ? 'Dark' : 'Light' });
        updateCookieThemeName(newTheme);
        return newTheme;
    }, [themeName, updateCookieThemeName]);

    return (
        <div className="cursor-pointer select-none [-webkit-tap-highlight-color:transparent]" onClick={onSwitchTheme}>
            <Switch
                css={StyledSwitch}
                checkedIcon={<MoonIcon height={30} width={30} />}
                icon={<SunIcon height={30} width={30} />}
                checked={themeName === 'dark'}
                inputProps={{ 'aria-label': 'theme switch' }}
            />
        </div>
    );
}
