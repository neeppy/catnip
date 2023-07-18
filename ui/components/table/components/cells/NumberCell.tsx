import { KeyboardEvent, SyntheticEvent, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { EditableCellProps, ReadOnlyCellProps } from './types';

export const NumberCell = {
    Read({ currentValue }: ReadOnlyCellProps) {
        const previewClass = classnames('truncate', {
            "empty:after:content-['null'] empty:after:inset-0 empty:after:absolute empty:after:px-3 empty:after:flex empty:after:items-center after:text-foreground-subtlest": currentValue === null
        });

        return (
            <span className={previewClass}>
                {currentValue as string}
            </span>
        );
    },
    Write({ currentValue, onChange, disableEditing }: EditableCellProps) {
        const shouldTriggerBlur = useRef<boolean>(true);
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }, []);

        return (
            <input
                ref={inputRef}
                type="number"
                className="absolute px-2 py-1 inset-0 bg-transparent"
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
    },
};
