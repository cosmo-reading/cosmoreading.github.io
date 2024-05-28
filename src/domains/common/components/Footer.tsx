import { ReactComponent as Discord } from '@app/assets/sns-discord.svg';
import { ReactComponent as Facebook } from '@app/assets/sns-facebook.svg';
import { ReactComponent as Spotify } from '@app/assets/sns-spotify.svg';
import { ReactComponent as Twitter } from '@app/assets/sns-twitter.svg';
import Brand from '@app/domains/common/components/Brand';
import type { ClassNameType } from '@app/domains/common/types';
import { type HTMLProps, type PropsWithChildren, memo } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

function Footer() {
    return (
        <footer className="bg-gray-50 pt-20 pb-16 dark:bg-black lg:pt-48 lg:pb-24">
            <div className="mx-auto max-w-[1280px] px-24 sm2:px-40">
                <div className="flex flex-col border-b border-gray-line-base pb-26 lg:flex-row lg:pb-56">
                    <div className="mb-30 lg:mr-72 lg:mb-0">
                        <div className="mb-16">
                            <Brand>
                                <Brand.LogoIcon />
                                <Brand.Name />
                            </Brand>
                        </div>
                        <div className="flex space-x-8">
                            <StoreImageLink
                                className="w-120"
                                href="https://apps.apple.com/us/app/wuxiaworld/id1503356244?mt=8"
                                imgSrc="/images/apple-store-badge@3x.png"
                                imgAlt="apple-store-badge"
                            />
                            <StoreImageLink
                                className="w-135"
                                href="https://play.google.com/store/apps/details?id=com.wuxiaworld.mobile&hl=en_US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                                imgSrc="/images/google-play-badge@3x.png"
                                imgAlt="google-play-badge"
                            />
                        </div>
                    </div>
                    <div className="font-set-sb13 mb-26 text-gray-750 lg:font-set-sb16 dark:text-gray-300 lg:mb-0">
                        <div className="mb-16 flex flex-col space-y-16 lg:mb-16 lg:flex-row lg:space-y-0 lg:space-x-64">
                            <Link className="w-140" to="/about">
                                About Us
                            </Link>
                            <Link className="w-140" to="/news">
                                Announcements
                            </Link>
                        </div>
                        <div className="flex flex-col space-y-16 lg:flex-row lg:space-y-0 lg:space-x-64">
                            <Link className="w-140" to="/contact-us">
                                Contact Us
                            </Link>
                            {/* 
                                // TODO: Kevin: will display the General FAQ list when it is updated.
                                <Link className="w-140" to="/general-faq">
                                    General FAQ
                                </Link> 
                            */}
                            <a
                                className="w-140"
                                href="https://www.careers-page.com/wuxiaworld"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                Jobs
                            </a>
                        </div>
                    </div>
                    <div className="flex text-gray-750 dark:text-gray-300 lg:ml-auto">
                        <SnsLink
                            className="mr-27"
                            href="https://www.facebook.com/WuxiaworldWebnovels/"
                            aria-label="Facebook"
                        >
                            <Facebook aria-hidden />
                        </SnsLink>
                        <SnsLink className="mr-20" href="https://twitter.com/Wuxiaworld_Ltd" aria-label="Twitter">
                            <Twitter aria-hidden />
                        </SnsLink>
                        <SnsLink className="mr-20" href="https://discord.gg/wuxiaworld" aria-label="Discord">
                            <Discord aria-hidden />
                        </SnsLink>
                        <SnsLink
                            className="mt-[-2px]"
                            href="https://podcasters.spotify.com/pod/show/wuxiaworlds-teahouse"
                            aria-label="Spotify"
                        >
                            <Spotify aria-hidden />
                        </SnsLink>
                    </div>
                </div>
                <div className="font-set-r13 flex flex-col items-start justify-center pt-20 text-gray-600 dark:text-gray-400 lg:flex-row lg:items-center lg:pt-24">
                    <div className="mb-8 lg:mb-0">
                        <CopyRight />
                    </div>
                    <div className="-mt-8 -ml-8 flex flex-wrap lg:ml-auto">
                        <TermsAndPolicy />
                    </div>
                </div>
            </div>
        </footer>
    );
}

type StoreImageLinkProps = {
    href: string;
    imgSrc: string;
    imgAlt: string;
} & ClassNameType;
const StoreImageLink = ({ className, href, imgSrc, imgAlt }: StoreImageLinkProps) => {
    return (
        <a className={twMerge('h-40', className)} href={href} target="_blank" rel="noreferrer noopener">
            <img className="object-cover" src={imgSrc} alt={imgAlt} loading="lazy" />
        </a>
    );
};

type SnsLinkProps = PropsWithChildren<ClassNameType & HTMLProps<HTMLAnchorElement>>;
const SnsLink = ({ className, children, ...props }: SnsLinkProps) => {
    return (
        <a className={className} target="_blank" rel="noreferrer noopener" {...props}>
            {children}
        </a>
    );
};

const CopyRight = () => (
    <div>
        <span>Copyright © </span>
        <Link to="/">Wuxiaworld</Link>
        <span> {new Date().getFullYear()}</span>
    </div>
);

const TermsAndPolicy = () => (
    <>
        <Link className="mt-8 ml-8" to="/terms-of-service">
            Terms of Service
        </Link>
        <span className="mt-8 ml-8">&middot;</span>
        <Link className="mt-8 ml-8" to="/privacy-policy">
            Privacy Policy
        </Link>
        <span className="mt-8 ml-8">&middot;</span>
        <Link className="mt-8 ml-8" to="/cookie-policy">
            Cookie Policy
        </Link>
    </>
);

export default memo(Footer);
