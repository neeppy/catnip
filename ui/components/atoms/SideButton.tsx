import classnames from 'classnames';
import { PropsWithChildren } from 'react';
import { flexCenter } from 'ui/utils/classes';

export default function SideButton({ className, ...props }: PropsWithChildren<any>) {
    const btnClass = classnames([
        'rounded-md aspect-square',
        'transition-colors transition-200',
        flexCenter,
        className,
    ]);

    return (
        <button className={btnClass} {...props}/>
    );
}
