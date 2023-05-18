const { createThemes } = require('tw-colors');
const plugin = require('tailwindcss/plugin');
const themes = require('./themes');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
    content: ['./ui/**/*.{ts,tsx}'],
    theme: {
        extend: {
            gridTemplateRows: {
                layout: '2.5rem minmax(0, 1fr)',
                table: 'auto 1fr',
            },
            gridTemplateColumns: {
                layout: '2.5rem minmax(0, 1fr)',
                table: '10rem 1fr',
            },
            gridColumn: {
                'span-24': 'span 24 / span 24',
                'span-23': 'span 23 / span 23',
            },
            fontSize: {
                '2xs': '.65rem',
            },
            textColor: {
                scene: {
                    default: '#dfe0e0',
                    dark: '#6a7b7b',
                    darker: '#4f5454',
                },
                surface: '#faffff',
            },
            boxShadow: {
                top: '0 -3px 10px 0 #0004',
                right: '2px 0 20px 0 #0004',
            },
            animation: {
                'fade-in': 'fade-in 200ms ease-out forwards',
                'fade-in-left': 'fade-in-left 300ms ease-out forwards',
                'fade-out': 'fade-in 200ms ease-out reverse',
                'scale-in': 'scale-in 200ms ease-out forwards',
                'scale-out': 'scale-in 200ms ease-out reverse',
                'slide-in-left': 'slide-in-left 0.2s ease-out forwards',
                'slide-out-left': 'slide-in-left 0.2s ease-out reverse',
                'slide-in-right': 'slide-in-right 0.2s ease-out forwards',
                'slide-out-right': 'slide-in-right 0.2s ease-out reverse',
                'slide-in-top': 'slide-in-top 0.2s ease-out forwards',
                'slide-out-top': 'slide-in-top 0.2s ease-out reverse',
                'slide-in-bottom': 'slide-in-bottom 0.2s ease-out forwards',
                'slide-out-bottom': 'slide-in-bottom 0.2s ease-out reverse',
                'slide-fade-bottom': 'slide-fade-bottom 250ms ease-out forwards',
                'scale-loop': 'scale-loop 1s ease-in-out infinite',
            },
            keyframes: {
                'fade-in-left': {
                    '0%': {
                        translate: '-8px 0',
                        opacity: 0,
                    },
                    '100%': {
                        translate: '0',
                        opacity: 1
                    }
                },
                'slide-in-left': {
                    '0%': { translate: '-100% 0' },
                    '100%': { translate: '0' },
                },
                'slide-in-right': {
                    '0%': { translate: '100% 0' },
                    '100%': { translate: '0' },
                },
                'slide-in-top': {
                    '0%': { translate: '0 -100%' },
                    '100%': { translate: '0' },
                },
                'slide-in-bottom': {
                    '0%': { translate: '0 100%' },
                    '100%': { translate: '0' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '100' },
                },
                'scale-in': {
                    '0%': { scale: '75%' },
                    '100%': { scale: '100%' },
                },
                'scale-loop': {
                    '0%': { scale: '10%' },
                    '50%': { scale: '100%' },
                    '100%': { scale: '10%' },
                },
                'slide-fade-bottom': {
                    '0%': {
                        translate: '0 -18px',
                        opacity: '20%'
                    },
                    '100%': {
                        translate: '0 -14px',
                        opacity: '100%',
                    }
                },
            },
        },
    },
    plugins: [
        createThemes(({ dark, light }) => ({
            dark: dark(themes.dark),
            skyblue: light(themes.skyblue),
        })),
        plugin(({ matchUtilities, theme }) => {
            matchUtilities(
                {
                    'animation-delay': (value) => {
                        return {
                            'animation-delay': value,
                        };
                    },
                },
                {
                    values: theme('transitionDelay'),
                }
            );
        }),
    ],
};
