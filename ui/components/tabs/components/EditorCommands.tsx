import { BiCommand } from 'react-icons/bi';
import { BsShift } from 'react-icons/bs';
import { KeyCombo } from 'ui-kit';

type Platform = 'win32' | 'darwin';

const commands = [
    {
        description: 'Run all script',
        keys: {
            win32: ['Ctrl', 'Enter'],
            darwin: [<BiCommand/>, 'Enter']
        },
    },
    {
        description: 'Run current query',
        keys: {
            win32: ['Ctrl', 'Shift', 'Enter'],
            darwin: [<BiCommand/>, <BsShift/>, 'Enter']
        },
    },
];

export const EditorCommands = () => (
    <div className="absolute bottom-4 right-4 flex flex-col-reverse items-end gap-2">
        {commands.slice().reverse().map(command => (
            <KeyCombo
                key={command.description}
                description={command.description}
                keys={command.keys[interop.platform as Platform]}
            />
        ))}
    </div>
);
