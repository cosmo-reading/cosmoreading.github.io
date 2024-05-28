import { breakpoints } from '@app/utils/breakpoints';
import { type Theme, css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { IconButton, type IconButtonProps } from '@mui/material';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export const StyledAutoComplete = (theme: Theme) =>
    css({
        '& .MuiAutocomplete-inputRoot': {
            '.MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
            },
        },
        '& .MuiInputBase-root': {
            border: 'none',
            color: 'inherit',
            '&:hover': {
                borderColor: 'inherit',
                boxShadow: 'inherit',
            },
            '&.Mui-focused': {
                borderColor: 'inherit',
            },
        },
        '& .MuiInputBase-input': {
            padding: 0,
            marginLeft: '1em',
            transition: theme.transitions.create('max-width'),
            width: '80%',
            [breakpoints.upSm]: {
                marginLeft: `0.6em`,
                maxWidth: '122px',
                '&:focus': {
                    maxWidth: '180px',
                },
            },
        },
    });

export const StyledNotificationsMenu = css({
    '& > .MuiPaper-root': {
        maxHeight: '500px',
        minWidth: 0,
    },
    '& .MuiList-root': {
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: '400px',
    },
    '& .MuiMenuItem-root': {
        outline: 'none',
    },
});

export const bounce = keyframes({
    '0%': {
        transform: 'translateY(5px)',
    },
    '50%': {
        transform: 'translateY(0)',
    },
    '100%': {
        transform: 'translateY(0)',
    },
});

export const StyledHeaderMenuWithArrow = (theme: Theme) =>
    css(StyledHeaderMenu(theme), {
        '& .MuiPaper-root:before, & .MuiPaper-root:after': {
            content: '""',
            position: 'absolute',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderBottomColor: 'rgba(0, 0, 0, 0.03)',
            borderTop: 0,
        },
        '& .MuiPaper-root:before': {
            top: '0px',
            left: 'calc(50% - 14px)',
            borderWidth: '14px',
        },
        '& .MuiPaper-root:after': {
            top: '3px',
            left: 'calc(50% - 13px)',
            borderBottomColor: theme.palette.background.default,
            borderWidth: '13px',
        },
    });

export const StyledHeaderMenu = (theme: Theme) =>
    css({
        '& > .MuiPaper-root': {
            backgroundColor: 'transparent !important',
            backgroundImage: 'none',
        },
        '& :focus-visible': {
            outline: 'none',
        },
        '& .MuiList-root': {
            margin: '14px 12px 12px 12px',
            padding: '10px 0px',
            backgroundColor: theme.palette.background.default,
            boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.16)',
            borderRadius: '4px',
        },
        '& .MuiMenuItem-root': {
            padding: '10px 15px',
            fontSize: '15px',
            '& *': {
                lineHeight: '15px',
            },
        },
        '& .MuiMenuItem-root .MuiTypography-root': {
            fontSize: '15px',
            lineHeight: '15px',
        },
        '& .MuiButton-root': {
            fontSize: '12px',
            fontWeight: 600,
        },
    });

export const StyledSwitch = (theme: Theme) =>
    css({
        '&.MuiSwitch-root': {
            padding: 0,
            width: '74px',
            height: '38px',
            marginRight: 0,
            willChange: 'transform',
        },
        '& .MuiSwitch-switchBase': {
            position: 'absolute',
            color: theme.palette.mode === 'light' ? '#000' : 'currentColor',
            padding: '0.25rem',
            height: 'calc(100% - 1px)',
            transform: 'translateZ(0)',
            // color: theme.palette.mode === 'light' ? '#000' : undefined,
            '& svg': {
                padding: '0.25rem',
                borderRadius: '100%',
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.main,
            },
        },
        '& .MuiSwitch-track': {
            borderRadius: 19.5,
            opacity: 1,
            backgroundColor: '#f0f0f0',
        },
        '& .Mui-checked': {
            color: theme.palette.common.white,
            transform: 'translateZ(0) translateX(100%) translateX(-2px) !important',
            '& + .MuiSwitch-track': {
                backgroundColor: '#6f6f6f !important',
            },
        },
    });

const StyledIconButtonEx = styled(IconButton)(() => ({
    transition: 'none',
}));

export const StyledIconButton = React.forwardRef(
    ({ className, ...rest }: IconButtonProps & { padding?: boolean }, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <StyledIconButtonEx
                ref={ref}
                className={twMerge(
                    'bg-transparent p-8 hover:bg-transparent md:bg-gray-container-base md:hover:bg-gray-100 md:dark:hover:bg-black md:with-hover:hover:bg-gray-200 md:with-hover:dark:bg-gray-800',
                    className
                )}
                {...rest}
            />
        );
    }
);

export const StyledSearchCircularProgress = css({
    position: 'absolute',
    top: 'calc(50% - 10px)',
    right: '36px',
    width: '30px',
});

export const StyledArrow = (theme: Theme) =>
    css({
        position: 'relative',
        marginLeft: '42px',
        marginBottom: '1em',
        paddingTop: '1em',
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTop: 0,
        },
        '&:before': {
            bottom: '-17px',
            left: '21px',
            borderBottomColor: '#127afe',
            borderWidth: '16px',
        },
        '&:after': {
            bottom: '-18px',
            left: '22px',
            borderBottomColor: theme.palette.background.paper,
            borderWidth: '15px',
        },
    });

export const StyledNovelsMenuBox = (theme: Theme) =>
    css({
        backgroundColor: theme.palette.mode === 'light' ? '#F3F3F3' : '#313131',
        borderTopRightRadius: '15px',
        borderBottomRightRadius: '15px',
    });

export const StyledMenuItem = css({
    display: 'flex',
    justifyContent: 'center',
});

export const StyledMenuText = css({
    marginTop: '24px',
    marginBottom: '24px',
    animation: `${bounce} 1s ease 1`,
    transformOrigin: 'bottom',
});

export const StyledListItem = (theme: Theme) =>
    css({
        '&:hover': {
            backgroundColor: theme.palette.background.paper,
        },
        '& .MuiListItemText-root .MuiTypography-root': {
            animation: `${bounce} 2s ease 1`,
            transformOrigin: 'bottom',
        },
    });
