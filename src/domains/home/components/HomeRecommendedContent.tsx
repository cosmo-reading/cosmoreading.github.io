import type { NovelItem } from '@app/_proto/Protos/novels';
import HomeContent from '@app/domains/home/components/HomeContent';
import { HOME_CONTENT_REVIEW_SCORE_FONT_STYLE, HOME_CONTENT_TITLE_FONT_STYLE } from '@app/domains/home/styles';

type Props = {
    content: NovelItem | undefined;
    isLoading?: boolean;
};
export default function HomeRecommendedContent({ content, isLoading }: Props) {
    return (
        <HomeContent content={content} isLoading={isLoading}>
            <HomeContent.Image
                classes={{ badge: { box: 'h-24 w-24 md:h-36 md:w-36', icon: 'h-16 w-16 md:h-24 md:w-24' } }}
            />
            <HomeContent.TextWrapper>
                <HomeContent.ReviewScore className={HOME_CONTENT_REVIEW_SCORE_FONT_STYLE} />
                <HomeContent.Title className={HOME_CONTENT_TITLE_FONT_STYLE} />
            </HomeContent.TextWrapper>
        </HomeContent>
    );
}
