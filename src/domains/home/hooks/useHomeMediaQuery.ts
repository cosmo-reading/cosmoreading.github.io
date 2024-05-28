import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import { breakpoints } from '@app/utils/breakpoints';

export default function useHomeMediaQuery() {
    const isMobile = useMediaQuery(breakpoints.downSm2);
    const isTablet = useMediaQuery(breakpoints.onlySm2);
    const isDesktop = useMediaQuery(breakpoints.onlyMd);
    const isLargeScreen = useMediaQuery(breakpoints.upLg, {
        defaultMatches: true,
    });
    const isUpMd = useMediaQuery(breakpoints.upMd);

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeScreen,
        isUpMd,
    };
}
