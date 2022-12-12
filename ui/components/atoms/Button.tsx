import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes, PropsWithChildren } from 'react';

const getButtonClassName = cva('rounded-md transition-colors transition-200 flex items-center justify-center', {
    variants: {
        scheme: {
            accent: 'bg-accent-500 text-sm text-white hover:bg-accent-600 active:bg-accent-700',
        },
        shape: {
            default: null,
            square: 'aspect-square',
        },
        size: {
            none: null,
            sm: 'px-2 py-1',
            md: 'px-4 py-2'
        },
    },
    defaultVariants: {
        scheme: 'accent',
        shape: 'default',
        size: 'md',
    },
});

interface OwnProps extends VariantProps<typeof getButtonClassName>, HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const Button = ({ className, scheme, shape, size, ...rest }: PropsWithChildren<OwnProps>) => (
    <button
        className={[className, getButtonClassName({ scheme, shape, size })].join(' ')}
        {...rest}
    />
);
