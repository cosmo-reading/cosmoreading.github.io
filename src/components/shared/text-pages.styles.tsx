import { breakpoints } from '@app/utils/breakpoints';
import styled from '@emotion/styled';
import { Typography, type TypographyProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';

const StyledContentSectionTitleComponent = ({ className, ...rest }: TypographyProps) => {
    return <Typography variant="h4" {...rest} className={twMerge('my-[20px]', className)} />;
};

export const StyledContentSectionTitle = styled(StyledContentSectionTitleComponent)({
    fontSize: '18px',
    fontWeight: 600,
});

export const StyledContentSection = styled('div')<{ centeredExtraMargin?: boolean; showDivider?: boolean }>(
    ({ theme, centeredExtraMargin, showDivider = true }) => ({
        paddingBottom: '28px',
        margin: centeredExtraMargin ? 'auto' : undefined,
        [breakpoints.upLg]: {
            paddingRight: centeredExtraMargin ? '15%' : '92px',
            paddingLeft: centeredExtraMargin ? '15%' : '92px',
        },
        [breakpoints.downLg]: {
            marginRight: '-30px',
            marginLeft: '-30px',
            paddingRight: '30px',
            paddingLeft: '30px',
        },
        [breakpoints.downSm]: {
            marginRight: '-20px',
            marginLeft: '-20px',
            paddingRight: '20px',
            paddingLeft: '20px',
        },
        '&:not(:last-child)': {
            borderBottom: showDivider ? '1px solid' : '0px',
            borderColor: theme.palette.divider,
        },
        '&:first-of-type': {
            marginTop: '24px',
        },
        [StyledContentSectionTitle as any]: {
            textAlign: centeredExtraMargin ? 'center' : undefined,
        },
        '& .MuiAccordion-root': {
            marginBottom: '15px',
            borderRadius: '6px',
            '&:before': {
                height: '0',
            },
            '& .MuiList-root': {
                paddingBottom: '30px',
            },
        },
    })
);
