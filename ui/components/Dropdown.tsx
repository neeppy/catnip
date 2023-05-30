import { Fragment, MouseEvent, PropsWithChildren, ReactElement, Ref, useRef, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { equals } from 'ramda';
import classNames from 'classnames';
import { Input } from './Input';
import { cva, VariantProps } from 'class-variance-authority';

type StringKeys<T> = { [K in keyof T]-?: T[K] extends string ? K : never }[keyof T];

export interface DropdownProps<T> {
    uniqueKey: StringKeys<T>;
    labelKey: StringKeys<T>;
    options: T[];
    value?: T | null;
    disabled?: boolean;
    className?: string;
    optionsContainerClassName?: string;
    placement?: VariantProps<typeof getDropdownClassNames>['placement'];
    hideSearch?: boolean;
    labelSearch?: string;
    placeholderSearch?: string;
    containerRef?: Ref<any>;
    renderOption?: (option: T) => ReactElement | null;
    onChange?: (value: T) => void;
}

const getDropdownClassNames = cva([
    'absolute p-4 overflow-hidden flex flex-col z-[2000]',
    'max-h-[24rem] w-[20rem]',
    'bg-surface-300/90 border border-surface-700 backdrop-blur-sm shadow-lg rounded-xl',
], {
    variants: {
        placement: {
            topLeft: 'bottom-[100%] left-0 mb-2',
            topRight: 'bottom-[100%] right-0 mb-2',
            bottomLeft: 'top-[100%] left-0 mt-2',
            bottomRight: 'top-[100%] right-0 mt-2',
            rightTop: 'left-[100%] top-0 ml-2',
            rightBottom: 'left-[100%] bottom-0 ml-2',
            leftTop: 'right-[100%] top-0 mr-2',
            leftBottom: 'right-[100%] bottom-0 mr-2',
        }
    },
    defaultVariants: {
        placement: 'bottomLeft',
    }
});

export function Dropdown<T>({
    uniqueKey,
    labelKey,
    options,
    value,
    disabled,
    className,
    optionsContainerClassName,
    onChange,
    placement = 'bottomLeft',
    hideSearch,
    labelSearch = 'Search',
    placeholderSearch = 'Type to search...',
    renderOption,
    containerRef,
    children
}: PropsWithChildren<DropdownProps<T>>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [filterBy, setFilter] = useState('');

    const filteredOptions = filterBy ? options.filter(option => String(option[labelKey]).toLowerCase().includes(filterBy.toLowerCase())) : options;

    return (
        <Listbox value={value} onChange={onChange} by={equals} disabled={disabled}>
            <div ref={containerRef} className={classNames('relative', className)}>
                {children}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-out duration-300"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                >
                    <Listbox.Options className={getDropdownClassNames({ placement, className: optionsContainerClassName })}>
                        {({ open }) => {
                            if (open && !hideSearch && inputRef.current) {
                                inputRef.current.focus();
                            }

                            return (
                                <>
                                    {!hideSearch && (
                                        <div className="pt-2 pb-6">
                                            <Input
                                                ref={inputRef}
                                                size="sm"
                                                value={filterBy} onChange={e => setFilter(e.target.value)}
                                                label={labelSearch}
                                                placeholder={placeholderSearch}
                                            />
                                        </div>
                                    )}
                                    <div className="overflow-auto">
                                        {filteredOptions.length === 0 && (
                                            <div className="text-center">
                                                No results matching your filter.
                                            </div>
                                        )}
                                        {filteredOptions.map(option => (
                                            <Listbox.Option
                                                key={option[uniqueKey] as string}
                                                className={({ active, selected }) => classNames('px-2 py-3 text-sm rounded-md cursor-pointer truncate', {
                                                    'bg-primary-500/50': active,
                                                    'bg-primary-500/75 shadow-lg': selected,
                                                })}
                                                onMouseDown={stopPropagation}
                                                onPointerDown={stopPropagation}
                                                value={option}
                                            >
                                                {renderOption?.(option) || option[labelKey] as string}
                                            </Listbox.Option>
                                        ))}
                                    </div>
                                </>
                            );
                        }}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );

    function stopPropagation(event: MouseEvent) {
        event.stopPropagation();
    }
}

Dropdown.Trigger = Listbox.Button;
