import { PropsWithChildren } from 'react';
import classnames from 'classnames';

interface OwnProps {
    className?: string;
}

export function SectionTitle({ className, children }: PropsWithChildren<OwnProps>) {
    return (
        <div className={classnames(className, 'col-span-4 text-foreground-subtlest text-sm font-bold flex items-center gap-3')}>
            <div className="w-3 border-b border-transparent-300" />
            {children}
            <div className="flex-1 border-b border-transparent-300" />
        </div>
    );
}
