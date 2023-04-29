import { useAtomValue } from 'jotai';
import Connections from '$module:connections';
import { themeState } from '$module:globals';
import { Header } from './Header';
import { MainScreen } from './MainScreen';
import { useEffect } from 'react';

export const App = () => {
    const theme = useAtomValue(themeState);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, []);

    return (
        <div className="bg-scene-100 h-screen w-screen flex flex-col">
            <Header/>
            <main className="bg-scene-200 flex-1 relative overflow-hidden flex-center">
                <MainScreen/>
            </main>
            <footer>
                <Connections.List/>
            </footer>
        </div>
    );
};
