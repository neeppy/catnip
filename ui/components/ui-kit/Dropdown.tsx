import { cloneElement, ElementType, MouseEvent, ReactElement, useId } from 'react';
import { Item, ItemParams, Menu, Separator, Submenu, useContextMenu } from 'react-contexify';

type Separator = 'separator';

interface Option<T = any> {
    key: string;
    icon?: ElementType,
    label: string;
    value?: T;
    onClick: (params: ItemParams, value?: T) => void;
}

interface Submenu {
    key: string;
    icon?: ElementType,
    label: string;
    options: Array<Option | Separator | Submenu>;
}

export type OptionType = Option | Separator | Submenu;

interface OwnProps {
    id?: string;
    label?: string;
    dropdownData?: any;
    trigger: ReactElement;
    options?: OptionType[];
}

export function Dropdown({
    id,
    label,
    dropdownData,
    trigger: rawTrigger,
    options = []
}: OwnProps) {
    const defaultId = useId();
    const menuId = useId();
    const { show } = useContextMenu({ id: menuId });

    const onClick = (event: MouseEvent) => show({ event, props: dropdownData });

    const trigger = cloneElement(rawTrigger, { onClick });

    return (
        <>
            {label && <label htmlFor={id ?? defaultId}>{label}</label>}
            {trigger}
            <Menu theme="dark" id={menuId} animation="scale">
                {options.map(renderOption)}
            </Menu>
        </>
    );
}

const renderLabel = (option: Option | Submenu) => (
    <span className="inline-flex gap-3 items-center">
        {option.icon && <option.icon />}
        {option.label}
    </span>
);

const renderOption = (option: OptionType, idx: number): ReactElement => {
    if (option === 'separator') {
        return <Separator key={idx} />;
    }

    if ('options' in option) {
        return (
            <Submenu key={option.key} label={renderLabel(option)}>
                {option.options.map(renderOption)}
            </Submenu>
        );
    }

    return (
        <Item key={option.key} onClick={params => option.onClick(params, option.value)}>
            {renderLabel(option)}
        </Item>
    );
};
