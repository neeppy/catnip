import { PropsWithChildren } from 'react';
import classnames from 'classnames';

interface OwnProps {
    className?: string;
}

const classes = 'px-2 py-1.5 text-xs font-semibold text-foreground-default bg-surface-700 border border-surface-800 rounded-lg';

export const Key = ({ className, children }: PropsWithChildren<OwnProps>) => (
    <kbd className={classnames(classes, className)}>
        {children}
    </kbd>
);
