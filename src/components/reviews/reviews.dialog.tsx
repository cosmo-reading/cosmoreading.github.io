import type { NovelItem } from '@app/_proto/Protos/novels';
import type { ProductItem } from '@app/_proto/Protos/products';
import { ReactComponent as CloseIcon } from '@app/assets/x.svg';
import Loading from '@app/components/loading';
import Reviews from '@app/components/reviews/reviews';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import clsx from 'clsx';
import { type ReactElement, type Ref, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

/** Custom. Main component parameters type */
type Props = {
    entity?: NovelItem | ProductItem | null;
    submitReview?: boolean;
    DialogOpenerComponent?: ReactElement | null;
    onOpenerClick?: () => void;
    onClose?: () => void;
};

export type DialogRef = {
    open: () => void;
};

/**
 * Custom.
 *
 * Lists review comments in a dialog.
 * Also handles adding a new comment.
 */
const ReviewsDialog = forwardRef(function ReviewsDialog(
    { entity, DialogOpenerComponent, onOpenerClick, onClose }: Props,
    ref: Ref<DialogRef>
) {
    const [open, setOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    //#region : Dialog show/hide

    /** Custom. Opens up the comments dialog. */
    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    /** Custom. Hides the comments dialog. */
    const handleHide = useCallback(() => {
        setOpen(false);
        onClose?.();
    }, [onClose]);
    //#endregion : Dialog show/hide

    const [, setLoadingReviews] = useState(true);

    /**
     * Custom.
     *
     * Handles show/hide of review box.
     * Scrolls to the top of the reviews list when comment box is opened
     */
    const handleNewReviewsLoaded = useCallback(() => {
        setLoadingReviews(false);
    }, []);

    //#endregion : Leave review

    //#endregion : Variables, functions and api calls

    useImperativeHandle(
        ref,
        () => ({
            open: () => setOpen(true),
        }),
        []
    );

    const handleClickOpenerComponent = useCallback(() => {
        onOpenerClick?.();
        handleOpen();
    }, [onOpenerClick, handleOpen]);

    return (
        <>
            {DialogOpenerComponent && (
                <div className="inline-block" onClick={handleClickOpenerComponent}>
                    {DialogOpenerComponent}
                </div>
            )}
            <Dialog
                open={open}
                onClose={handleHide}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    className: clsx(
                        'sm:m-8', // disable default theme style
                        '!w-full !max-h-[calc(100%-16px)] m-8 sm2:m-40 sm2:!max-w-[944px] sm2:!max-h-[calc(100%-80px)]'
                    ),
                }}
            >
                <DialogTitle className="m-20 p-0">
                    <span className="font-set-b16 text-gray-t1 sm2:font-set-b21">All Reviews</span>
                    <button
                        className="absolute right-2 top-2 rounded-full p-10 text-gray-400 hover:bg-gray-200 hover:bg-black/[.04] dark:hover:bg-white/[.08]"
                        aria-label="close"
                        onClick={handleHide}
                    >
                        <CloseIcon />
                    </button>
                </DialogTitle>
                <DialogContent ref={dialogContentRef} className="min-h-[50vh] overflow-x-hidden !px-[20px] !pb-0">
                    {open && !!entity && (
                        <Loading displayType="indicator">
                            <Reviews entity={entity} onReviewsLoaded={handleNewReviewsLoaded} />
                        </Loading>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
});

ReviewsDialog.defaultProps = {
    submitReview: true,
};

export default ReviewsDialog;
//#endregion : Main component
