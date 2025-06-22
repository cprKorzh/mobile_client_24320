import React from 'react';
import {StoreProvider} from './src/stores/StoreContext';
import {ThemeProvider} from './src/contexts/ThemeContext';
import {AppContent} from './src/components/AppContent';

export default function App() {
    return (
        <ThemeProvider>
            <StoreProvider>
                <AppContent/>
            </StoreProvider>
        </ThemeProvider>
    );
}
