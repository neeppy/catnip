import classnames from 'classnames';
import { useAtom } from 'jotai';
import { Connections } from '$module:connections';
import { Button } from '$components';
import { FaChevronRight } from '$components/icons';
import { sidebarExpansionState } from '../state';

export function Sidebar() {
    const [isExpanded, toggleExpansion] = useAtom(sidebarExpansionState);

    const sidebarClass = classnames('flex flex-col transition-all', {
        'w-12': !isExpanded,
        'w-64': isExpanded,
    });

    const chevronClass = classnames('transition-transform', {
        'rotate-180': isExpanded,
    });

    return (
        <aside className={sidebarClass}>
            <Connections />
            <Button scheme="transparent" shape="flat" className="flex-center h-10" onClick={() => toggleExpansion(!isExpanded)}>
                <FaChevronRight className={chevronClass} />
            </Button>
        </aside>
    );
}
