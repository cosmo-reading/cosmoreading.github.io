import { Tooltip as MuiTooltip, type TooltipProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';

type Props = {
    flipEnabled?: boolean;
} & TooltipProps;

export default function Tooltip({ classes, children, flipEnabled = true, ...props }: Props) {
    return (
        <MuiTooltip
            arrow
            enterTouchDelay={0}
            classes={{
                ...classes,
                arrow: twMerge('text-black/[.85] text-[14px]', classes?.arrow),
                tooltip: twMerge(
                    'font-set-m14 bg-black/[.85] rounded-[12px] py-[13px] px-[16px] text-white !mt-[8px] max-w-[300px]',
                    classes?.tooltip
                ),
                popper: 'z-[2]',
            }}
            leaveDelay={0}
            PopperProps={{
                modifiers: [
                    {
                        name: 'flip',
                        enabled: flipEnabled,
                    },
                ],
            }}
            {...props}
        >
            {children}
        </MuiTooltip>
    );
}
