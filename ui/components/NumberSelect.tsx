import { useState } from 'react';
import { useBoolean, useClickOutside } from 'ui/hooks';
import { FaChevronUp, FaChevronDown } from '$components/icons';
import classnames from 'classnames';
import { fnMerge } from 'ui/utils/functions';

interface OwnProps {
    min?: number;
    max: number;
    defaultValue: number;
    onChange: (value: number) => void;
}

export function NumberSelect({ defaultValue, min = 0, max, onChange }: OwnProps) {
    const { boolean: isExpanded, on: expand, off: collapse } = useBoolean(false);
    const [currentValue, setCurrentValue] = useState(defaultValue || min || 0);
    const containerRef = useClickOutside<HTMLDivElement>(collapse);

    const listClass = classnames([
        'list-none flex flex-col absolute inset-x-0 top-[50%] translate-y-[-50%] overflow-y-auto bg-surface-700 rounded-sm transition-all',
    ], {
        'max-h-48 border border-surface-800 shadow-lg': isExpanded,
        'max-h-0': !isExpanded,
    });

    const optionClass = (isActive: boolean) => classnames('transition-colors', {
        'bg-transparent-200': isActive,
        'hover:bg-transparent-300 focus-within:bg-transparent-300': !isActive,
    });

    return (
        <div className="relative" ref={containerRef}>
            <button className="flex gap-2 items-center bg-transparent-400 hover:bg-transparent-300 active:bg-transparent-200 focus:bg-transparent-200 px-2 py-1" onClick={expand}>
                <span>{String(currentValue).padStart(2, '0')}</span>
                <span className="flex flex-col">
                    <FaChevronUp className="text-xs"/>
                    <FaChevronDown className="text-xs"/>
                </span>
            </button>
            <ul className={listClass}>
                {Array.from({ length: max - min + 1 }).fill(0).map((el, idx) => (
                    <li key={idx} className={optionClass(idx + min === currentValue)}>
                        <button className="p-2" onClick={fnMerge(() => setCurrentValue(idx + min), collapse, () => onChange(idx + min))}>
                            {String(idx + min).padStart(2, '0')}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
