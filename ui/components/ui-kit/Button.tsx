import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';

const getButtonClassName = cva('transition-colors transition-200 select-none cursor-pointer', {
    variants: {
        layout: {
            none: null,
            centered: 'flex items-center justify-center',
        },
        scheme: {
            none: null,
            accent: 'bg-accent-500 text-sm text-white hover:bg-accent-600 active:bg-accent-700',
            'ghost-accent': 'bg-transparent border-accent-500 text-accent-500 border-[1px]',
            transparent: 'bg-transparent text-[#fff6] hover:bg-[#fff1] hover:text-[#fffa]'
        },
        shape: {
            none: null,
            default: 'rounded-md',
            square: 'aspect-square',
            round: 'rounded-full'
        },
        size: {
            none: null,
            sm: 'px-2 py-1 text-sm',
            md: 'px-4 py-2 text-md'
        }
    },
    defaultVariants: {
        layout: 'centered',
        scheme: 'accent',
        shape: 'default',
        size: 'md'
    }
});

interface OwnProps extends VariantProps<typeof getButtonClassName>, HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const Button = forwardRef<HTMLButtonElement, OwnProps>((
    { className, scheme, shape, size, layout, ...rest }: PropsWithChildren<OwnProps>,
    ref
) => (
    <button
        ref={ref}
        className={[className, getButtonClassName({ scheme, shape, size, layout })].join(' ')}
        {...rest}
    />
));
