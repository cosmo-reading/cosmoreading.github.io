import HomeContent from '@app/domains/home/components/HomeContent';
import { HOME_CONTENT_REVIEW_SCORE_FONT_STYLE, HOME_CONTENT_TITLE_FONT_STYLE } from '@app/domains/home/styles';
import { NovelEvents } from '@app/domains/novel/analytics/amplitude/events';

export default function RelatedNovel({ novel, isLoading }) {
    return (
        <HomeContent content={novel} isLoading={isLoading} viewLogDisabled clickEvent={NovelEvents.ClickRelatedSeries}>
            <HomeContent.Image />
            <HomeContent.TextWrapper>
                <HomeContent.ReviewScore className={HOME_CONTENT_REVIEW_SCORE_FONT_STYLE} />
                <HomeContent.Title className={HOME_CONTENT_TITLE_FONT_STYLE} />
            </HomeContent.TextWrapper>
        </HomeContent>
    );
}
