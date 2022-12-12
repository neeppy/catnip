import { forwardRef, Fragment, useId, useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import classnames from 'classnames';
import { Typography } from 'ui/components/atoms/Typography';
import { Combobox } from '@headlessui/react';
import { getInputClassName, getLabelClassName } from 'ui/components/atoms/Input';

const getDropdownClassName = cva('rounded-md animate-slide-fade-bottom overflow-hidden absolute top-20 inset-x-0 max-h-40 overflow-y-auto', {
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
    dropdownClassName?: string;
    optionClassName?: string;
    options: IOption[];
    label: string;
}

export interface IOption {
    label: string;
    value: string;
    className?: string;
}

type Props = OwnProps & VariantProps<typeof getInputClassName>;

export const Select = forwardRef<HTMLDivElement, Props>(({
    className,
    dropdownClassName,
    optionClassName,
    label,
    options = [],
    ...rest
}: Props, ref) => {
    const id = useId();
    const [value, setValue] = useState(null);
    const [query, setQuery] = useState('');

    let filteredOptions = options;

    if (query) {
        filteredOptions = options.filter(opt => {
            return opt.value.toLowerCase().includes(query.toLowerCase())
                || opt.label.toLowerCase().includes(query.toLowerCase());
        });
    }

    return (
        <Combobox value={value} onChange={setValue}>
            <div className="flex flex-col-reverse gap-1 relative" ref={ref}>
                <Combobox.Button as="div">
                    <Combobox.Input<'input', IOption>
                        onChange={(e: any) => setQuery(e.target.value)}
                        className={classnames('w-full', getInputClassName(rest))}
                        displayValue={value => value?.label}
                    />
                </Combobox.Button>
                <Typography as="label" intent="label" htmlFor={id} className={getLabelClassName(rest)}>
                    {label}
                </Typography>
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
