import { FocusEvent, useEffect, useRef } from 'react';
import { Dropdown } from '$components';
import { EditableCellProps, ReadOnlyCellProps } from './types';

let timeoutRef: any = null;

export const EnumCell = {
    Read: ({ currentValue }: ReadOnlyCellProps) => (
        <span className="truncate">
            {String(currentValue)}
        </span>
    ),
    Write({ column, currentValue, onChange, disableEditing }: EditableCellProps) {
        const triggerRef = useRef<HTMLButtonElement>(null);
        const options = column.details?.options?.map(opt => ({ value: opt as string })) ?? [];

        useEffect(() => {
            clearTimeout(timeoutRef);

            timeoutRef = setTimeout(() => triggerRef.current?.click(), 70);
        }, []);

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

        function handleBlur(event: FocusEvent) {
            event.stopPropagation();
            disableEditing();
        }
    },
};
