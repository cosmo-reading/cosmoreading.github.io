import type { NovelItem } from '@app/_proto/Protos/novels';
import type { ProductItem } from '@app/_proto/Protos/products';
import type { ReviewCommentItem } from '@app/_proto/Protos/review_comments';
import type { ReviewItem } from '@app/_proto/Protos/reviews';
import { ReactComponent as CloseIcon } from '@app/assets/x.svg';
import QueryProgress from '@app/components/query.progress';
import ReviewComponent from '@app/components/reviews/review';
import ReviewCommentComponent from '@app/components/reviews/review.comment';
import SubmitReviewCommentComponent from '@app/components/reviews/review.comment.submit';
import CancelButton from '@app/domains/common/components/button/CancelButton';
import useReviewComments from '@app/domains/novel/hooks/useReviewComments';
import { useAuth } from '@app/libs/auth';
import { batch } from '@app/libs/utils';
import { CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material';
import clsx from 'clsx';
import { uniqBy } from 'lodash-es';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

//#region : Global constants and types

/** Custom. Used for pagination. */
const COMMENTS_PER_PAGE = 10;

//#endregion : Global constants and types

//#region : Main component

/** Custom. Main component parameters type */
type Props = {
    review: ReviewItem;
    OpenerComponent: React.ReactElement;
    onVote?: () => void;
    entity?: NovelItem | ProductItem;
};

/**
 * Custom.
 *
 * Lists review comments in a dialog.
 * Also handles adding a new comment.
 */
export default function ReviewCommentsComponent({ review, OpenerComponent, onVote, entity }: Props) {
    //#region : Variables, functions and api calls

    //General
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [comments, setComments] = useState<ReviewCommentItem[]>([]);
    const [page, setPage] = useState(1);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    //#region : Dialog show/hide

    /** Custom. Opens up the comments dialog. */
    const onClickCommentsIcon = useCallback(() => {
        batch(() => {
            setPage(1);
            setOpen(true);
        });
    }, []);

    /** Custom. Hides the comments dialog. */
    const onHide = useCallback(() => {
        setOpen(false);
    }, []);
    //#endregion : Dialog show/hide

    //#region : Review comments

    const {
        data: commentsData,
        refetch,
        ...commentsQuery
    } = useReviewComments({
        pageCount: COMMENTS_PER_PAGE,
        review,
        page,
        enabled: open,
    });

    //Merges with previous comments list (if it exists),
    //and handles states of other things like loading indicator
    //and visibility of comment box
    useEffect(() => {
        if (commentsData?.items) {
            batch(() => {
                setComments(prev => uniqBy([...prev, ...commentsData.items], c => c.id));
                setLoadingMore(false);
            });
        }
    }, [review.id, commentsData]);

    /** Custom. Loads next page of comments. */
    const onClickLoadMore = useCallback(() => {
        batch(() => {
            setLoadingMore(true);
            setPage(prev => prev + 1);
        });
    }, []);

    //#endregion : Review comments

    //#region : New comment

    /** Custom. Called when a new comment has been successfully submitted. */
    const onSubmitComment = useCallback(async () => {
        const oldPage = page;

        batch(() => {
            setPage(1);
            setComments([]);
        });

        if (oldPage === 1) {
            refetch();
        }
    }, [page, refetch]);

    //#endregion : New comment

    //#endregion : Variables, functions and api calls

    return (
        <React.Fragment>
            <div onClick={onClickCommentsIcon}>{OpenerComponent}</div>
            <Dialog
                open={open}
                onClose={onHide}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    className: clsx(
                        'sm:m-8', // disable default theme style
                        '!w-full !max-h-[calc(100%-16px)] overflow-x-hidden m-8 sm2:m-40 sm2:!max-w-[944px] sm2:!max-h-[calc(100%-80px)]'
                    ),
                }}
            >
                <DialogTitle className="p-0">
                    <div className="font-set-b16 p-20 text-gray-t1 sm2:font-set-b21">Review Details</div>
                    <button
                        className="absolute right-2 top-2 rounded-full p-10 text-gray-400 hover:bg-gray-200 hover:bg-black/[.04] dark:hover:bg-white/[.08]"
                        aria-label="close"
                        onClick={onHide}
                    >
                        <CloseIcon />
                    </button>
                </DialogTitle>
                <DialogContent ref={dialogContentRef} className="min-h-[50vh] overflow-x-hidden !px-20 !py-0 !pb-20">
                    <div className="-mx-8 pb-8 pt-4 sm2:mx-0 sm2:pb-16">
                        <ReviewComponent key={review.id} review={review} onVote={onVote} entity={entity} disableReply />
                    </div>
                    {user && (
                        <div className="pt-8 sm2:pt-0 sm2:pb-16">
                            <SubmitReviewCommentComponent review={review} onSubmitComment={onSubmitComment} />
                        </div>
                    )}
                    <QueryProgress status={commentsQuery.isRefetching ? 'loading' : commentsQuery.status} />

                    {!!comments.length && (
                        <div className="pt-8 sm2:pt-0">
                            {comments.map(c => (
                                <ReviewCommentComponent key={c.id} comment={c} />
                            ))}
                        </div>
                    )}
                    {commentsQuery.status !== 'loading' && commentsData?.pageInfo?.total! === 0 && (
                        <div className="h-240 content-dead-center">
                            <h4 className="font-set-r15 text-gray-desc sm2:font-set-r16">No comments yet!</h4>
                        </div>
                    )}
                    {comments.length !== 0 && comments.length < commentsData?.pageInfo?.total! && (
                        <div className="mt-20 content-dead-center">
                            <CancelButton onClick={onClickLoadMore}>Load More</CancelButton>
                        </div>
                    )}
                    {loadingMore && (
                        <span className="mt-[15px] content-dead-center">
                            <CircularProgress color="secondary" />
                        </span>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
//#endregion : Main component
