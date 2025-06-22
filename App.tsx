import React from 'react';
import {StoreProvider} from './src/stores/StoreContext';
import {AppContent} from './src/components/AppContent';

export default function App() {
    return (
        <StoreProvider>
            <AppContent/>
        </StoreProvider>
    );
}
