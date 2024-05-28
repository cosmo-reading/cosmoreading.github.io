import { HOME_COLLECTION_TITLE_FONT_STYLE } from '@app/domains/home/styles';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

function RelatedNovels({ children, ...props }: Props) {
    return (
        <article className="py-12 md:pb-0" {...props}>
            {children}
        </article>
    );
}

type TitleProps = {
    title?: string;
    classes?: {
        heading?: string;
        skeleton?: string;
    };
    isLoading?: boolean;
};
const Title = ({ isLoading }: TitleProps) => {
    return (
        <HeroTextPlaceholder item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
            <h1 className={twMerge('text-gray-t1', HOME_COLLECTION_TITLE_FONT_STYLE)}>Related Novels</h1>
        </HeroTextPlaceholder>
    );
};

RelatedNovels.Title = Title;

export default RelatedNovels;
