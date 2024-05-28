import { GetReviewCommentsRequest, type GetReviewCommentsResponse } from '@app/_proto/Protos/review_comments';
import { ReviewCommentsClient } from '@app/_proto/Protos/review_comments.client';
import type { ReviewItem } from '@app/_proto/Protos/reviews';
import { type UseGrpcApiWithQueryResult, useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';

type UseReviewCommentsParam = {
    review: ReviewItem;
    page: number;
    pageCount: number;
    enabled?: boolean;
};

export default function useReviewComments({
    review,
    page,
    pageCount,
    enabled,
}: UseReviewCommentsParam): UseGrpcApiWithQueryResult<GetReviewCommentsResponse> {
    const commentsRequest = useGrpcRequest(GetReviewCommentsRequest, {
        id: review.id,
        type: review.type,
        pageInfo: {
            page,
            count: pageCount,
        },
    });

    const result = useGrpcApiWithQuery(
        ReviewCommentsClient,
        c => c.getReviewComments,
        commentsRequest,
        ['review-comments', review.id, page],
        {
            keepPreviousData: true,
            enabled,
        }
    );
    return result;
}
