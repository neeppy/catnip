import { FocusEvent, forwardRef, HTMLProps, useId } from 'react';
import { Typography } from 'ui/components/ui-kit/Typography';
import { cva, VariantProps } from 'class-variance-authority';
import classnames from 'classnames';

export const getInputClassName = cva('peer rounded-md transition-all duration-500', {
    variants: {
        variant: {
            default: 'bg-scene-400 focus:bg-scene-700 hover:bg-scene-500 text-scene-default shadow-sm shadow-scene-200 text-sm',
        },
        size: {
            sm: 'px-2',
            md: 'px-3 py-2'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'md'
    }
});

export const getLabelClassName = cva('', {
    variants: {
        size: {
            sm: 'text-2xs',
            md: 'text-xs'
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

interface OwnProps {
    label: string;
    selectOnFocus?: boolean;
    className?: string;
    labelClassName?: string;
    containerClassName?: string;
}

type Props = OwnProps & HTMLProps<HTMLInputElement> & VariantProps<typeof getInputClassName>;

export const Input = forwardRef<HTMLInputElement, Props>(({
    label,
    className,
    selectOnFocus = false,
    labelClassName,
    containerClassName,
    variant,
    size,
    onFocus,
    ...rest
}: Props, ref) => {
    const id = useId();

    function handleFocus(event: FocusEvent<HTMLInputElement>) {
        if (selectOnFocus) {
            event.target.select();
        }

        onFocus?.(event);
    }

    return (
        <div className={classnames(containerClassName, 'flex flex-col-reverse gap-1')}>
            <input
                id={id}
                ref={ref}
                className={classnames(className, getInputClassName({ variant, size }))}
                onKeyDown={e => e.stopPropagation()}
                onFocus={handleFocus}
                {...rest}
            />
            <Typography
                as="label" intent="label" htmlFor={id}
                className={classnames(labelClassName, getLabelClassName({ size }))}
            >
                {label}
            </Typography>
        </div>
    );
});
