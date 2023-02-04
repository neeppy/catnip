import Connections from 'ui/components/Connections';
import { Button } from 'ui/components/ui-kit';
import Header from 'ui/components/layout/header';
import { DataTable } from 'ui-kit/DataTable';

function connect() {

}

const rows = [
    {
        firstName: 'Cosmin',
        lastName: 'Stoica',
        age: 44,
        createdAt: new Date(),
    },
];

const App = () => {
    return (
        <div className="bg-scene-100 h-screen grid grid-cols-layout grid-rows-layout">
            <Header/>
            <Connections/>
            <main className="bg-scene-200 rounded-tl-lg relative overflow-hidden p-5 flex items-end justify-end">
                <div className="h-full flex-1">
                    <DataTable rows={rows} />
                </div>
                <Button onClick={connect}>
                    Test Button
                </Button>
                <div id="modals-root"/>
            </main>
        </div>
    );
};

export default App;
