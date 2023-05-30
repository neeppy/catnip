import { useRef } from 'react';
import { Dropdown } from '$components';
import { useControlledEffect } from 'ui/hooks';
import { CellProps } from './useCellComponent';

interface OwnProps extends CellProps {}

export function EnumCell({ isEditable, column, currentValue, disableEditing, onChange }: OwnProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const options = column.restrictions.options.map(opt => ({ value: opt as string }));

    useControlledEffect(() => {
        setTimeout(() => {
            triggerRef.current?.click();
        }, 100);
    }, isEditable);

    if (!isEditable) {
        return (
            <span className="truncate">
                {String(currentValue)}
            </span>
        );
    }

    return (
        <Dropdown hideSearch={options.length < 6} uniqueKey="value" labelKey="value" className="h-full w-full" options={options} onChange={handleChange}>
            <Dropdown.Trigger ref={triggerRef} className="h-full w-full text-left overflow-hidden truncate" onBlur={handleBlur}>
                {String(currentValue)}
            </Dropdown.Trigger>
        </Dropdown>
    );

    function handleChange({ value }: { value: string }) {
        if (value !== currentValue) {
            onChange(value);
        }

        setTimeout(disableEditing, 200);
    }

    function handleBlur() {
        disableEditing();
    }
}
