import { type AllEvents, amplitudeHandler } from '@app/analytics/handlers';
import type { ComponentType, ReactNode } from 'react';

export default function withAmplitudeReport(Component: ComponentType & { children?: ReactNode }) {
    const Observer = (args: any) => {
        const { children, ...rest } = args;
        return (
            <div
                onClick={e => {
                    const amplitudeTarget: HTMLElement | null = (e.target as HTMLElement).closest(
                        '[data-amplitude-click-event]'
                    );
                    if (!amplitudeTarget) return;
                    const amplitudeEvent = amplitudeTarget?.getAttribute('data-amplitude-click-event') as AllEvents;
                    amplitudeHandler(amplitudeEvent, amplitudeTarget);
                }}
            >
                <Component {...rest}>{children}</Component>
            </div>
        );
    };
    return Observer;
}
