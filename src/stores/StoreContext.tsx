import React, {createContext, useContext} from 'react';
import {RootStore, rootStore} from './RootStore';

const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStores = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStores must be used within StoreProvider');
    }
    return context;
};
