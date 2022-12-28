import { FaRegWindowMaximize, FaWindowClose, FaWindowMinimize } from 'react-icons/fa';

export function Header() {
    return (
        <header id="title-bar" className="col-span-2 flex justify-end">
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
