import { NovelItem } from '@app/_proto/Protos/novels';
import { ProductItem } from '@app/_proto/Protos/products';
import {
    GetUserReviewRequest,
    GetUserReviewResponse,
    type ReviewItem,
    type SearchReviewsResponse,
} from '@app/_proto/Protos/reviews';
import { ReviewsClient } from '@app/_proto/Protos/reviews.client';
import { useModal } from '@app/components/modal/context';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { GrpcError, useGrpcRequest } from '@app/libs/grpc';
import { CircularProgress } from '@mui/material';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import { useQueryClient } from '@tanstack/react-query';
import produce from 'immer';
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
    entity?: NovelItem | ProductItem;
    onReviewSubmission?: (review: ReviewItem, updated?: boolean) => void;
    onUserReviewFetched?: (hasReview: boolean) => void;
    onCancelReview?: () => void;
};

const ReviewSubmitForm = lazy(() => import('@app/components/reviews/review.submit.form'), {
    ssr: false,
});

export default function ReviewSubmit({ entity, onReviewSubmission, onCancelReview, onUserReviewFetched }: Props) {
    const { showError } = useModal();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [reviewNotFound, setReviewNotFound] = useState(false);

    const type = useMemo(() => {
        if (NovelItem.is(entity)) {
            return 'novel';
        }
        if (ProductItem.is(entity)) {
            return 'product';
        }

        return 'unknown';
    }, [entity]);

    const userReviewRequest = useGrpcRequest(GetUserReviewRequest, {
        type: entity
            ? type === 'novel'
                ? {
                      oneofKind: 'novelId',
                      novelId: entity.id,
                  }
                : type === 'product'
                  ? {
                          oneofKind: 'productId',
                          productId: entity.id,
                      }
                  : undefined
            : undefined,
        userId: user?.id,
    });

    const { data: userReviewData, error } = useGrpcApiWithQuery(
        ReviewsClient,
        c => c.getUserReview,
        userReviewRequest,
        ['user-review', type, entity?.id, user?.id],
        {
            enabled: !!user && !!entity && !reviewNotFound,
            staleTime: Number.POSITIVE_INFINITY,
            refetchOnMount: true,
            suspense: true,
            useErrorBoundary: false,
            onSuccess: data => {
                onUserReviewFetched?.(!!data.item);
            },
        }
    );

    useEffect(() => {
        if (error instanceof GrpcError && error.status === GrpcStatusCode.NOT_FOUND) {
            setReviewNotFound(true);
            onUserReviewFetched?.(false);
        } else if (error) {
            (async () => {
                try {
                    await showError(true, error);
                } catch (e) {
                    // cancelled
                }
            })();
        }
    }, [error, onUserReviewFetched, showError]);

    const handleSubmission = useCallback(
        (review: ReviewItem, updated?: boolean) => {
            onReviewSubmission?.(review, updated);

            if (updated) {
                //Avoid unnecessary server calls.. set new user review data locally
                queryClient.setQueryData(
                    ['user-review', type, entity?.id, user?.id],
                    (prevState: GetUserReviewResponse) =>
                        produce(prevState, newState => {
                            newState.item = review;
                        })
                );

                //Avoid unnecessary server calls.. update reviews list locally
                queryClient.setQueriesData(['reviews', type, entity?.id], (prevState: SearchReviewsResponse) =>
                    produce(prevState, newState => {
                        const idx = prevState.items.findIndex(f => f.id === review.id);
                        if (idx > -1) {
                            newState.items[idx] = review;
                        }
                    })
                );
            } else {
                const newResponse = GetUserReviewResponse.create({ item: review });

                queryClient.setQueryData(['user-review', type, entity?.id, user?.id], newResponse);
            }
        },
        [entity?.id, onReviewSubmission, queryClient, type, user?.id]
    );

    const { item: review } = userReviewData || { item: null };

    if (!reviewNotFound && status === 'loading') {
        return (
            <div className="content-dead-center">
                <CircularProgress disableShrink color="secondary" />
            </div>
        );
    }

    if (!userReviewData && !reviewNotFound) {
        return null;
    }

    return (
        <ReviewSubmitForm
            review={review || null}
            entity={entity}
            onCancelReview={onCancelReview}
            onReviewSubmission={handleSubmission}
        />
    );
}
