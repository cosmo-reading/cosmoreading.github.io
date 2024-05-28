import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import type { ReactNode } from 'react';

type Props = {
    author?: string;
    translator?: string;
    isLoading?: boolean;
};

export default function NovelCoverInfo({ author, translator, isLoading }: Props) {
    return (
        <HeroTextPlaceholder item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
            <InfoWrapper>
                <InfoTitle title="Author" />
                <InfoDetail detail={author || 'Unknown'} />
            </InfoWrapper>
            <InfoWrapper>
                <InfoTitle title="Translator" />
                <InfoDetail detail={translator || 'Unknown'} />
            </InfoWrapper>
        </HeroTextPlaceholder>
    );
}

type InfoWrapperProps = {
    children?: ReactNode;
};
const InfoWrapper = ({ children }: InfoWrapperProps) => {
    return <div className="mb-[2px] flex flex-row items-center space-x-4 text-gray-t3">{children}</div>;
};

type InfoTitleProps = {
    title: string;
};
const InfoTitle = ({ title }: InfoTitleProps) => <div className="font-set-m13 sm2:font-set-m15">{`${title}:`}</div>;

type InfoDetailProps = {
    detail: string;
};
const InfoDetail = ({ detail }: InfoDetailProps) => (
    <div className="font-set-sb15 break-word line-clamp-1 sm2:font-set-sb15">{detail}</div>
);
