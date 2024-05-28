import { SAFE_X_SCREEN_CENTER_LAYOUT } from '@app/domains/common/styles';
import { findChildByTypeNames } from '@app/domains/common/utils/component';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

import type { ClassNameType } from '../types';

function ScreenBackground({ className, children }: PropsWithChildren<ClassNameType>) {
    const [bgChild, ...remainChildren] = findChildByTypeNames(children, ['ScreenBackgroundBg']);

    return (
        <div className="relative">
            <div className={clsx('z-[1] h-full', SAFE_X_SCREEN_CENTER_LAYOUT, className)}>{bgChild}</div>
            <div className="relative z-[2]">{remainChildren}</div>
        </div>
    );
}

const BgLayer = ({ className, children }: PropsWithChildren<ClassNameType>) => {
    return <div className={className}>{children}</div>;
};

BgLayer.typeName = 'ScreenBackgroundBg';
ScreenBackground.BgLayer = BgLayer;

export default ScreenBackground;
