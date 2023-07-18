import { MouseEvent } from 'react';
import classnames from 'classnames';

interface HeaderProps {
    width?: number;
    height?: number;
    className?: string;
    text: string;
    onClick?: (event: MouseEvent) => void;
    style?: any;
    active?: boolean;
}

export function Header({ text, width, height, className, style, active, onClick }: HeaderProps) {
    const headerClass = classnames('px-2 py-1 font-mono select-none text-xs flex-center', className, {
        'bg-gradient-to-b from-primary-600 to-primary-500 shadow-primary-700': active,
        'bg-surface-600 shadow-surface-800': !active,
    });

    return (
        <div
            className={headerClass}
            style={{ width: width ?? 'auto', height: height ?? 'auto', ...style }}
            onClick={onClick}
        >
            {text}
        </div>
    );
}
