import { ReactComponent as CheckIcon } from '@app/assets/check.svg';
import { ReactComponent as MinusIcon } from '@app/assets/minus.svg';
import { ReactComponent as PlusIcon } from '@app/assets/plus.svg';
import { ReactComponent as TextStyleIcon } from '@app/assets/text-style.svg';
import { useTheme } from '@app/components/hooks';
import type { ViewerContrast } from '@app/domains/chapter/types';
import Chips from '@app/domains/common/components/Chips';
import CancelButton from '@app/domains/common/components/button/CancelButton';
import { ZINDEX_USAGES } from '@app/domains/common/constants/zindex';
import { ClickAwayListener, Paper, Popper, Slide } from '@mui/material';
import clsx from 'clsx';

// Props type was omitted. It will be considered for the next refactoring.

export default function ChapterFontSelector({
    open,
    fontButtonRef,
    onClose,
    chapterSettings,
    onFontFamilyChange,
    disableFontSizeDecrease,
    disableFontSizeIncrease,
    disableLineHeightDecrease,
    disableLineHeightIncrease,
    onDecreaseFontSize,
    onIncreaseFontSize,
    onDecreaseLineHeight,
    onIncreaseLineHeight,
    onViewerContrastChange,
    onReset,
}) {
    const { name: themeName } = useTheme();
    return (
        <Popper
            open={open}
            anchorEl={fontButtonRef.current}
            role={undefined}
            transition
            placement="bottom"
            container={document.body}
            disablePortal={false}
            style={{ zIndex: ZINDEX_USAGES.FONT_SELECT_POPUP }}
        >
            {({ TransitionProps }) => (
                <Slide direction="up" {...TransitionProps}>
                    <Paper
                        elevation={5}
                        className="mb-8 w-280 rounded-12 bg-none p-20 text-gray-t3 shadow-ww-text-container dark:bg-gray-900 dark:shadow-ww-text-container-dark"
                    >
                        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseDown">
                            <div>
                                <span className="font-set-m15 ">Font</span>
                                <div className="grid grid-cols-2 gap-12 py-12">
                                    {FONTS.map(font => (
                                        <Chips.Chip
                                            key={font.key}
                                            label={font.label}
                                            className="font-set-sb13 w-full"
                                            selected={chapterSettings.fontFamily === font.key}
                                            onClick={() => onFontFamilyChange(font.key)}
                                        />
                                    ))}
                                </div>
                                <SizeController
                                    title="Text size"
                                    value={chapterSettings?.fontSizeStep}
                                    disableIncrease={disableFontSizeIncrease}
                                    disableDecrease={disableFontSizeDecrease}
                                    onIncrease={onIncreaseFontSize}
                                    onDecrease={onDecreaseFontSize}
                                />
                                <SizeController
                                    title="Line height"
                                    value={chapterSettings?.lineHeightStep}
                                    disableIncrease={disableLineHeightIncrease}
                                    disableDecrease={disableLineHeightDecrease}
                                    onIncrease={onIncreaseLineHeight}
                                    onDecrease={onDecreaseLineHeight}
                                />
                                <div className="py-12">
                                    <div>
                                        <span className="font-set-m15">Contrast</span>
                                    </div>
                                    <div className="flex pt-12">
                                        {CONTRASTS.filter(contrast => contrast.theme === themeName).map(contrast => (
                                            <ContrastOption
                                                key={contrast.backgroundColor}
                                                contrast={contrast}
                                                selected={
                                                    chapterSettings?.viewerContrast[themeName]?.backgroundColor ===
                                                    contrast.backgroundColor
                                                }
                                                onChange={onViewerContrastChange}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <CancelButton className="mt-16 h-52 w-full" onClick={onReset}>
                                    <span className="font-set-b16">RESET</span>
                                </CancelButton>
                            </div>
                        </ClickAwayListener>
                    </Paper>
                </Slide>
            )}
        </Popper>
    );
}

type SizeControllerProps = {
    title: string;
    value: number;
    disableIncrease?: boolean;
    disableDecrease?: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
};
const SizeController = ({
    title,
    value,
    disableIncrease,
    disableDecrease,
    onIncrease,
    onDecrease,
}: SizeControllerProps) => {
    return (
        <div className="flex items-center py-12">
            <span className="font-set-m15">{title}</span>
            <div className="ml-auto flex items-center">
                <button
                    className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-container-base"
                    onClick={onDecrease}
                    disabled={disableDecrease}
                >
                    <MinusIcon className="h-16 w-16" />
                </button>
                <span className="font-set-m16 mx-16 w-28 text-center text-gray-t1">{value}</span>
                <button
                    className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-container-base"
                    onClick={onIncrease}
                    disabled={disableIncrease}
                >
                    <PlusIcon className="h-16 w-16" />
                </button>
            </div>
        </div>
    );
};

type ContrastOptionProps = {
    contrast: ViewerContrast;
    onChange: (color: ViewerContrast) => void;
    selected?: boolean;
};
const ContrastOption = ({ contrast, onChange, selected }: ContrastOptionProps) => {
    return (
        <button
            className={clsx(
                'mr-12 flex h-36 w-full items-center justify-center rounded-full border last:mr-0',
                selected ? 'border-blue-600' : 'border-black/20 dark:border-white/20'
            )}
            style={{ color: contrast.color, backgroundColor: contrast.backgroundColor }}
            onClick={() => onChange(contrast)}
        >
            {selected ? <CheckIcon className="text-blue-600" /> : <TextStyleIcon />}
        </button>
    );
};

const FONTS = [
    { key: 'Open Sans', label: 'Opensans' },
    { key: 'Source Serif Pro', label: 'Source serif' },
    { key: 'Inter', label: 'Inter' },
    { key: 'Merriweather', label: 'Merriweather' },
    { key: 'Lato', label: 'Lato' },
    { key: 'Montserrat', label: 'Montserrat' },
];

export const CONTRASTS = [
    {
        theme: 'light',
        backgroundColor: '#FFFFFF',
        color: '#424242',
    },
    {
        theme: 'light',
        backgroundColor: '#F5F5F5',
        color: '#424242',
    },
    {
        theme: 'dark',
        backgroundColor: '#212121',
        color: '#E0E0E0',
    },
    {
        theme: 'dark',
        backgroundColor: '#333333',
        color: '#E0E0E0',
    },
];
