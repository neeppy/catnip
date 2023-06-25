import { useControlledEffect, useSettings } from 'ui/hooks';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainScreen } from './MainScreen';

export const App = () => {
    const { settings, isFetched, isFetching } = useSettings();
    
    useControlledEffect(() => {
        document.body.setAttribute('data-theme', settings.appearance.theme);
    }, !isFetching);

    useControlledEffect(() => {
        console.debug('[App] Settings Loaded', settings);

        postMessage({ payload: 'removeLoading' }, '*');
    }, isFetched);

    if (!isFetched) {
        return null;
    }

    return (
        <div className="bg-accent h-screen w-screen flex flex-col">
            <Header />
            <div className="flex h-full overflow-hidden">
                <Sidebar/>
                <main className="bg-surface-300 flex-1 rounded-tl-xl relative overflow-hidden flex-center">
                    <MainScreen/>
                </main>
            </div>
        </div>
    );
};
