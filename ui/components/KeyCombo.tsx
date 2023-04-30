import { Fragment, ReactNode } from 'react';
import { Key } from './Key';

interface OwnProps {
    description?: string;
    keys: Array<string | ReactNode>;
}

export function KeyCombo({ description, keys }: OwnProps) {
    return (
        <div className="flex gap-2 text-foreground-default items-center select-none">
            {description && (
                <span className="text-xs">{description}</span>
            )}
            {keys.map((key, idx) => (
                <Fragment key={idx}>
                    <Key>{key}</Key>
                    {idx !== keys.length - 1 ? '+' : ''}
                </Fragment>
            ))}
        </div>
    );
}
