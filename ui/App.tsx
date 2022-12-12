import Connections from 'ui/components/Connections';
import { Button } from 'ui/components/atoms';
import { ConnectionDriver } from 'common/models/Connection';

function connect() {
    return window.interop.databases.openConnection({
        id: 1,
        name: 'test',
        driver: ConnectionDriver.MySQL,
        hostname: '127.0.0.1',
        port: 22,
        username: 'test',
        password: 'test',
        sshTunnelConfiguration: null
    });
}

const App = () => {
    return (
        <div className="bg-scene-100 h-screen grid grid-cols-layout grid-rows-layout">
            <header id="title-bar" className="h-8 col-span-2">

            </header>
            <Connections/>
            <main className="bg-scene-200 rounded-tl-lg relative overflow-hidden p-5">
                <Button onClick={connect}>
                    Connect to CloudMargin
                </Button>
                <div id="modals-root"/>
            </main>
        </div>
    );
};

export default App;
