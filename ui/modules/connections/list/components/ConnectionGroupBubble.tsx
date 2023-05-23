import { useDroppable } from '@dnd-kit/core';
import { shallow } from 'zustand/shallow';
import classnames from 'classnames';
import Color from 'color';
import { Button, Dropdown } from '$components';
import { AnyConnection } from 'common/models/Connection';
import { randomColor } from 'ui/utils/random';
import { ConnectionGroup } from '../queries';
import { useConnections } from '$module:connections';

interface OwnProps {
    theme: string;
    group: ConnectionGroup
    onActivate: (conn: AnyConnection) => void;
}

const renderOption = (theme: string, activeConnection: AnyConnection | null) => (option: AnyConnection) => {
    const bgColor = randomColor(theme + option.name);
    const textColor = Color(bgColor).isLight() ? '#000' : '#fff';

    const isActive = option.id === activeConnection?.id;

    return (
        <div className="flex items-center gap-4 select-none">
            <div
                className="relative h-10 aspect-square overflow-hidden flex-center text-xl font-semibold rounded-md shadow-xl"
                style={{
                    backgroundColor: randomColor(theme + option.name),
                    color: textColor
                }}
            >
                {option.name.charAt(0).toUpperCase()}
                {isActive && (
                    <span className="absolute bottom-0 h-1 rounded-full shadow-top border-t border-black/25 inset-x-0 bg-green-300"/>
                )}
            </div>
            <span className="text-foreground-default">{option.name}</span>
        </div>
    );
};

export function ConnectionGroupBubble({ theme, group, onActivate }: OwnProps) {
    const [activeConnections, currentConnection] = useConnections(state => [state.activeConnections, state.currentActiveConnection], shallow);
    const { setNodeRef } = useDroppable({
        id: group.id,
        data: { isGroup: true },
    });

    const focusedConnection = group.connections.find(conn => conn.id === currentConnection?.id);
    const isActive = activeConnections.some(activeConn => group.connections.some(conn => conn.id === activeConn.id));

    const bgColor = randomColor(theme + group.id);
    const darkenedBgColor = Color(bgColor).darken(0.3).toString();
    const textColor = Color(bgColor).isLight() ? '#000' : '#fff';

    const triggerClass = classnames('h-10 overflow-hidden', {
        'ring-[2px] ring-white/10': !!focusedConnection,
    });

    return (
        <Dropdown
            value={null}
            uniqueKey="id" labelKey="name" options={group.connections}
            hideSearch
            onChange={onActivate}
            containerRef={setNodeRef}
            optionsContainerClassName="translate-x-12 -translate-y-12"
            renderOption={renderOption(theme, currentConnection)}
        >
            <Dropdown.Trigger as={Button} scheme="transparent" shape="square" className={triggerClass}>
                <span
                    className="absolute inset-0 scale-[70%] translate-y-[2px] translate-x-[2px] bg-amber-500 pointer-events-none"
                    style={{ backgroundColor: darkenedBgColor }}
                />
                <span
                    className="absolute inset-0 scale-[70%] translate-y-[-2px] translate-x-[-2px] bg-amber-300 pointer-events-none overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                >
                    {isActive && (
                        <span className="absolute bottom-0 h-1 rounded-full shadow-top border-t border-black/25 inset-x-0 bg-green-300"/>
                    )}
                </span>
                <span className="absolute inset-0 translate-x-[-2px] translate-y-[4px] text-lg pointer-events-none" style={{ color: textColor }}>
                    {group.name.substring(0, 2).toUpperCase()}
                </span>
            </Dropdown.Trigger>
        </Dropdown>
    );
}
