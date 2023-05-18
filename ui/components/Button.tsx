import { ComponentProps, forwardRef, PropsWithChildren, MouseEvent } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import classNames from 'classnames';
import { useBoolean } from 'ui/hooks';
import { Loader } from './Loader';

const intentSchemeCompound = (intent: any, scheme: any, className: string | string[]) => ({ intent, scheme, className });

const getButtonClassName = cva('transition-all duration-200 select-none whitespace-nowrap cursor-pointer capitalize font-semibold disabled:cursor-not-allowed', {
    variants: {
        intent: {
            solid: null,
            ghost: null
        },
        scheme: {
            custom: null,
            primary: null,
            secondary: null,
            transparent: 'bg-transparent-500 hover:bg-transparent-400 focus:bg-transparent-400 active:bg-transparent-300 enabled:text-transparent-text'
        },
        shape: {
            flat: 'rounded-none',
            default: 'rounded-md',
            square: 'aspect-square rounded-md',
            round: 'rounded-full'
        },
        size: {
            xs: 'p-1 text-xs',
            sm: 'p-1 text-sm',
            md: 'p-2',
            lg: 'px-3 py-2 text-lg',
            xl: 'px-4 py-3 text-xl'
        }
    },
    compoundVariants: [
        intentSchemeCompound('solid', 'primary', [
            'bg-primary-500 enabled:hover:bg-primary-400 enabled:focus:bg-primary-400 enabled:active:bg-primary-300 text-primary-text',
            'disabled:bg-primary-600',
        ]),
        intentSchemeCompound('solid', 'secondary', 'bg-secondary-500 enabled:hover:bg-secondary-400 enabled:focus:bg-secondary-400 enabled:active:bg-secondary-300 text-secondary-text'),
        intentSchemeCompound('ghost', 'primary', 'border bg-transparent border-primary-500 hover:bg-primary-500 focus:bg-primary-500 text-primary-text'),
        intentSchemeCompound('ghost', 'secondary', 'border bg-transparent border-secondary-500 hover:bg-secondary-500 focus:bg-primary-500 text-secondary-text'),
    ],
    defaultVariants: {
        intent: 'solid',
        scheme: 'primary',
        shape: 'default',
        size: 'md'
    }
});

type OwnProps = VariantProps<typeof getButtonClassName> & Omit<ComponentProps<'button'>, 'ref'> & {
    className?: string;
    loading?: boolean;
};

export type { OwnProps as ButtonProps };

const responsiveLoadingSize = {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 18,
    xl: 20
} as const;

export const Button = forwardRef<HTMLButtonElement, OwnProps>((
    { className, scheme, shape, size, intent, disabled, children, onClick, ...rest }: PropsWithChildren<OwnProps>,
    ref
) => {
    const { boolean: loading, on: startLoading, off: stopLoading } = useBoolean(false);

    return (
        <button
            ref={ref}
            disabled={loading || disabled}
            onClick={handleAsyncClick}
            className={getButtonClassName({
                scheme, shape, size, intent,
                className: classNames(className, {
                    'relative': !className?.includes('absolute'),
                    'text-transparent': loading,
                })
            })}
            {...rest}
        >
            {children}
            {loading && (
                <Loader className="absolute inset-0" size={responsiveLoadingSize[size || 'md']} />
            )}
        </button>
    );

    function handleAsyncClick(event: MouseEvent<HTMLButtonElement>) {
        let result: any;

        if (typeof onClick === 'function') {
            result = onClick(event);
        }

        if (result instanceof Promise) {
            startLoading();

            result.catch(error => {
                console.error('Uncaught error on button click:', error);
            }).finally(stopLoading);
        }
    }
});
