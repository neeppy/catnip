import { useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import classnames from 'classnames';
import { format, isSameDay } from 'date-fns';
import { ConnectionDriver } from 'common/models/Connection';
import { Button, NumberSelect } from '$components';
import { useConnections } from '$module:connections';
import { EditableCellProps, ReadOnlyCellProps } from './types';
import './calendar.css';
import { ColumnType } from 'common/models/Database';

const formats = {
    [ColumnType.Date]: {
        [ConnectionDriver.MySQL]: 'yyyy-MM-dd 00:00:00',
        [ConnectionDriver.SQLite]: 'yyyy-MM-dd 00:00:00',
    },
    [ColumnType.DateTime]: {
        [ConnectionDriver.MySQL]: 'yyyy-MM-dd HH:mm:ss',
        [ConnectionDriver.SQLite]: 'yyyy-MM-dd HH:mm:ss',
    },
} as const;

const DATE_DISPLAY_FORMAT = 'dd MMM yyyy';
const TIME_DISPLAY_FORMAT = 'HH:mm:ss';

export const DateTimeCell = {
    Read({ column, currentValue }: ReadOnlyCellProps) {
        const hasTimeComponent = column.type === ColumnType.DateTime;
        const asDate = new Date(currentValue as string);

        let displayValue = '';
        let timeDisplay = '';

        if (currentValue !== null && !isNaN(asDate.getTime())) {
            displayValue = format(asDate, DATE_DISPLAY_FORMAT);
            timeDisplay = format(asDate, TIME_DISPLAY_FORMAT);
        }

        const previewClass = classnames({
            "empty:after:content-['null'] after:inset-0 after:absolute empty:after:px-3 empty:after:flex empty:after:items-center after:text-foreground-subtlest": currentValue === null,
            'flex flex-col text-xs': hasTimeComponent,
        });

        return (
            <div className={previewClass}>
                <span>{displayValue}</span>
                {hasTimeComponent && currentValue !== null && (
                    <span>{timeDisplay}</span>
                )}
            </div>
        );
    },
    Write({ column, currentValue, onChange, disableEditing }: EditableCellProps) {
        const calendarContainerRef = useRef<HTMLDivElement>(null);
        const driver = useConnections(state => state.currentActiveConnection!.driver);
        const hasTimeComponent = column.type === ColumnType.DateTime;
        const serializationFormat = formats[column.type as keyof typeof formats][driver];
        const previewClass = classnames({
            "empty:after:content-['null'] after:inset-0 after:absolute empty:after:px-3 empty:after:flex empty:after:items-center after:text-foreground-subtlest": currentValue === null,
            'flex flex-col text-xs': hasTimeComponent,
        });

        const asDate = new Date(currentValue as string);

        useEffect(() => {
            function onClickOutside(event: PointerEvent) {
                if (calendarContainerRef.current && !calendarContainerRef.current.contains(event.target as HTMLElement)) {
                    disableEditing();
                }
            }

            window.addEventListener('pointerdown', onClickOutside);

            return () => window.removeEventListener('pointerdown', onClickOutside);
        }, []);

        let displayValue = '';
        let timeDisplay = '';

        if (currentValue !== null && !isNaN(asDate.getTime())) {
            displayValue = format(asDate, DATE_DISPLAY_FORMAT);
            timeDisplay = format(asDate, TIME_DISPLAY_FORMAT);
        }

        return (
            <>
                <div className={previewClass}>
                    <span>{displayValue}</span>
                    {hasTimeComponent && currentValue !== null && (
                        <span>{timeDisplay}</span>
                    )}
                </div>
                <div ref={calendarContainerRef} className="absolute bg-surface-600/50 z-10 border border-surface-700 shadow-lg p-4 left-2 top-[calc(100%_+_0.5rem)] backdrop-blur-md rounded-md animate-fade-in-bottom">
                    <Calendar
                        value={asDate}
                        onChange={handleChange}
                        className="w-80"
                    />
                    <hr className="border-surface-700 my-2" />
                    <div className="flex">
                        <Button scheme="secondary" onClick={setToday}>Today</Button>
                        {hasTimeComponent && (
                            <div className="flex ml-16 items-center flex-1 gap-2">
                                <NumberSelect max={23} defaultValue={asDate.getHours()} onChange={onTimeChange('setHours')} />
                                <span>:</span>
                                <NumberSelect max={59} defaultValue={asDate.getMinutes()} onChange={onTimeChange('setMinutes')} />
                                <span>:</span>
                                <NumberSelect max={59} defaultValue={asDate.getSeconds()} onChange={onTimeChange('setSeconds')} />
                            </div>
                        )}
                    </div>
                </div>
            </>
        );

        function onTimeChange(timeUnitFn: 'setHours' | 'setMinutes' | 'setSeconds') {
            return function(value: number) {
                const date = new Date(asDate);

                date[timeUnitFn](value);

                const formatted = format(date, serializationFormat);

                onChange(formatted);
            };
        }

        function setToday() {
            const today = new Date();

            today.setHours(asDate.getHours());
            today.setMinutes(asDate.getMinutes());
            today.setSeconds(asDate.getSeconds());

            const formatted = format(today, serializationFormat);

            onChange(formatted);
        }

        function handleChange(value: any) {
            if (value && !isSameDay(value, asDate)) {
                const date = new Date(value);

                date.setHours(asDate.getHours());
                date.setMinutes(asDate.getMinutes());
                date.setSeconds(asDate.getSeconds());

                const formatted = format(date, serializationFormat);

                onChange(formatted);
            }
        }
    },
};
