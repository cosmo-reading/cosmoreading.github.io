import useInViewForAmplitude from '@app/domains/common/hooks/useInViewForAmplitude';
import { HomeEvents } from '@app/domains/home/analytics/amplitude/events';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    children?: ReactNode;
    isLoading?: boolean;
} & HTMLAttributes<HTMLElement>;

function HomeCollection({ children, isLoading, ...props }: Props) {
    const { ref } = useInViewForAmplitude({
        event: HomeEvents.ViewCollection,
        triggerOnce: true,
        skip: isLoading,
    });
    return (
        <article ref={ref} className="py-12 md:pb-0" {...props}>
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
const Title = ({ title, classes, isLoading }: TitleProps) => {
    return (
        <HeroTextPlaceholder className={classes?.skeleton} item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
            <h1 className={twMerge('text-gray-t1', classes?.heading)}>{title}</h1>
        </HeroTextPlaceholder>
    );
};

type SubTitleProps = TitleProps;
const SubTitle = ({ title, classes, isLoading }: SubTitleProps) => {
    return (
        <HeroTextPlaceholder className={classes?.skeleton} item={!isLoading} skeletonProps={BASE_SKELETON_PROPS}>
            <h2 className={twMerge('text-gray-desc', classes?.heading)}>{title}</h2>
        </HeroTextPlaceholder>
    );
};

HomeCollection.Title = Title;
HomeCollection.SubTitle = SubTitle;

export default HomeCollection;
