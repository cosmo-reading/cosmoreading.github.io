import { Global } from '@emotion/react';
import { CircularProgress } from '@mui/material';
import ReactDOM from 'react-dom';

export default function SubscriptionsSuccess() {
    return ReactDOM.createPortal(
        <>
            <Global styles={{ body: { overflow: 'hidden' } }} />
            <div className="fixed top-0 left-0 right-0 bottom-0 z-[1401] h-full w-full overflow-hidden bg-black bg-opacity-50"></div>
            <div className="fixed top-0 left-0 right-0 bottom-0 z-[1402] overflow-hidden px-[30px]">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center justify-center space-y-[30px]">
                        <CircularProgress className="text-white" />
                        <p className="text-center font-extrabold text-white">
                            Please wait, your request is being processed
                        </p>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
