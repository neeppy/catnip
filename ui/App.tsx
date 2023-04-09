import Connections from 'ui/components/connections';
import Header from 'ui/components/layout/header';
import MainScreen from 'ui/components/screen/MainScreen';

const App = () => {
    return (
        <div className="bg-scene-100 h-screen w-screen flex flex-col">
            <Header/>
            <main className="bg-scene-200 flex-1 relative overflow-hidden">
                <MainScreen/>
                <div id="modals-root"/>
            </main>
            <Connections/>
        </div>
    );
};

export default App;
