import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const intentSchemeCompound = (intent: any, scheme: any, className: string) => ({ intent, scheme, className });

const getButtonClassName = cva('transition-colors duration-200 select-none cursor-pointer capitalize font-semibold', {
    variants: {
        intent: {
            solid: null,
            ghost: null
        },
        scheme: {
            custom: null,
            primary: null,
            secondary: null,
            transparent: 'bg-transparent-500 hover:bg-transparent-400 active:bg-transparent-300 text-transparent-text'
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
        intentSchemeCompound('solid', 'primary', 'bg-primary-500 hover:bg-primary-400 active:bg-primary-300 text-primary-text'),
        intentSchemeCompound('solid', 'secondary', 'bg-secondary-500 hover:bg-secondary-400 active:bg-secondary-300 text-secondary-text'),
        intentSchemeCompound('ghost', 'primary', 'border bg-transparent border-primary-500 hover:bg-primary-500 text-primary-text'),
        intentSchemeCompound('ghost', 'secondary', 'border bg-transparent border-secondary-500 hover:bg-secondary-500 text-secondary-text')
    ],
    defaultVariants: {
        intent: 'solid',
        scheme: 'primary',
        shape: 'default',
        size: 'md'
    }
});

interface OwnProps extends VariantProps<typeof getButtonClassName>, HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const Button = forwardRef<HTMLButtonElement, OwnProps>((
    { className, scheme, shape, size, intent, ...rest }: PropsWithChildren<OwnProps>,
    ref
) => (
    <button ref={ref} className={getButtonClassName({ scheme, shape, size, intent, className })} {...rest}/>
));
