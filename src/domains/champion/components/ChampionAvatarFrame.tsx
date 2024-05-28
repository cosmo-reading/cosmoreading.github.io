import { ABSOLUTE_FULL } from '@app/domains/common/styles';
import React, { type PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = PropsWithChildren<{
    classes?: { badge?: string };
    frameWidth?: number;
}>;

export default function ChampionAvatarFrame({ classes, frameWidth = 3, children }: Props) {
    return (
        <div>
            <div
                className="relative"
                style={{
                    border: `${frameWidth}px transparent solid`,
                }}
            >
                <div
                    className="absolute z-[1] rounded-6 bg-gradient-ww-champion-profile-outer-layer sm2:rounded-8"
                    style={{
                        top: `-${frameWidth}px`,
                        left: `-${frameWidth}px`,
                        height: `calc(100% + ${frameWidth * 2}px + 2px)`,
                        width: `calc(100% + ${frameWidth * 2}px)`,
                    }}
                />
                <div
                    className="absolute z-[2] rounded-6 bg-gradient-ww-champion-profile-inner-layer ring-[0.5px] ring-inset ring-black/60 sm2:rounded-8"
                    style={{
                        top: `-${frameWidth}px`,
                        left: `-${frameWidth}px`,
                        height: `calc(100% + ${frameWidth * 2}px)`,
                        width: `calc(100% + ${frameWidth * 2}px)`,
                    }}
                />
                <div className="relative z-10 overflow-hidden rounded-4 sm2:rounded-5">
                    {children}
                    <div
                        className={twMerge(ABSOLUTE_FULL, 'rounded-4 ring-[0.5px] ring-inset ring-black sm2:rounded-5')}
                    />
                    <div
                        className="absolute z-[3] bg-gradient-ww-champion-profile-avatar-cover-layer"
                        style={{
                            top: `-${frameWidth}px`,
                            left: `-${frameWidth}px`,
                            height: `calc(100% + ${frameWidth * 2}px)`,
                            width: `calc(100% + ${frameWidth * 2}px)`,
                        }}
                    />
                </div>
                <div className="absolute bottom-0 z-50 w-full translate-y-1/2 text-center">
                    <img
                        src="/images/champion-badge-outlined@3x.png"
                        alt="champion-badge"
                        width={34}
                        height={16}
                        className={twMerge('inline-block h-16 w-34', classes?.badge)}
                    />
                </div>
            </div>
        </div>
    );
}
