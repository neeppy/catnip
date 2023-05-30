import { KeyboardEvent, SyntheticEvent, useRef } from 'react';
import { CellProps } from './useCellComponent';
import classnames from 'classnames';

interface OwnProps extends CellProps {}

export function StringCell({ isEditable, currentValue, disableEditing, onChange, className, inputRef }: OwnProps) {
    const shouldTriggerBlur = useRef<boolean>(true);
    const previewClass = classnames('truncate', {
        "empty:after:content-['null'] empty:after:inset-0 empty:after:absolute empty:after:px-3 empty:after:flex empty:after:items-center after:text-foreground-subtlest": currentValue === null
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
            onChange(event.currentTarget.value);
            disableEditing();
        } else if (event.key === 'Escape') {
            disableEditing();
        }
    }

    function onBlur(event: SyntheticEvent<HTMLInputElement>) {
        if (shouldTriggerBlur.current) {
            if (event.currentTarget.value !== currentValue) {
                onChange(event.currentTarget.value);
            }

            disableEditing();
        }

        shouldTriggerBlur.current = true;
    }
}
