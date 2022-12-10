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
            default: 'text-scene-default',
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
            className: 'text-scene-darker peer-hover:text-scene-dark peer-focus:text-scene-default transition-colors duration-500'
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
