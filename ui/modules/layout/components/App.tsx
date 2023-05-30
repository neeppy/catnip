import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeState } from '$module:globals';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainScreen } from './MainScreen';

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
            <div className="flex h-full overflow-hidden">
                <Sidebar/>
                <main className="bg-surface-300 flex-1 rounded-tl-xl relative overflow-hidden flex-center">
                    <MainScreen/>
                </main>
            </div>
        </div>
    );
};
