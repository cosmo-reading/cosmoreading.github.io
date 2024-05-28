import type { GrpcError } from '@app/libs/grpc';
import { Close } from '@mui/icons-material';
import { Alert, type AlertProps, AlertTitle, Collapse, IconButton, List, ListItem, ListItemText } from '@mui/material';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

//#region : Main component

/** Custom. Main component parameters type */
export type ApiErrorProps = {
    error: GrpcError | null;
    showClose?: boolean;
    alertProps?: AlertProps;
    onDismiss?: () => void;
};

/**
 * Custom helper component.
 *
 * Use it when you want to show inline alert for Grpc error
 */
export default function ApiError({ error, showClose = true, alertProps, onDismiss }: ApiErrorProps) {
    //#region : Variables, functions and api calls

    const { response } = error || {
        response: null,
    };

    //#region : Alert's visibilty management

    //State to store Alert's visibility status
    const [dismissed, setDismissed] = useState(false);

    //On error change always show it as visible
    useEffect(() => {
        setDismissed(false);
    }, [error]);

    //Handler for Alert's close button
    //Call parameter onDismiss function, if provided
    const handleOnClose = useCallback(() => {
        setDismissed(true);

        onDismiss?.();
    }, [onDismiss]);

    //#endregion : Alert's visibilty management

    //#endregion : Variables, functions and api calls

    //No error? Return nothing :)
    if (!error) {
        return null;
    }

    //We will be here only if there was an error
    //So return the alert component with all the fireworks.
    return (
        <Collapse in={!dismissed}>
            <Alert
                severity="error"
                icon={false}
                css={{
                    padding: '0px',
                    backgroundColor: 'transparent',
                    '& .MuiAlert-message': {
                        padding: '0px',
                    },
                    '& .MuiAlert-action, & .MuiAlert-action *': {
                        paddingTop: '0px',
                    },
                }}
                action={
                    showClose ? (
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleOnClose}>
                            <Close fontSize="inherit" />
                        </IconButton>
                    ) : undefined
                }
                {...alertProps}
            >
                {!!response?.description && (
                    <AlertTitle className="!mb-0 text-[13px] font-semibold leading-tight text-[#dd3545]">
                        {response.description}
                    </AlertTitle>
                )}
                {!!response && response.errors.length > 0 && (
                    <List dense disablePadding className="mt-[5px]">
                        {response?.errors.map((err, idx) => (
                            <ListItem key={idx} disableGutters className="p-0 leading-tight">
                                <ListItemText
                                    primary={err}
                                    className="m-0"
                                    primaryTypographyProps={{
                                        className: 'text-[13px] leading-tight !text-[#dd3545] font-semibold',
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Alert>
        </Collapse>
    );
}
//#endregion : Main component
