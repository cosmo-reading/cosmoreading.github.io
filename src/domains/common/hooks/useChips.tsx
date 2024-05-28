import { createContext, useContext } from 'react';

type ContextProps = {
    gap: number;
};

export const ChipsContext = createContext<ContextProps>({} as ContextProps);

export const useChips = () => useContext(ChipsContext);
