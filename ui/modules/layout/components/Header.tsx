import { useAtom } from 'jotai';
import { VscChromeMinimize, VscChromeMaximize, VscChromeClose } from 'react-icons/vsc';
import { Button } from '$components';
import { appModeState } from '$module:globals';
import { TabList } from '$module:tabs';

export function Header() {
    const [isAdvancedMode, setAdvancedMode] = useAtom(appModeState);

    return (
        <header id="title-bar" className="flex pl-4 h-[2.5rem]">
            <TabList/>
            <Button scheme={isAdvancedMode ? 'primary' : 'secondary'} size="xs" className="border border-primary-500 ml-auto mr-4 self-center" onClick={toggleAppMode}>
                {isAdvancedMode ? 'Advanced View' : 'Simplified View'}
            </Button>
            {interop.platform === 'win32' && (
                <>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-[#fff1] ml-6"
                            onClick={interop.control.minimize}>
                        <VscChromeMinimize/>
                    </button>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-[#fff1]"
                            onClick={interop.control.maximize}>
                        <VscChromeMaximize/>
                    </button>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-red-500"
                            onClick={interop.control.close}>
                        <VscChromeClose/>
                    </button>
                </>
            )}
        </header>
    );

    function toggleAppMode() {
        setAdvancedMode(prev => !prev);
    }
}
