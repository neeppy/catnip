import { useAtom } from 'jotai';
import Connections from '$module:connections';
import { themeState } from '$module:globals';
import { Header } from './Header';
import { MainScreen } from './MainScreen';
import { useEffect } from 'react';

export const App = () => {
    const [theme, setTheme] = useAtom(themeState);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);

        localStorage.setItem('theme', theme);

        window.theme = setTheme;
    }, [theme]);

    return (
        <div className="bg-accent h-screen w-screen flex flex-col">
            <Header/>
            <div className="flex h-full">
                <aside>
                    <Connections.List/>
                </aside>
                <main className="bg-surface-300 flex-1 rounded-tl-xl relative overflow-hidden flex-center">
                    <MainScreen/>
                </main>
            </div>
        </div>
    );
};
