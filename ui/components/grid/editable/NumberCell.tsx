import { KeyboardEvent, SyntheticEvent, useRef } from 'react';
import classnames from 'classnames';
import { CellProps } from './useCellComponent';

interface OwnProps extends CellProps {}

export function NumberCell({ isEditable, currentValue, disableEditing, onChange, className, inputRef }: OwnProps) {
    const shouldTriggerBlur = useRef<boolean>(true);
    const previewClass = classnames('truncate', {
        "empty:after:content-['null'] after:inset-0 after:absolute empty:after:px-3 empty:after:flex empty:after:items-center after:text-foreground-subtlest": currentValue === null
    });

    if (!isEditable) {
        return (
            <span className={previewClass}>
                {currentValue as string}
            </span>
        );
    }

    return (
        <input
            type="number"
            ref={inputRef}
            className={className}
            defaultValue={currentValue as string || ''}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
    );

    function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            shouldTriggerBlur.current = false;
            onChange(event.currentTarget.valueAsNumber);
            disableEditing();
        } else if (event.key === 'Escape') {
            disableEditing();
        }
    }

    function onBlur(event: SyntheticEvent<HTMLInputElement>) {
        if (shouldTriggerBlur.current) {
            if (event.currentTarget.value !== currentValue) {
                onChange(event.currentTarget.valueAsNumber);
            }

            disableEditing();
        }

        shouldTriggerBlur.current = true;
    }
}
