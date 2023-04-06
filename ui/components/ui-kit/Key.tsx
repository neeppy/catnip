import { PropsWithChildren } from 'react';
import classnames from 'classnames';

interface OwnProps {
    className?: string;
}

const classes = 'px-2 py-1.5 text-xs font-semibold text-scene-default bg-scene-600 border border-scene-700 rounded-lg';

export const Key = ({ className, children }: PropsWithChildren<OwnProps>) => (
    <kbd className={classnames(classes, className)}>
        {children}
    </kbd>
);
