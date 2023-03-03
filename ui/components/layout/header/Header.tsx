import { VscChromeMinimize, VscChromeMaximize, VscChromeClose } from 'react-icons/vsc';
import { useAtom } from 'jotai';
import { Button } from 'ui/components/ui-kit';
import { appModeState } from 'ui/state/global';

export function Header() {
    const [isAdvancedMode, setAdvancedMode] = useAtom(appModeState);

    function toggleAppMode() {
        setAdvancedMode(prev => !prev);
    }

    return (
        <header id="title-bar" className="flex justify-end h-[2.5rem]">
            <Button scheme={isAdvancedMode ? 'accent' : 'ghost-accent'} size="sm" className="px-2 text-xs self-center" onClick={toggleAppMode}>
                {isAdvancedMode ? 'Advanced View' : 'Simplified View'}
            </Button>
            {interop.platform === 'win32' && (
                <>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-[#fff1] ml-10" onClick={interop.control.minimize}>
                        <VscChromeMinimize/>
                    </button>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-[#fff1]" onClick={interop.control.maximize}>
                        <VscChromeMaximize/>
                    </button>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-red-500" onClick={interop.control.close}>
                        <VscChromeClose/>
                    </button>
                </>
            )}
        </header>
    );
}
