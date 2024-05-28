import { ModalContext } from '@app/components/modal/modal';
import { useContext } from 'react';

/**
 * Custom.
 *
 * Use it when you need a modal dialog to take user's confirmation,
 * to show a modal error dialog,
 * or to show a modal full page loader.
 */
export const useModal = () => useContext(ModalContext);
