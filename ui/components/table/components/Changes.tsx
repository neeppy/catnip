import { useBoolean } from 'ui/hooks';
import { Button, Collapse } from '$components';
import { BsArrowRight, FaChevronUp, MdSend } from '$components/icons';
import { CellChange } from '..';

interface OwnProps {
    changes: CellChange[];
    onPersist?: () => void;
}

export function Changes({ changes, onPersist }: OwnProps) {
    const { boolean: isExpanded, toggle } = useBoolean(false);

    const grouped = changes.reduce<Record<number, CellChange[]>>((temp, change) => {
        if (!temp.hasOwnProperty(change.rowIndex + 1)) {
            temp[change.rowIndex + 1] = [change];
        } else {
            temp[change.rowIndex + 1].push(change);
        }

        return temp;
    }, {});

    return (
        <>
            {isExpanded && (
                <div className="absolute animate-fade-in-bottom bottom-[100%] inset-x-0 bg-surface-400 flex flex-col gap-2 p-2">
                    {Object.entries(grouped).map(([rowIndex, rowChanges]) => (
                        <Collapse title={`Row ${rowIndex}`} key={`row-${rowIndex}`}>
                            <div className="flex flex-col gap-2 px-4">
                                {rowChanges.map(change => (
                                    <div key={change.column} className="flex gap-2 text-xs items-center">
                                        <code className="mr-auto">{change.column}</code>
                                        <code className="bg-orange-600 rounded-md font-semibold border border-orange-800 px-2 line-through">{String(change.oldValue)}</code>
                                        <BsArrowRight className="text-base"/>
                                        <code className="bg-green-600 rounded-md font-semibold border border-green-800 px-2">{String(change.newValue)}</code>
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    ))}
                </div>
            )}
            <div className="bg-surface-400 w-[32rem] h-12 flex items-center gap-2 p-2 rounded-sm shadow-lg">
                <Button scheme="transparent" onClick={toggle}>
                    <FaChevronUp className={`transition-transform ${isExpanded ? 'rotate-0' : 'rotate-90'}`} />
                </Button>
                <span className="text-foreground-default">
                    {changes.length} {changes.length === 1 ? 'change' : 'changes'} made.
                </span>
                <Button className="ml-auto" onClick={onPersist}>
                    <MdSend/>
                </Button>
            </div>
        </>
    );
}
