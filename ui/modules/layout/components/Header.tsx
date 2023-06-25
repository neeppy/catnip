import { useAtom } from 'jotai';
import { FaCog, VscChromeClose, VscChromeMaximize, VscChromeMinimize } from '$components/icons';
import { Button } from '$components';
import { appModeState, useModalRegistry, SettingsModal } from '$module:globals';
import { ConnectionTabs } from '$module:tabs';

export function Header() {
    const [isAdvancedMode, setAdvancedMode] = useAtom(appModeState);
    const open = useModalRegistry(state => state.open);

    return (
        <header id="title-bar" className="flex pl-4 h-[2.5rem]">
            <ConnectionTabs/>
            <div className="flex gap-4 items-center mr-4 ml-auto">
                <Button
                    scheme={isAdvancedMode ? 'primary' : 'secondary'} size="xs"
                    className={`border self-center ${isAdvancedMode ? 'border-primary-500' : 'border-secondary-500'}`}
                    onClick={toggleAppMode}
                >
                    {isAdvancedMode ? 'Advanced View' : 'Simplified View'}
                </Button>
                <Button scheme="transparent" onClick={() => open(SettingsModal)}>
                    <FaCog/>
                </Button>
            </div>
            {interop.platform === 'win32' && (
                <>
                    <button className="text-foreground-default flex-center aspect-square h-full hover:bg-[#fff1] ml-6"
                            onClick={interop.control.minimize}>
                        <VscChromeMinimize/>
                    </button>
                    <button className="text-foreground-default flex-center aspect-square h-full hover:bg-[#fff1]"
                            onClick={interop.control.maximize}>
                        <VscChromeMaximize/>
                    </button>
                    <button className="text-foreground-default flex-center aspect-square h-full hover:bg-red-500"
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
