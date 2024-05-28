import Chip from '@app/domains/common/components/Chip';
import { ChipsContext } from '@app/domains/common/hooks/useChips';
import type { PropsWithChildren } from 'react';

function Chips({
    children,
    gap = 8,
}: PropsWithChildren<{
    gap?: number;
}>) {
    return (
        <ChipsContext.Provider value={{ gap }}>
            <div className="flex flex-wrap justify-start" style={{ marginTop: -gap, marginLeft: -gap }}>
                {children}
            </div>
        </ChipsContext.Provider>
    );
}

Chips.Chip = Chip;

export default Chips;
