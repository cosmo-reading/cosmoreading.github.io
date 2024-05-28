import { breakpoints } from '@app/utils/breakpoints';
import { useMediaQuery } from '@mui/material';

export default function useMediaQueries() {
    const isDownSm = useMediaQuery(breakpoints.downSm, {
        noSsr: true,
    });

    const isDownMd = useMediaQuery(breakpoints.downMd, {
        noSsr: true,
    });

    return {
        isDownSm,
        isDownMd,
    };
}
