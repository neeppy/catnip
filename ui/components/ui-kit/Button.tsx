import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';

const getButtonClassName = cva('rounded-md transition-colors transition-200 flex items-center justify-center select-none', {
    variants: {
        scheme: {
            accent: 'bg-accent-500 text-sm text-white hover:bg-accent-600 active:bg-accent-700',
            'ghost-accent': 'bg-transparent border-accent-500 text-accent-500 border-[1px]',
            transparent: 'bg-transparent text-scene-darker hover:bg-[#0002] hover:text-scene-dark'
        },
        shape: {
            default: null,
            square: 'aspect-square'
        },
        size: {
            none: null,
            sm: 'px-2 py-1',
            md: 'px-4 py-2'
        }
    },
    defaultVariants: {
        scheme: 'accent',
        shape: 'default',
        size: 'md'
    }
});

interface OwnProps extends VariantProps<typeof getButtonClassName>, HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const Button = forwardRef<HTMLButtonElement, OwnProps>((
    { className, scheme, shape, size, ...rest }: PropsWithChildren<OwnProps>,
    ref
) => (
    <button
        ref={ref}
        className={[className, getButtonClassName({ scheme, shape, size })].join(' ')}
        {...rest}
    />
));
