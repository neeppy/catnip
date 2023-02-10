import { forwardRef, Fragment, useEffect, useId, useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import classnames from 'classnames';
import { Typography } from 'ui/components/ui-kit/Typography';
import { Combobox } from '@headlessui/react';
import { getInputClassName, getLabelClassName } from 'ui/components/ui-kit/Input';

const getDropdownClassName = cva('rounded-md animate-slide-fade-bottom overflow-hidden absolute top-[4.75rem] inset-x-0 max-h-40 overflow-y-auto', {
    variants: {
        variant: {
            default: 'bg-scene-500 shadow-lg shadow-scene-200'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

const getOptionClassName = cva('cursor-pointer', {
    variants: {
        variant: {
            default: 'text-scene-default text-xs py-1'
        },
        size: {
            sm: 'px-2 py-1',
            md: 'px-4 py-3'
        },
        active: {
            true: 'bg-scene-600',
            false: null
        },
        selected: {
            true: 'bg-scene-600 font-bold',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md'
    }
});

interface OwnProps {
    className?: string;
    containerClassName?: string;
    dropdownClassName?: string;
    inputClassName?: string;
    optionClassName?: string;
    options: IOption[];
    label?: string;
    placeholder?: string;
    value?: any;
    onChange?: (value: any) => unknown;
}

export interface IOption {
    label: string;
    value: string;
    className?: string;
}

type Props = OwnProps & VariantProps<typeof getInputClassName>;

export const Select = forwardRef<HTMLDivElement, Props>(({
    value,
    onChange,
    className,
    containerClassName,
    dropdownClassName,
    inputClassName,
    optionClassName,
    label,
    placeholder,
    options = [],
    ...rest
}: Props, ref) => {
    const id = useId();
    const [currentValue, setCurrentValue] = useState(value ?? null);
    const [query, setQuery] = useState('');

    let filteredOptions = options;

    if (query) {
        filteredOptions = options.filter(opt => {
            return opt.value.toLowerCase().includes(query.toLowerCase())
                || opt.label.toLowerCase().includes(query.toLowerCase());
        });
    }

    useEffect(() => {
        if (value !== currentValue) {
            const option = options.find(opt => opt.value === value);

            setCurrentValue(option ?? null);
        }
    }, [value]);

    function handleChange(newValue: IOption) {
        setCurrentValue(newValue);
        onChange?.(newValue.value);
    }

    return (
        <Combobox value={currentValue} onChange={handleChange}>
            <div className={classnames(containerClassName, 'flex flex-col-reverse gap-1 relative')} ref={ref}>
                <Combobox.Button as="div">
                    <Combobox.Input<'input', IOption>
                        placeholder={placeholder}
                        onChange={(e: any) => setQuery(e.target.value)}
                        className={classnames(inputClassName, 'w-full', getInputClassName(rest))}
                        displayValue={value => value?.label}
                    />
                </Combobox.Button>
                {label && (
                    <Typography as="label" intent="label" htmlFor={id} className={getLabelClassName(rest)}>
                        {label}
                    </Typography>
                )}
                <Combobox.Options className={classnames(dropdownClassName, getDropdownClassName(rest))}>
                    {filteredOptions.map(option => (
                        <Combobox.Option key={option.value} value={option} as={Fragment}>
                            {({ active, selected }) => (
                                <li className={classnames(optionClassName, getOptionClassName({
                                    ...rest,
                                    active,
                                    selected
                                }))}>
                                    {option.label}
                                </li>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
});
