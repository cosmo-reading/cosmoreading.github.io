import { Badge, type BadgeProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';
export default function HeaderNotificationCountBadge({ classes, children, ...props }: BadgeProps) {
    return (
        <Badge
            classes={{
                root: classes?.root,
                badge: twMerge(
                    'bg-blue text-white font-set-b10 top-0 sm:-top-2 left-[calc(50% - 16px/2 + 15.5px)] h-16 px-5 py-2 min-w-0',
                    classes?.badge
                ),
            }}
            {...props}
        >
            {children}
        </Badge>
    );
}
