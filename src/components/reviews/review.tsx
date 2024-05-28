import { NovelItem } from '@app/_proto/Protos/novels';
import { ProductItem } from '@app/_proto/Protos/products';
import { type ReviewItem, ReviewItem_VoteType, ReviewType, SubmitReviewVoteRequest } from '@app/_proto/Protos/reviews';
import { ReviewsClient } from '@app/_proto/Protos/reviews.client';
import { analyticsFactory } from '@app/analytics/handlers';
import ReviewCard from '@app/domains/entity/components/ReviewCard';
import { NovelEvents } from '@app/domains/novel/analytics/amplitude/events';
import { useAuth } from '@app/libs/auth';
import { GrpcError, getOneofValue } from '@app/libs/grpc';
import { useHttp } from '@app/libs/http';
import { timestampToUnix } from '@app/libs/utils';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import render from 'dom-serializer';
import { type ChildNode, Element, Text } from 'domhandler';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

dayjs.extend(localizedFormat);

//#region : Main component

/** Custom. Main component parameters type */
type ReviewProps = {
    review: ReviewItem;
    onVote?: () => void;
    entity?: NovelItem | ProductItem;
    disableReply?: boolean;
    withBox?: boolean;
};

/**
 * Custom.
 *
 * Displays individual review item and handles it's actions.
 */
export default function ReviewComponent({ review: reviewProp, onVote, entity, disableReply, withBox }: ReviewProps) {
    //#region : Variables, functions and api calls

    //General
    const [review, setReview] = useImmer(reviewProp);

    const upVotes = review.votes?.upVotes;
    const downVotes = review.votes?.downVotes;

    //#region : Server request to save vote
    const { user, login } = useAuth();
    const { grpcRequest } = useHttp();

    //Update review state when review changes.
    useEffect(() => {
        setReview(reviewProp);
    }, [reviewProp, setReview]);

    const thisReviewType = useMemo(() => {
        if (NovelItem.is(entity)) {
            return ReviewType.NovelReviewType;
        }
        if (ProductItem.is(entity)) {
            return ReviewType.ProductReviewType;
        }
        return ReviewType.NoneReviewType;
    }, [entity]);

    /** Custom. Makes server request to save vote. */
    const voteReviewAsync = useCallback(
        async (type: 'upvote' | 'downvote') => {
            const request = SubmitReviewVoteRequest.create({
                id: review.id,
                type: thisReviewType,
                voteType: type === 'upvote' ? ReviewItem_VoteType.ThumbsUp : ReviewItem_VoteType.ThumbsDown,
            });

            try {
                const response = await grpcRequest(ReviewsClient, c => c.submitReviewVote, request);
                if (response.result) {
                    onVote?.();
                }
            } catch (e) {
                console.error(e);

                if (e instanceof GrpcError) {
                    console.error(e.response?.description);
                }
            }
        },
        [thisReviewType, grpcRequest, onVote, review.id]
    );
    //#endregion : Server request to save vote

    //#region : Vote Action handlers

    /** Custom. Handles vote up. */
    const onClickUpVote = useCallback(async () => {
        if (!user) {
            login();

            return;
        }

        if (user.id === review.reviewUser?.id) {
            return;
        }

        analyticsFactory(NovelEvents.ClickSeriesReviewLikeDislike)({
            entity,
            review,
            voteState: 'up',
        });

        await voteReviewAsync('upvote');
    }, [entity, login, review, user, voteReviewAsync]);

    /** Custom. Handles vote down. */
    const onClickDownVote = useCallback(async () => {
        if (!user) {
            login();

            return;
        }

        if (user.id === review.reviewUser?.id) {
            return;
        }

        analyticsFactory(NovelEvents.ClickSeriesReviewLikeDislike)({
            entity,
            review,
            voteState: 'down',
        });

        await voteReviewAsync('downvote');
    }, [entity, login, review, user, voteReviewAsync]);

    //#endregion : Action handlers

    //#region : Helpers

    /** Custom. Review content. Converted new line to html equivalent. */
    const reviewContent = useMemo(() => {
        const lines = (review.content?.value || '').split('\n');

        const childNodes: ChildNode[] = [];

        for (const line of lines) {
            if (line.length === 0) {
                continue;
            }

            childNodes.push(new Element('p', {}, [new Text(line)]));
        }

        return render(childNodes);
    }, [review.content?.value]);

    /** Custom. Formatted review date. */
    const reviewDate = useMemo(() => {
        return dayjs.unix(timestampToUnix(review.reviewedAt)!);
    }, [review.reviewedAt]);

    /** Custom. Formatted review edited date. */
    const editedDate = useMemo(() => {
        if (!review.editedAt) {
            return null;
        }

        return dayjs.unix(timestampToUnix(review.editedAt)!);
    }, [review.editedAt]);
    //#endregion : Helpers

    //#endregion : Variables, functions and api calls
    const isChampionReviewer = getOneofValue(review?.reviewerEntityInfo?.entityInfo, 'seriesInfo')?.isChampion;

    const props = {
        isChampionReviewer,
        review,
        edited: !!editedDate,
        reviewDateFromNow: reviewDate.fromNow(),
        reviewHtmlContent: reviewContent,
        upVoteCount: upVotes || 0,
        downVoteCount: downVotes || 0,
        onClickUpVote,
        onClickDownVote,
        onVote,
        entity,
        disableReply,
        withBox,
    };
    return <ReviewCard {...props} />;
}
