import HeaderAnonymous from '@app/components/header/anonymous';
import HeaderNotifications from '@app/components/header/notifications';
import HeaderUser from '@app/components/header/user';
import HeaderVip from '@app/domains/header/containers/HeaderVip';
import { useAuth } from '@app/libs/auth';
import { breakpoints } from '@app/utils/breakpoints';
import { useMediaQuery } from '@mui/material';

//#region : Main component

/** Custom. Shows menu options available for authenticated user. */
export default function HeaderAuthenticated() {
    //#region : Variables, functions and api calls
    const { user } = useAuth();

    const showHeaderNotificationIcon = useMediaQuery(breakpoints.upMd, {
        noSsr: true,
    });

    //#endregion : Variables, functions and api calls

    if (!user) {
        return <HeaderAnonymous />;
    }

    return (
        <>
            <HeaderVip />
            {showHeaderNotificationIcon && <HeaderNotifications />}
            <HeaderUser showHeaderNotificationCounter={!showHeaderNotificationIcon} />
        </>
    );
}

//#endregion : Main component
