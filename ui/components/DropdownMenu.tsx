import { ComponentProps, ComponentType } from "react";
import { Button } from "./Button";
import { Dropdown, DropdownProps } from "./Dropdown";

interface Item {
    key: string;
    icon: ComponentType;
    label: string;
    onClick: (item: Item) => void;
}

interface OwnProps<T> extends Omit<DropdownProps<T>, 'uniqueKey' | 'value' | 'onChange' | 'renderOption' | 'labelKey'> {
    label: any;
    triggerProps: ComponentProps<typeof Button>;
}

const getOption = (option: Item) => (
    <div className="flex items-center gap-2">
        <option.icon/>
        <span>{option.label}</span>
    </div>
);

export function DropdownMenu({
    label,
    triggerProps,
    ...dropdownProps
}: OwnProps<Item>) {
    return (
        <Dropdown uniqueKey="key" labelKey="label" renderOption={getOption} {...dropdownProps} onChange={handleItemClick}>
            <Dropdown.Trigger as={Button} {...triggerProps}>
                {label}
            </Dropdown.Trigger>
        </Dropdown>
    );

    function handleItemClick(item: Item) {
        item.onClick(item);
    }
}

export type { Item as DropdownMenuItem };
