import { cva, VariantProps } from 'class-variance-authority';
import React, { PropsWithChildren } from 'react';

const getClassName = cva('', {
    variants: {
        intent: {
            h1: 'text-2xl font-bold',
            h2: 'text-xl font-bold',
            h3: 'text-lg font-bold',
            par: '',
            label: 'text-2xs font-semibold',
        },
        background: {
            default: 'text-foreground-default',
            surface: 'text-surface',
        },
    },
    defaultVariants: {
        background: 'default',
        intent: 'par',
    },
    compoundVariants: [
        {
            background: 'default',
            intent: 'label',
            className: 'text-foreground-subtlest peer-hover:text-foreground-subtle peer-focus:text-foreground-default transition-colors duration-500'
        }
    ],
});

interface OwnProps {
    as?: keyof JSX.IntrinsicElements;
    className?: string;
}

type Props = OwnProps & VariantProps<typeof getClassName>;

export const Typography = <T extends keyof JSX.IntrinsicElements>({
    as: Element = 'p',
    className,
    background,
    intent,
    ...rest
}: PropsWithChildren<Props & JSX.IntrinsicElements[T]>) => (
    // @ts-ignore: SVG props suck
    <Element
        className={[className, getClassName({ background, intent })].join(' ')}
        {...rest}
    />
);
