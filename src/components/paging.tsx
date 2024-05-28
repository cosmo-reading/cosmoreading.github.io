import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import { breakpoints } from '@app/utils/breakpoints';
import { Pagination, type PaginationProps } from '@mui/material';

//#region : Main component

/**
 * Custom helper component.
 *
 * Use this when you want to show paging.
 */
const Paging = (props: PaginationProps) => {
    const isMobile = useMediaQuery(breakpoints.downSm);

    return <Pagination size={isMobile ? 'small' : 'medium'} siblingCount={1} boundaryCount={1} {...props} />;
};

export default Paging;
//#endregion : Main component
