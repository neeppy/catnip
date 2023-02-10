import Connections from 'ui/components/Connections';
import Header from 'ui/components/layout/header';
import MainScreen from 'ui/components/screen/MainScreen';

const App = () => {
    return (
        <div className="bg-scene-100 h-screen w-screen grid grid-cols-layout grid-rows-layout">
            <Header/>
            <Connections/>
            <main className="bg-scene-200 rounded-tl-lg relative overflow-hidden">
                <MainScreen/>
                <div id="modals-root"/>
            </main>
        </div>
    );
};

export default App;
