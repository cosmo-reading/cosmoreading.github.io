import type { ReviewCommentItem } from '@app/_proto/Protos/review_comments';
import NovelReviewCommentCard from '@app/domains/novel/components/NovelReviewCommentCard';
import { getOneofValue } from '@app/libs/grpc';
import { timestampToUnix } from '@app/libs/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as React from 'react';
import { useMemo } from 'react';

dayjs.extend(relativeTime);

//#region : Main component

/** Custom. Main component parameters type */
type Props = {
    comment: ReviewCommentItem;
};

/** Custom. Handles display of the review comment. */
function ReviewCommentComponent({ comment }: Props) {
    //#region : Variables, functions and api calls

    const commentDateFromNow = useMemo(() => {
        return dayjs.unix(timestampToUnix(comment.commentedAt)!).fromNow();
    }, [comment.commentedAt]);

    /** Custom. Comment content. Converted new line to html equivalent. */
    const commentLines = useMemo(() => {
        const lines = comment.content.split('\n');

        let html = '';

        for (const line of lines) {
            if (line === '') {
                const br = document.createElement('br');
                html += br.outerHTML;
                continue;
            }

            const para = document.createElement('p');
            para.textContent = line;

            html += para.outerHTML;
        }

        return html;
    }, [comment.content]);

    //#endregion : Variables, functions and api calls

    const isChampionCommenter = getOneofValue(comment.commenterEntityInfo?.entityInfo, 'seriesInfo')?.isChampion;

    return (
        <NovelReviewCommentCard
            isChampionCommenter={isChampionCommenter}
            comment={comment}
            commentDateFromNow={commentDateFromNow}
            withBox={false}
            commentHtmlContent={commentLines}
        />
    );
}

export default React.memo(ReviewCommentComponent);

//#endregion : Main component
