import ButtonSpinner from '@app/components/button.spinner';
import { batch } from '@app/libs/utils';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as React from 'react';
import { useRef, useState } from 'react';

//#region : Global constants and types

/**
 * Custom.
 *
 * Internally used to show the relevant view
 */
enum ModalType {
    Undefined = 0,
    Confirmation = 1,
    Error = 2,
}

/**
 * Custom.
 *
 * Internally used to mark the completion / rejection of the modal task.
 * Resolve is called when modal completes successfully.
 * Reject is called when user cancels the action. It throws an error.
 */
type StatefulPromise = {
    resolve: () => void;
    reject: (reason?: any) => void;
};

/**
 * Custom.
 *
 * ModalContextType will be used by useContext to create context.
 * The methods declared inside it will be available to the calling component.
 * This is just a type declaration. Methods body is declared in the main component.
 */
export type ModalContextType = {
    /**
     * Custom.
     *
     * Use in a try/catch block.
     *
     * Use it when you want a confirmation for a action from the user,
     * in a modal dialog. You can choose to keep the dialog open after
     * the confirmation withConfirmProgress. It will show spinner.
     *
     * To close the dialog when wihConfirmProgress is true,
     * use closeDialogProgress context method.
     *
     * When wihConfirmProgress is false, it will throw error
     * when user cancels. When user agrees, it will complete without error.
     */
    requestConfirmation: (
        title: string,
        text: string,
        confirmText?: string,
        cancelText?: string,
        withConfirmProgress?: boolean
    ) => Promise<void>;

    /**
     * Custom.
     *
     * Use it to close the dialog when you have set wihConfirmProgress to true
     * in requestConfirmation function.
     */
    closeDialogProgress: () => void;

    /**
     * Custom.
     *
     * Use in a try/catch block.
     *
     * Use it when you want to show a modal error.
     * It will throw error when user chooses to try again later and cancels the action.
     *
     * If reloadPage is set to true, it will reload the page with window.location
     * when user clicks on reload button.
     *
     * When reloadPage is false, it will complete without error and won't reload the page.
     * You have to take care of what happens when the user clicks on 'reload'.
     */
    showError: (reloadPage: boolean, err: any) => Promise<void>;

    /**
     * Custom.
     *
     * Use it when you want to show full page modal loading indicator.
     * Pass true to show, false to hide.
     */
    showFullPageLoader: (loading: boolean) => void;
};

export const ModalContext = React.createContext<ModalContextType>(null!);

//#endregion : Global constants and types

//#region : Main component

/** Custom. Main component parameters type */
export type ModalProps = {
    children?: React.ReactNode;
};

/**
 * Custom context provider.
 *
 * To show modal dialogs for - requesting confirmation, showing error and showing full page loader
 */
export default function ModalProvider({ children, ...rest }: ModalProps) {
    //#region : Variables, functions and api calls

    //Start: Dialog properties
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [confirmText, setConfirmText] = useState('Ok');
    const [cancelText, setCancelText] = useState('Cancel');
    const [withConfirmProgress, setWithConfirmProgress] = useState(false);
    const [showConfirmProgress, setShowConfirmProgress] = useState(false);
    const [modalType, setModalType] = useState(ModalType.Undefined);
    const [reloadPage, setReloadPage] = useState(false);
    const statefulPromise = useRef<StatefulPromise | null>(null);
    //End: Dialog properties

    //Start: Full page loader properties
    const [loading, setLoading] = useState(false);
    //End: Full page loader properties

    //Declare ModalContextType methods body
    const [context] = useState<ModalContextType>({
        //Start: Dialog methods
        requestConfirmation: (title, text, confirmText, cancelText, withConfirmProgress = false) => {
            batch(() => {
                setTitle(title);
                setText(text);
                setConfirmText(confirmText ?? 'Ok');
                setCancelText(cancelText ?? 'Cancel');
                setOpen(true);
                setWithConfirmProgress(withConfirmProgress);
                setModalType(ModalType.Confirmation);
            });

            return new Promise((resolve, reject) => {
                statefulPromise.current = { resolve, reject };
            });
        },
        closeDialogProgress: () => {
            batch(() => {
                setOpen(false);
                setShowConfirmProgress(false);
            });
        },
        showError: reloadPage => {
            batch(() => {
                setReloadPage(reloadPage);
                setTitle('Error');
                setText(
                    'Trouble connecting to the server.\nPlease try to reload the page.\nIf the problem persists, please try again after some time.'
                );
                setConfirmText('Reload');
                setCancelText("I'll try later");
                setOpen(true);
                setWithConfirmProgress(false);
                setModalType(ModalType.Error);
            });

            return new Promise((resolve, reject) => {
                statefulPromise.current = { resolve, reject };
            });
        },
        //End: Dialog methods

        //Start: Full page loader methods
        showFullPageLoader: loading => {
            setLoading(loading);
        },
        //End: Full page loader methods
    });

    //Start: Internal Dialog methods
    const handleConfirm = () => {
        const shouldRemainOpen = withConfirmProgress ? true : false;

        batch(() => {
            setOpen(shouldRemainOpen);
            setShowConfirmProgress(shouldRemainOpen);
        });

        if (modalType == ModalType.Error && reloadPage) {
            window.location.reload();
        }

        statefulPromise.current?.resolve();
    };

    const handleCancel = () => {
        setOpen(false);

        statefulPromise.current?.reject();
    };
    //End: Internal Dialog methods

    //#endregion : Variables, functions and api calls

    return (
        <ModalContext.Provider value={context}>
            {children}
            <Dialog
                maxWidth="xs"
                aria-labelledby="confirmation-dialog-title"
                open={open}
                {...rest}
                PaperProps={{
                    className: 'dark:!bg-[#202020]',
                }}
            >
                <DialogTitle
                    id="confirmation-dialog-title"
                    className="p-[20px] pb-[11px] text-[18px] font-bold text-gray-t0"
                >
                    {title}
                </DialogTitle>
                <DialogContent className="px-[20px]">
                    <div className="text-[14px] leading-[1.5] text-[#666] dark:text-[#BDBDBD]">
                        {text.split('\n').map((line, idx) => (
                            <p key={idx}>{line}</p>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions className="space-x-[10px] px-[20px] pb-[20px]">
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        color="secondary"
                        disabled={showConfirmProgress}
                        className="min-h-[36px] min-w-[94px] !text-[13px] !font-semibold"
                    >
                        {cancelText ?? 'Cancel'}
                    </Button>
                    <ButtonSpinner
                        onClick={handleConfirm}
                        spinner={showConfirmProgress}
                        disabled={showConfirmProgress}
                        className="min-h-[36px] min-w-[94px] !text-[13px] !font-semibold"
                    >
                        {confirmText ?? 'Ok'}
                    </ButtonSpinner>
                </DialogActions>
            </Dialog>
            {loading && (
                <div className="fixed top-0 right-0 left-0 bottom-0 z-[9999] flex bg-[#8080807a]">
                    <CircularProgress color="secondary" size={56} className="m-auto" />
                </div>
            )}
        </ModalContext.Provider>
    );
}
//#endregion : Main component
