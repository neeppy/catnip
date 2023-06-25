import { useState } from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from './icons';

interface RadioOption {
    label: string;
    description?: string;
    value: string;
}

interface OwnProps {
    label?: string;
    className?: string;
    initialValue?: string | null;
    onChange?: (value: string) => void;
    options: RadioOption[];
}

export function RadioGroup({ label, initialValue, className, onChange, options }: OwnProps) {
    const [currentValue, setCurrentValue] = useState<string | null>(initialValue ?? null);

    return (
        <div className={className}>
            <label className="text-sm text-foreground-subtle">{label}</label>
            <div className="flex flex-col gap-2 mt-3">
                {options.map(option => (
                    <div key={option.value} className="flex gap-2 items-start cursor-pointer" onClick={() => handleChange(option.value)}>
                        <span className="text-xl">
                            {currentValue === option.value ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{option.label}</span>
                            {option.description && (
                                <span className="text-xs text-foreground-subtlest">{option.description}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    function handleChange(value: string) {
        setCurrentValue(value);
        onChange?.(value);
    }
}
