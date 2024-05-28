import { CreateReviewCommentRequest } from '@app/_proto/Protos/review_comments';
import { ReviewCommentsClient } from '@app/_proto/Protos/review_comments.client';
import type { ReviewItem } from '@app/_proto/Protos/reviews';
import Divider from '@app/components/Divider';
import ApiError from '@app/components/error.api';
import ActivateButton from '@app/domains/common/components/button/ActivateButton';
import { useAuth } from '@app/libs/auth';
import { GrpcError } from '@app/libs/grpc';
import { useHttp } from '@app/libs/http';
import { batch } from '@app/libs/utils';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import clsx from 'clsx';
import React, { type ChangeEvent, useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

//#region : Main component

/** Custom. Main component parameters type */
type Props = {
    review: ReviewItem;
    onSubmitComment?: () => void;
};

/** Custom. Shows view to add new comment and handles it's action.  */
export default function SubmitReviewCommentComponent({ review, onSubmitComment }: Props) {
    //#region : Variables, functions and api calls

    const { user } = useAuth();
    const [commentContent, setCommentContent] = useState('');

    //#region : Server request to save the review comment

    const { grpcRequest } = useHttp();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<GrpcError | null>(null);

    const onClickSubmitComment = useCallback(async () => {
        if (submitting) {
            return;
        }

        const content = commentContent;

        batch(() => {
            setSubmitting(true);
            setError(null);
        });

        try {
            if (!content.trim().length) {
                setError({
                    response: {
                        description: 'Content length must be between 1 and 2048 characters.',
                        errors: [],
                        metadata: {},
                    },
                    status: GrpcStatusCode.INVALID_ARGUMENT,
                    name: 'frontend error',
                    message:
                        'This is actually not an api error. It is "temporarily" implemented like an API error until the design guide is established.',
                });
                return;
            }

            const request = CreateReviewCommentRequest.create({
                id: review.id,
                type: review.type,
                content,
            });

            const resp = await grpcRequest(ReviewCommentsClient, c => c.createReviewComment, request);

            if (resp.item) {
                setCommentContent('');

                onSubmitComment?.();
            }
        } catch (e) {
            if (e instanceof GrpcError) {
                setError(e);
                console.error(e.response?.description);
            } else {
                console.error(e);
            }
        } finally {
            setSubmitting(false);
        }
    }, [commentContent, grpcRequest, onSubmitComment, review.id, review.type, submitting]);

    //#endregion : Server request to save the review comment

    //#region : Action handlers

    /** Custom. Handles comment textarea change. */
    const onChangeContent = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setCommentContent(e.target.value);
    }, []);

    //#endregion : Action handlers

    //#endregion : Variables, functions and api calls

    if (!user) {
        return null;
    }

    return (
        <div className="relative pt-12 sm2:rounded-12 sm2:p-20 sm2:shadow-ww-text-container sm2:dark:bg-gray-950">
            {error && (
                <ApiError alertProps={{ className: 'mb-[20px]' }} error={error} onDismiss={() => setError(null)} />
            )}
            <div
                className={clsx(
                    'mb-4 inline-flex w-full rounded-8 bg-gray-container-base px-10 py-8',
                    'hover:ring-1 hover:ring-inset hover:ring-blue-600'
                )}
            >
                <textarea
                    className={twMerge(
                        'font-set-r16-h150 w-full resize-none bg-transparent pr-3 placeholder:text-gray-500 dark:text-white dark:placeholder:text-white/40'
                    )}
                    name="content"
                    value={commentContent}
                    placeholder="Add a Comment"
                    onChange={onChangeContent}
                    disabled={submitting}
                    readOnly={submitting}
                >
                    {commentContent}
                </textarea>
            </div>
            <div>
                <div className="pt-8 pb-20 text-right sm2:pt-12 sm2:pb-4">
                    <ActivateButton className="font-set-sb13" onClick={onClickSubmitComment} disabled={submitting}>
                        Submit
                    </ActivateButton>
                </div>
            </div>
            <Divider isFullScreen className="sm2:hidden" />
        </div>
    );
}

//#endregion : Main component
