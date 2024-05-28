import { NovelItem } from '@app/_proto/Protos/novels';
import { ProductItem } from '@app/_proto/Protos/products';
import { type ReviewItem, SearchReviewsRequest, SearchReviewsRequest_SortType } from '@app/_proto/Protos/reviews';
import { ReviewsClient } from '@app/_proto/Protos/reviews.client';
import { analyticsFactory } from '@app/analytics/handlers';
import { LoadingFallback } from '@app/components/loading';
import Paging from '@app/components/paging';
import ReviewComponent from '@app/components/reviews/review';
import ReviewSubmit from '@app/components/reviews/review.submit';
import ReviewsDialog from '@app/components/reviews/reviews.dialog';
import ReviewPlaceholder from '@app/components/reviews/reviews.placeholder';
import { ReviewSearchSort } from '@app/data/api';
import Select from '@app/domains/common/components/Select';
import { NovelEvents } from '@app/domains/novel/analytics/amplitude/events';
import NovelReviewScore from '@app/domains/novel/components/NovelReviewScore';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';
import { batch } from '@app/libs/utils';
import { CardActions, PaginationItem } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type WrapperComponentType = React.ComponentType<{
    children?: React.ReactNode;
    entity?: NovelItem | ProductItem;
    loaded?: boolean;
}>;

// Custom. Main component parameters type
type Props = {
    entity?: NovelItem | ProductItem;
    submitReview: boolean;
    pagination: boolean;
    sorting: boolean;
    reviewCount: number;
    wrapperComponent?: WrapperComponentType;
    onReviewsLoaded?: (hasReviews: boolean) => void;
    onCancelReview?: () => void;
    showsDialogOpener?: boolean;
};

// Custom. Main component parameters default values.
Reviews.defaultProps = {
    title: true,
    submitReview: true,
    pagination: true,
    sorting: true,
    reviewCount: 10,
};

