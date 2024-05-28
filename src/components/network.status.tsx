import { SignalWifiOff } from '@mui/icons-material';
import { onlineManager } from '@tanstack/react-query';
import type * as React from 'react';
import { useMemo, useSyncExternalStore } from 'react';

//#region : Global constants and types

/** Custom type. Used to denote the network state */
type NetworkState = 'online' | 'offline';

/** Custom type. Used to create the network state context. */
export type NetworkStateContextType = {
    state: NetworkState;
};

const ServerNetworkStatus = true;

/**
 * Custom hook.
 *
 * Use it when you want to keep track of the network status.
 */
export const useNetworkStatus = () => {
    const [subscription, getSnapshot, getServerSnapshot] = useMemo(() => {
        let isOnline = onlineManager.isOnline();

        return [
            notify => {
                const unsub = onlineManager.subscribe(() => {
                    isOnline = onlineManager.isOnline();

                    notify();
                });

                return () => {
                    unsub();
                };
            },
            () => isOnline,
            () => ServerNetworkStatus,
        ];
    }, []);

    return useSyncExternalStore(subscription, getSnapshot, getServerSnapshot);
};

//#endregion : Global constants and types

//#region : Main component

/** Custom. Main component parameters type */
export type NetworkStateProps = {
    children?: React.ReactNode;
};

/**
 * Custom context provider & helper component.
 *
 * Shows a message at the top when network is offline and set's the network context
 * whenever the network state changes.
 */
function NetworkStatus({ children }: NetworkStateProps) {
    //#region : Variables, functions and api calls

    const networkStatus = useNetworkStatus();

    return (
        <>
            {!networkStatus && (
                <div className="sticky top-0 left-0 right-0 z-[1101] flex flex-1 items-center justify-center bg-[#181818] p-[5px] text-center text-white dark:bg-[#b2b2b2] dark:text-[#313131]">
                    <SignalWifiOff /> &nbsp; No internet connection.
                </div>
            )}
            {children}
        </>
    );
}

/**
 * Custom context provider & helper component.
 *
 * Shows a message at the top when network is offline and set's the network context
 * whenever the network state changes.
 */
export default NetworkStatus;
//#endregion : Main component
