import Link from '@app/components/link';
import type { Theme as EmotionTheme } from '@emotion/react';
import { type Theme, createTheme } from '@mui/material/styles';
import type { Palette, PaletteOptions } from '@mui/material/styles/createPalette';

const defaultTheme = createTheme();

const createPalette = (palette: PaletteOptions): Palette => {
    return palette as Palette;
};

const lightPalette = createPalette({
    mode: 'light',
    primary: {
        main: '#FFFFFF',
    },
    secondary: {
        main: '#232323',
    },
    background: {
        paper: '#FFFFFF',
        default: '#FFFFFF',
    },
    text: {
        primary: '#000000',
        secondary: '#444444',
        disabled: '#888888',
    },
    common: {
        black: '#FFFFFF',
        white: '#000000',
    },
    divider: '#E8E8E8', //TODO: COZE: recommend using tw
});

const darkPalette = createPalette({
    mode: 'dark',
    primary: {
        main: '#202020',
    },
    secondary: {
        main: '#FFFFFF',
    },
    background: {
        default: '#313131',
        paper: '#131415',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#B6B6B6',
        disabled: '#888888',
    },
    common: {
        black: '#202020',
        white: '#FFFFFF',
    },
    divider: '#313131', //TODO: COZE: recommend using tw
});

function getMuiTheme({
    name,
    defaultTheme,
    palette,
}: {
    name: string;
    defaultTheme: Theme;
    palette: Palette;
}): EmotionTheme {
    return {
        name: name,
        ...createTheme({
            breakpoints: defaultTheme.breakpoints,
            palette,
            typography: {
                fontFamily: ['Inter', 'Open Sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
                fontWeightRegular: 400,
                fontWeightMedium: 600,
                fontWeightBold: 800,
                h1: {
                    fontSize: defaultTheme.typography.pxToRem(30),
                    lineHeight: defaultTheme.typography.pxToRem(36),
                    color: palette.text.primary,
                    fontWeight: 600,
                    marginBottom: defaultTheme.spacing(3),
                },
                h2: {
                    fontSize: defaultTheme.typography.pxToRem(24),
                    lineHeight: defaultTheme.typography.pxToRem(29),
                    color: palette.text.primary,
                    fontWeight: 600,
                },
                h3: {
                    fontSize: defaultTheme.typography.pxToRem(20),
                    lineHeight: defaultTheme.typography.pxToRem(24),
                    color: palette.text.primary,
                    fontWeight: 600,
                },
                h4: {
                    fontSize: defaultTheme.typography.pxToRem(18),
                    lineHeight: defaultTheme.typography.pxToRem(22),
                    color: palette.text.primary,
                    fontWeight: 600,
                },
                h5: {
                    fontSize: defaultTheme.typography.pxToRem(16),
                    lineHeight: defaultTheme.typography.pxToRem(19),
                    color: palette.text.primary,
                },
                h6: {
                    fontSize: defaultTheme.typography.pxToRem(14),
                    lineHeight: defaultTheme.typography.pxToRem(18),
                    color: palette.text.primary,
                },
                subtitle1: {
                    fontSize: defaultTheme.typography.pxToRem(18),
                    lineHeight: defaultTheme.typography.pxToRem(30),
                    color: palette.text.secondary,
                },
                subtitle2: {
                    fontSize: defaultTheme.typography.pxToRem(18),
                    lineHeight: defaultTheme.typography.pxToRem(30),
                    color: palette.text.secondary,
                },
                body1: {
                    fontSize: defaultTheme.typography.pxToRem(16),
                    lineHeight: defaultTheme.typography.pxToRem(25.6),
                    color: palette.text.secondary,
                },
                body2: {
                    fontSize: defaultTheme.typography.pxToRem(20),
                    lineHeight: defaultTheme.typography.pxToRem(30),
                    color: palette.text.secondary,
                },
                caption: {
                    fontSize: defaultTheme.typography.pxToRem(14),
                    lineHeight: defaultTheme.typography.pxToRem(18),
                    color: palette.text.disabled,
                },
                overline: {},
                button: {
                    textTransform: 'none',
                },
            },
            components: {
                MuiButtonBase: {
                    defaultProps: {
                        LinkComponent: Link,
                    },
                },
                MuiPagination: {
                    defaultProps: {
                        variant: 'outlined',
                        shape: 'rounded',
                        size: 'medium',
                    },
                },
                MuiPaginationItem: {
                    defaultProps: {
                        classes: {
                            root: 'leading-none',
                            selected: 'border border-blue !bg-transparent',
                        },
                    },
                    styleOverrides: {
                        root: {
                            fontSize: defaultTheme.typography.pxToRem(16),
                        },
                        sizeSmall: {
                            fontSize: defaultTheme.typography.pxToRem(12),
                        },
                        sizeLarge: {
                            fontSize: defaultTheme.typography.pxToRem(18),
                        },
                    },
                },
                MuiAvatar: {
                    defaultProps: {
                        classes: {
                            root: 'border border-black border-opacity-[0.08]',
                        },
                    },
                },
                MuiTableCell: {
                    defaultProps: {
                        classes: {
                            root: 'text-[14px]',
                            head: 'font-bold',
                        },
                    },
                    styleOverrides: {
                        root: {
                            '&:last-child': {
                                paddingRight: 0,
                            },
                            '&:first-of-type': {
                                paddingLeft: 0,
                            },
                        },
                    },
                },
                MuiDialog: {
                    defaultProps: {
                        classes: {
                            paper: 'bg-none dark:bg-black m-[20px] max-h-[calc(100%-40px)] w-[calc(100%-40px)] sm:m-[32px] sm:max-h-[calc(100%-64px)] sm:w-[calc(100%-64px)]',
                        },
                    },
                },
                MuiDialogActions: {
                    defaultProps: {
                        classes: {
                            root: 'jusitfy-center space-x-[8px]',
                        },
                    },
                    styleOverrides: {
                        root: {
                            padding: defaultTheme.spacing(2, 3),
                        },
                    },
                },
                MuiBottomNavigation: {
                    defaultProps: {
                        classes: {
                            root: 'h-auto',
                        },
                    },
                },
                MuiBottomNavigationAction: {
                    styleOverrides: {
                        root: {
                            //color: palette.common.black,
                            fontSize: defaultTheme.typography.pxToRem(12),
                            lineHeight: defaultTheme.typography.pxToRem(14),
                            '&.Mui-disabled': {
                                color: palette.text.disabled,
                            },
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            //backgroundColor: palette.mode === 'light' ? '#fff' : '#131415',
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiAccordion: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                            margin: defaultTheme.spacing(2, 0),
                            borderRadius: '6px',
                            '&:before': {
                                display: 'none',
                            },
                        },
                    },
                },
                MuiAccordionSummary: {
                    styleOverrides: {
                        root: {
                            '& > *': {
                                display: 'flex',
                                alignItems: 'center',
                            },
                            '&.Mui-expanded': {
                                borderBottom: '1px solid',
                                borderColor: palette.divider,
                            },
                        },
                    },
                },
                MuiChip: {
                    defaultProps: {
                        classes: {
                            root: 'ring-1 ring-transparent font-semibold bg-[#f6f6f6] dark:bg-gray-800 ring-[#dcdcdc] dark:ring-gray-600 hover:ring-blue dark:hover:ring-blue hover:bg-gray-100 dark:hover:bg-gray-700',
                        },
                    },
                    styleOverrides: {
                        colorPrimary: {
                            background: 'linear-gradient(131.45deg, #20A7FE 0%, #003AFF 100%)',
                        },
                    },
                },
                MuiSwitch: {
                    defaultProps: {
                        classes: {
                            root: 'p-0',
                            switchBase: 'h-full absolute p-px pl-[6%]',
                            track: 'rounded-[19.5px] !opacity-100 !bg-[#f0f0f0]',
                            thumb: 'bg-white',
                            checked: '!transform-gpu translate-x-full',
                        },
                    },
                    styleOverrides: {
                        root: {
                            '& .Mui-checked': {
                                '& + .MuiSwitch-track': {
                                    backgroundColor: '#127afe !important',
                                },
                            },
                        },
                        sizeSmall: {
                            width: defaultTheme.typography.pxToRem(40),
                            height: defaultTheme.typography.pxToRem(22),
                        },
                        sizeMedium: {
                            width: defaultTheme.typography.pxToRem(50),
                            height: defaultTheme.typography.pxToRem(26),
                        },
                    },
                },
                MuiInputLabel: {
                    styleOverrides: {
                        root: {
                            '&.Mui-focused': {
                                color: 'inherit',
                            },
                        },
                    },
                },
                MuiFormControl: {
                    defaultProps: {
                        fullWidth: true,
                    },
                },
                MuiInputBase: {
                    defaultProps: {
                        classes: {
                            root: 'focus:outline-none',
                        },
                    },
                    styleOverrides: {
                        root: {
                            // padding: `${defaultTheme.typography.pxToRem(10)} ${defaultTheme.typography.pxToRem(10)}`,
                            '&.MuiInputBase-sizeSmall': {
                                padding: defaultTheme.typography.pxToRem(5),
                            },
                        },
                    },
                },
                MuiOutlinedInput: {
                    defaultProps: {
                        classes: {
                            root: 'relative rounded-md hover:shadow-md transition-shadow dark:bg-[#202020]',
                            disabled: 'hover:shadow-none',
                            // input: 'p-0',
                        },
                    },
                    styleOverrides: {
                        root: {
                            '&:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                    borderColor: '#127afe !important',
                                },
                        },
                        notchedOutline: {
                            borderColor: palette.mode === 'light' ? '#eaeaea' : '#444',
                        },
                    },
                },
                MuiSelect: {
                    defaultProps: {
                        classes: {
                            select: 'p-[8px] relative hover:border-blue hover:shadow-sm border border-gray-500 rounded-md transition-shadow mr-[2px]',
                        },
                    },
                    styleOverrides: {
                        select: {
                            '&.Mui-focused': {
                                borderColor: '#127afe',
                            },
                        },
                    },
                },
                MuiBadge: {
                    defaultProps: {
                        max: 99999,
                    },
                },
                MuiButton: {
                    defaultProps: {
                        LinkComponent: Link,
                        variant: 'contained',
                        color: 'primary',
                        classes: {
                            root: 'border border-blue rounded-[28px] transition-shadow truncate shadow-none font-bold hover:border-blue hover:shadow',
                            sizeSmall: 'text-[12px]',
                            sizeMedium: 'text-[15px] sm:text-[16px]',
                            contained: 'm-0',
                            containedPrimary:
                                'text-white whitespace-nowrap bg-[linear-gradient(131.45deg,#20A7FE,#003AFF)]',
                            outlined: 'm-0',
                            outlinedPrimary: 'text-blue bg-white dark:bg-black',
                            text: 'hover:!shadow-none hover:!bg-transparent',
                            textPrimary:
                                'border-none text-blue font-semibold !pl-0 !pr-0 hover:shadow-none hover:bg-transparent hover:underline',
                            textSecondary:
                                'border-none !pl-0 !pr-0 hover:shadow-none hover:bg-transparent hover:underline',
                        },
                    },
                    styleOverrides: {
                        root: {
                            '&.Mui-disabled': {
                                color: palette.mode === 'dark' ? '#616161' : '#888888',
                                background: palette.mode === 'dark' ? '#313131' : '#D7D7D7',
                            },
                        },
                        sizeSmall: {
                            padding: `${defaultTheme.typography.pxToRem(1)} ${defaultTheme.typography.pxToRem(15)}`,
                            lineHeight: defaultTheme.typography.pxToRem(16),
                        },
                        sizeMedium: {
                            padding: `${defaultTheme.typography.pxToRem(5)} ${defaultTheme.typography.pxToRem(25)}`,
                        },
                        sizeLarge: {
                            fontSize: defaultTheme.typography.pxToRem(18),
                            lineHeight: defaultTheme.typography.pxToRem(22),
                            padding: `${defaultTheme.typography.pxToRem(15)} ${defaultTheme.typography.pxToRem(50)}`,
                        },
                    },
                },
                MuiToggleButton: {
                    defaultProps: {
                        classes: {
                            root: 'rounded-[4px] leading-none',
                            selected: '!bg-white dark:!bg-gray-700',
                        },
                    },
                },
                MuiStepIcon: {
                    defaultProps: {
                        classes: {
                            completed: 'text-gray-t0',
                            active: 'text-blue',
                        },
                    },
                },
                /*MuiFab: {                
                    styleOverrides: {
                        root: {
                            backgroundColor: '#ffffff',
                            border: `${defaultTheme.typography.pxToRem(1)} solid #0CA0FF`,
                        }
                    }
                },*/
                MuiFab: {
                    defaultProps: {
                        classes: {
                            root: 'text-white bg-black border border-blue hover:bg-[#323232]',
                        },
                    },
                    styleOverrides: {
                        root: {
                            '@media (hover: none)': {
                                ':hover': {
                                    backgroundColor: '#323232',
                                },
                            },
                        },
                    },
                },
                MuiLinearProgress: {
                    defaultProps: {
                        classes: {
                            barColorPrimary: 'bg-[#cccccc]',
                        },
                    },
                },
                MuiMenuItem: {
                    defaultProps: {
                        classes: {
                            selected: 'bg-[#F3F3F3] dark:bg-[#313131]',
                        },
                    },
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                backgroundColor: palette.mode === 'light' ? undefined : 'rgba(19, 20, 21, 0.5)',
                            },
                            '&.Mui-selected': {
                                '&:hover': {
                                    backgroundColor:
                                        palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.16)',
                                },
                            },
                        },
                    },
                },
                MuiListItemText: {
                    styleOverrides: {
                        root: {
                            '& > .MuiTypography-root': {
                                color: palette.mode === 'light' ? '#212121' : '#B6B6B6',
                            },
                        },
                    },
                },
            },
        }),
    };
}

export const MaterialLightTheme: EmotionTheme = getMuiTheme({
    name: 'light',
    defaultTheme: defaultTheme,
    palette: lightPalette,
});

export const MaterialDarkTheme: EmotionTheme = getMuiTheme({
    name: 'dark',
    defaultTheme: defaultTheme,
    palette: darkPalette,
});