function PassthroughWrapper({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

function DialogOpener() {
    return (
        <span className="font-set-sb14 cursor-pointer text-blue-600 sm2:font-set-sb15 hover:underline">View All</span>
    );
}

/** Custom. Displays reviews for a given novel and handles it's actions. */
export default function Reviews({
    entity,
    submitReview,
    pagination,
    sorting,
    reviewCount,
    wrapperComponent,
    onReviewsLoaded,
    onCancelReview,
    showsDialogOpener,
}: Props) {
    //#region : Variables, functions and api calls

    //General
    const { user } = useAuth();
    const [page, setPage] = useState<number | null>(null);
    const [isPaging, setIsPaging] = useState(false);
    const [sort, setSort] = useState(SearchReviewsRequest_SortType.Relevance);

    const [hasUserReview, setHasUserReview] = useState<boolean | null>(null);

    const divRef = useRef<HTMLDivElement | null>(null);

    const reviewsListContainerRef = useRef<HTMLDivElement | null>(null);

    const type = useMemo(() => {
        if (NovelItem.is(entity)) {
            return 'novel';
        }
        if (ProductItem.is(entity)) {
            return 'product';
        }

        return 'unknown';
    }, [entity]);

    //#region : Server request to fetch reviews from server

    const searchReviewsRequest = useGrpcRequest(SearchReviewsRequest, {
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
        sortType: sort,
        pageInfo: {
            page: page ?? 1,
            count: reviewCount,
        },
    });

    const {
        data: reviewData,
        // isLoading,
        ...reviewsQuery
    } = useGrpcApiWithQuery(
        ReviewsClient,
        c => c.searchReviews,
        searchReviewsRequest,
        ['reviews', type, entity?.id, page ?? 1, sort, reviewCount],
        {
            suspense: true,
            enabled: !!entity,
            staleTime: Number.POSITIVE_INFINITY,

            //We need this so that the dialog does not close and the view
            //updates seemlessly between refreshes
            keepPreviousData: true,

            //Show error only when this is the main component with pagination
            showModalOnError: pagination ? true : undefined,
            onSuccess(data) {
                onReviewsLoaded?.(data?.items.length > 0);
            },
        }
    );

    //#endregion : Server request to fetch reviews from server

    //#region : Helpers

    /** Custom. Scrolls the review container to the top. */
    const goToTop = useCallback(async () => {
        if (reviewsListContainerRef.current) {
            reviewsListContainerRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, []);

    //#endregion : Helpers

    //#region : Pagination

    /** Custom. Used in pagination. Returns total number of pages. */
    const totalPages = useMemo(() => {
        if (!reviewData?.items) {
            return 0;
        }

        return Math.ceil((reviewData?.pageInfo?.total || 0) / reviewCount);
    }, [reviewData?.items, reviewData?.pageInfo?.total, reviewCount]);

    /** Custom. Called when page number is clicked. */
    const handlePagination = useCallback(
        async (e, page: number) => {
            batch(() => {
                setPage(page);
                setIsPaging(true);
            });

            await goToTop();
        },
        [goToTop]
    );

    useEffect(() => {
        setIsPaging(prev => (prev ? false : prev));
    }, [reviewData]);
    //#endregion : Pagination

    //#region : Action handlers

    const queryClient = useQueryClient();

    /**
     * Custom.
     *
     * Handles post effects of adding a new review on the reviews list.
     * Removes all the reviews queries from cache, sets the page to 1 and sort is set to newest
     */
    const handleUserNewReviewAdded = async () => {
        queryClient.removeQueries(['reviews', type, entity?.id, reviewCount]);

        batch(() => {
            setPage(1);
            setHasUserReview(true);
            setSort(SearchReviewsRequest_SortType.Newest);
        });
        goToTop();
    };

    /**
     * Custom.
     *
     * Called after the review is submitted successfully.
     * Handles both - new review and the review update.
     */
    const handleSubmission = async (review: ReviewItem, updated: boolean) => {
        if (!user || !reviewData) {
            return;
        }

        if (entity && NovelItem.is(entity)) {
            analyticsFactory(NovelEvents.ClickSubmitSeriesReview)({ entity, review, on: updated ? 'Edit' : 'New' });
        }

        if (!updated) {
            handleUserNewReviewAdded();
        }
    };

    /**
     * Custom.
     *
     * Used when user adds a review in another instance of the reviews component.
     * When user's review is fetched in the ReviewSubmitComponent,
     * it calls this function to let the parent component know of the state of the user's review.
     *
     * How it works example:
     * Suppose there are two instances of Reviews component mounted - R1 and R2.
     * User has not posted any reivew for the current entity.
     * R1 and R2 both set the initial value of hasUserReview to null.
     * Child component ReviewSubmitComponent of both R1 and R2
     * will return false when they attempt to fetch the user's review.
     * The hasUserReview state is false for both R1 and R2.
     * Now, suppose user writes review in instance R2.
     * R2 will submit the review and upon successful submission,
     * it will invalidate the previous user-review query to fetch fresh data from server
     * and update its reviews list.
     * Usually, R1 will be unaware of all the changes made in R2 because it maintains its own state.
     * But, we want R1 to also show the newly added review in its reviews list.
     * To notify R1 that there was a change in the user-review, we call this function whenever
     * ReviewSubmitComponent child component fetches user-review again for whatever reason -
     * refetch, load, invalidateQueries etc..
     * When R2's ReviewSubmitComponent fetches user-review, it will trigger ReviewSubmitComponent in R1 too.
     * R1 will be notified that there was a new Review. R1 will match it against its own state and see that
     * its state says that there is no user review. So, R1 will update its state and refetch reviews.
     */
    const handleUserReviewFetched = (hasReview: boolean) => {
        if (hasUserReview === null) {
            setHasUserReview(hasReview);
            return;
        }

        if (hasUserReview) {
            return;
        }

        if (!hasUserReview && hasReview) {
            handleUserNewReviewAdded();
        }
    };

    /**
     * Custom.
     *
     * Called after the review vote is submitted successfully.
     */
    const handleVoteSubmission = useCallback(() => {
        if (!user) {
            return;
        }
        queryClient.invalidateQueries(['reviews']);
    }, [queryClient, user]);

    /** Custom. Handles reviews sort. */
    const handleSort = useCallback(option => {
        batch(() => {
            setPage(1);
            setIsPaging(true);
            setSort(option.value as SearchReviewsRequest_SortType);
        });
    }, []);

    //#endregion : Action handlers

    const showPlaceholders = (isPaging && reviewsQuery.isFetching) || !reviewData;

    //#endregion : Variables, functions and api calls

    const Wrapper = wrapperComponent || PassthroughWrapper;

    return (
        <>
            <div ref={divRef}></div>
            {!!reviewData && (
                <Wrapper entity={entity} loaded>
                    {submitReview && !!user && (
                        <Suspense fallback={<LoadingFallback className="h-[260px]" displayType="indicator" />}>
                            <div className="pb-20 sm2:pb-32">
                                <ReviewSubmit
                                    entity={entity}
                                    onReviewSubmission={handleSubmission}
                                    onCancelReview={onCancelReview}
                                    onUserReviewFetched={handleUserReviewFetched}
                                />
                            </div>
                        </Suspense>
                    )}
                    <div ref={reviewsListContainerRef}>
                        <div className="flex items-center">
                            {NovelItem.is(entity) && (
                                <div className="sm2:flex">
                                    <NovelReviewScore
                                        isLoading={!entity}
                                        reviewRating={entity?.reviewInfo?.rating?.value}
                                        classes={{
                                            goodIcon: 'sm2:w-24 sm2:h-24 mr-4',
                                            rating: 'font-set-b24 sm2:font-set-b28 text-gray-t1',
                                        }}
                                    >
                                        <NovelReviewScore.MedalIcon className="sm2:h-24 sm2:w-24" />
                                    </NovelReviewScore>
                                    <NovelReviewScore.Count
                                        count={entity?.reviewInfo?.count}
                                        className="font-set-sb15 ml-0 self-end text-gray-t3 sm2:ml-2"
                                    />
                                </div>
                            )}
                            {showsDialogOpener && (
                                <div className="ml-auto">
                                    <ReviewsDialog entity={entity} DialogOpenerComponent={<DialogOpener />} />
                                </div>
                            )}
                            {sorting && (
                                <div className="ml-auto">
                                    <Select options={SORT_OPTIONS} onChange={handleSort} defaultValue={sort} />
                                </div>
                            )}
                        </div>
                    </div>
                    {showPlaceholders && (
                        <div className="pt-[15px]">
                            {Array(reviewCount)
                                .fill(null)
                                .map((_, idx) => (
                                    <ReviewPlaceholder key={idx} />
                                ))}
                        </div>
                    )}
                    {!showPlaceholders && (
                        <div className="-mx-8 flex flex-col space-y-12 pt-16 sm2:mx-0 sm2:pt-20">
                            {reviewData?.items?.map(review => (
                                <ReviewComponent
                                    key={review.id}
                                    review={review}
                                    onVote={handleVoteSubmission}
                                    entity={entity}
                                />
                            ))}
                            {reviewData.items.length === 0 && <div className="px-8 sm2:px-0">No reviews found</div>}
                        </div>
                    )}
                    {pagination && (
                        <CardActions className="panel panel-footer px-0 py-[20px]">
                            <Paging
                                classes={{ ul: 'space-x-4 sm2:space-x-6' }}
                                count={totalPages}
                                page={page ?? 1}
                                onChange={handlePagination}
                                renderItem={item => (
                                    <PaginationItem className="font-set-r16 mx-0 sm2:h-32 sm2:w-32" {...item} />
                                )}
                            />
                        </CardActions>
                    )}
                </Wrapper>
            )}
        </>
    );
}
//#endregion : Main component

const SORT_OPTIONS = Object.keys(ReviewSearchSort)
    .filter(Number)
    .map(value => ({
        text: ReviewSearchSort[value],
        value: Number(value),
    }));
