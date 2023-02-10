import { FaRegWindowMaximize, FaWindowClose, FaWindowMinimize } from 'react-icons/fa';
import { Button } from 'ui/components/ui-kit';
import { useAtom } from 'jotai';
import { appModeState } from 'ui/state/global';

export function Header() {
    const [isAdvancedMode, setAdvancedMode] = useAtom(appModeState);

    function toggleAppMode() {
        setAdvancedMode(prev => !prev);
    }

    return (
        <header id="title-bar" className="col-span-2 flex justify-end">
            <Button scheme={isAdvancedMode ? 'accent' : 'ghost-accent'} size="sm" className="px-2 text-xs self-center mr-20" onClick={toggleAppMode}>
                {isAdvancedMode ? 'Advanced View' : 'Simplified View'}
            </Button>
            <button className="text-scene-default flex-center aspect-square h-full hover:bg-scene-600" onClick={interop.control.minimize}>
                <FaWindowMinimize/>
            </button>
            <button className="text-scene-default flex-center aspect-square h-full hover:bg-scene-600" onClick={interop.control.maximize}>
                <FaRegWindowMaximize/>
            </button>
            <button className="text-scene-default flex-center aspect-square h-full hover:bg-red-800" onClick={interop.control.close}>
                <FaWindowClose/>
            </button>
        </header>
    );
}
