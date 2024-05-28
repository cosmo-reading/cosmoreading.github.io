import { ReactComponent as Logo } from '@app/assets/ww-character.svg';
import type { ClassNameType } from '@app/domains/common/types';
import { HeaderEvents } from '@app/domains/header/analytics/amplitude/events';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

function Brand({ children }: PropsWithChildren<{}>) {
    return (
        <Link
            className="inline-flex items-center space-x-6 text-gray-t0"
            to="/"
            aria-label="Wuxiaworld"
            data-amplitude-click-event={HeaderEvents.ClickWuxiaLogo}
        >
            {children}
        </Link>
    );
}

const LogoIcon = () => {
    return <Logo />;
};

const Name = ({ className }: ClassNameType) => {
    return <span className={twMerge(clsx('font-set-sb18 tracking-[1.29px] text-gray-t0', className))}>WUXIAWORLD</span>;
};

Brand.LogoIcon = LogoIcon;
Brand.Name = Name;

export default Brand;
