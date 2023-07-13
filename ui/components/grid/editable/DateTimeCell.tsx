import { useRef } from 'react';
import Calendar from 'react-calendar';
import classnames from 'classnames';
import { ConnectionDriver } from 'common/models/Connection';
import { format, isSameDay } from 'date-fns';
import { useControlledEffect } from 'ui/hooks';
import { Button, NumberSelect } from '$components';
import { useConnections } from '$module:connections';
import { CellProps } from './useCellComponent';
import './calendar.css';

interface OwnProps extends CellProps {}

const formats = {
    [ConnectionDriver.MySQL]: 'yyyy-MM-dd HH:mm:ss',
    [ConnectionDriver.SQLite]: 'yyyy-MM-dd HH:mm:ss',
};

export function DateTimeCell({ currentValue, isEditable, onChange, disableEditing }: OwnProps) {
    const calendarContainerRef = useRef<HTMLDivElement>(null);
    const driver = useConnections(state => state.currentActiveConnection!.driver);
    const previewClass = classnames('truncate', {
        "empty:after:content-['null'] after:inset-0 after:absolute empty:after:px-3 empty:after:flex empty:after:items-center after:text-foreground-subtlest": currentValue === null
    });

    const asDate = new Date(currentValue as string);

    useControlledEffect(() => {
        function onClickOutside(event: PointerEvent) {
            if (calendarContainerRef.current && !calendarContainerRef.current.contains(event.target as HTMLElement)) {
                disableEditing();
            }
        }

        window.addEventListener('pointerdown', onClickOutside);

        return () => window.removeEventListener('pointerdown', onClickOutside);
    }, isEditable);

    let displayValue = '';

    if (currentValue !== null && !isNaN(asDate.getTime())) {
        displayValue = format(asDate, formats[driver]);
    }

    return (
        <>
            <div className={previewClass}>
                {displayValue}
            </div>
            {isEditable && (
                <div ref={calendarContainerRef} className="absolute bg-surface-600/50 border border-surface-700 shadow-lg p-4 left-2 top-[calc(100%_+_0.5rem)] backdrop-blur-md rounded-md animate-fade-in-left">
                    <Calendar
                        value={asDate}
                        onChange={handleChange}
                        className="w-80"
                    />
                    <hr className="border-surface-700 my-2" />
                    <div className="flex">
                        <Button scheme="secondary" onClick={setToday}>Today</Button>
                        <div className="flex ml-16 items-center flex-1 gap-2">
                            <NumberSelect max={23} defaultValue={asDate.getHours()} onChange={onTimeChange('setHours')} />
                            <span>:</span>
                            <NumberSelect max={59} defaultValue={asDate.getMinutes()} onChange={onTimeChange('setMinutes')} />
                            <span>:</span>
                            <NumberSelect max={59} defaultValue={asDate.getSeconds()} onChange={onTimeChange('setSeconds')} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    function onTimeChange(timeUnitFn: 'setHours' | 'setMinutes' | 'setSeconds') {
        return function(value: number) {
            const date = new Date(asDate);

            date[timeUnitFn](value);

            const formatted = format(date, formats[driver]);

            onChange(formatted);
        };
    }

    function setToday() {
        const today = new Date();

        today.setHours(asDate.getHours());
        today.setMinutes(asDate.getMinutes());
        today.setSeconds(asDate.getSeconds());

        const formatted = format(today, formats[driver]);

        onChange(formatted);
    }

    function handleChange(value: any) {
        if (value && !isSameDay(value, asDate)) {
            const date = new Date(value);

            date.setHours(asDate.getHours());
            date.setMinutes(asDate.getMinutes());
            date.setSeconds(asDate.getSeconds());

            const formatted = format(date, formats[driver]);

            onChange(formatted);
        }
    }
}
