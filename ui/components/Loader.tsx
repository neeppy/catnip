import classnames from "classnames";

interface LoaderProps {
    className?: string;
    bubbleClassName?: string;
    size?: number | string;
}

export function Loader({ className, bubbleClassName, size = 16 }: LoaderProps) {
    const bubbleStyle = {
        width: size,
        height: size,
    };

    const containerClass = classnames('inline-flex-center gap-1', className);
    const bubbleClass = classnames('animate-scale-loop rounded-full bg-transparent-200', bubbleClassName);

    return (
        <div className={containerClass}>
            <span className={bubbleClass} style={bubbleStyle} />
            <span className={classnames(bubbleClass, 'animation-delay-100')} style={bubbleStyle} />
            <span className={classnames(bubbleClass, 'animation-delay-200')} style={bubbleStyle} />
        </div>
    );
}
