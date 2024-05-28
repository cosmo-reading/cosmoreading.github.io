import { createContext } from 'react';

export type AppContextType = {
    themeName?: string;
};

const AppContext = createContext<AppContextType>({});

export { AppContext };
