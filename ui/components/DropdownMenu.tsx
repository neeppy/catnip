import { ComponentProps, ComponentType } from "react";
import { Button } from "./Button";
import { Dropdown, DropdownProps } from "./Dropdown";
import { Typography } from './Typography';

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
        <span className="text-foreground-default text-lg">
            <option.icon />
        </span>
        <Typography>{option.label}</Typography>
    </div>
);

export function DropdownMenu({
    label,
    triggerProps,
    ...dropdownProps
}: OwnProps<Item>) {
    return (
        <Dropdown value={null} hideSearch uniqueKey="key" labelKey="label" renderOption={getOption} {...dropdownProps} onChange={handleItemClick}>
            <Dropdown.Trigger as={Button} {...triggerProps}>
                {label}
            </Dropdown.Trigger>
        </Dropdown>
    );

    function handleItemClick(item: Item) {
        item.onClick(item);
    }
}
