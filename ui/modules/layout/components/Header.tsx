import { PropsWithChildren } from 'react';
import { useAtom } from 'jotai';
import { FaCog, FaBars, VscChromeClose, VscChromeMaximize, VscChromeMinimize } from '$components/icons';
import { Button } from '$components';
import { appModeState, useModalRegistry, SettingsModal } from '$module:globals';
import { ConnectionDrawer } from '$module:connections/list/components/ConnectionDrawer';

export function Header({ children }: PropsWithChildren) {
    const [isAdvancedMode, setAdvancedMode] = useAtom(appModeState);
    const open = useModalRegistry(state => state.open);

    return (
        <header id="title-bar" className="flex h-[2.5rem] items-center">
            <button
                className="text-lg p-2 hover:bg-transparent-400 focus:bg-transparent-400 active:bg-transparent-300 h-full w-12 flex flex-center duration-200"
                onClick={() => open(ConnectionDrawer, { type: 'drawer', settings: { placement: 'left' } })}
            >
                <FaBars/>
            </button>
            {children}
            <div className="flex gap-4 items-center mr-4 ml-auto">
                <Button
                    scheme={isAdvancedMode ? 'primary' : 'secondary'} size="xs"
                    className={`border self-center ${isAdvancedMode ? 'border-primary' : 'border-secondary'}`}
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
