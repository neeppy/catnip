import { ComponentProps, FocusEvent, forwardRef, useId } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import classnames from 'classnames';

export const getInputClassName = cva([
    'peer rounded-sm transition-all duration-200',
    'placeholder:text-transparent focus:placeholder:text-foreground-subtle placeholder:duration-200',
    'shadow-sm shadow-surface-300 focus:shadow-surface-500'
], {
    variants: {
        variant: {
            default: 'bg-surface-600 focus:bg-surface-800 hover:bg-surface-700 text-foreground-default',
        },
        size: {
            sm: 'px-2 py-1.5 text-sm',
            md: 'px-3 py-2',
            lg: 'px-4 py-3 text-lg',
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'md'
    }
});

export const getLabelClassName = cva([
    'absolute transition-all duration-200',
    'text-foreground-subtlest peer-hover:text-foreground-subtle peer-focus:text-foreground-default',
], {
    variants: {
        size: {
            sm: [
                'text-xs -top-5 left-0',
                'peer-placeholder-shown:text-sm peer-placeholder-shown:left-2 peer-placeholder-shown:top-1.5',
                'peer-focus:text-xs peer-focus:-top-5 peer-focus:left-0'
            ],
            md: [
                'text-xs -top-5 left-0',
                'peer-placeholder-shown:text-base peer-placeholder-shown:left-3 peer-placeholder-shown:top-2',
                'peer-focus:text-xs peer-focus:-top-5 peer-focus:left-0'
            ],
            lg: [
                'text-sm -top-6 left-0',
                'peer-placeholder-shown:text-lg peer-placeholder-shown:left-3 peer-placeholder-shown:top-3',
                'peer-focus:text-sm peer-focus:-top-6 peer-focus:left-0'
            ],
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

interface OwnProps {
    label?: string;
    selectOnFocus?: boolean;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
}

type Props = OwnProps & Omit<ComponentProps<'input'>, 'size'> & VariantProps<typeof getInputClassName>;

export type { Props as InputProps };

export const Input = forwardRef<HTMLInputElement, Props>(({
    label,
    placeholder,
    className,
    selectOnFocus = false,
    labelClassName,
    inputClassName,
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
        <div className={classnames(className, 'relative flex flex-col-reverse gap-1')}>
            <input
                id={id}
                ref={ref}
                className={classnames(inputClassName, getInputClassName({ variant, size }))}
                onFocus={handleFocus}
                placeholder={placeholder || ' '}
                {...rest}
            />
            {label && (
                <label htmlFor={id} className={classnames(labelClassName, getLabelClassName({ size }))}>
                    {label}
                </label>
            )}
        </div>
    );
});
