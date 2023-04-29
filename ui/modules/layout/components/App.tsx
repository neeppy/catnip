import Connections from '$module:connections';
import { Header } from './Header';
import { MainScreen } from './MainScreen';

export const App = () => (
    <div className="bg-scene-100 h-screen w-screen flex flex-col">
        <Header/>
        <main className="bg-scene-200 flex-1 relative overflow-hidden">
            <MainScreen/>
        </main>
        <footer>
            <Connections.List/>
        </footer>
    </div>
);
