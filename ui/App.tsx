import Connections from 'ui/components/Connections';

const App = () => {
    return (
        <div className="bg-scene-100 h-screen grid grid-cols-layout grid-rows-layout">
            <header id="title-bar" className="h-8 col-span-2">

            </header>
            <Connections/>
            <main className="bg-scene-200 rounded-tl-lg relative overflow-hidden">
                <div id="modals-root"/>
            </main>
        </div>
    );
};

export default App;
