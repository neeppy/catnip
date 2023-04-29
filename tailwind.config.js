const { createThemes } = require('tw-colors');
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
                'glow-sm': '0 0 4px 0',
                'glow-md': '0 0 10px 0',
                'glow-lg': '0 0 20px 0',
            },
            animation: {
                'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
                'fade-in-transparent': 'fade-in-transparent 1s ease-out forwards',
                'fade-in': 'fade-in 200ms ease-out forwards',
                'scale-in-75': 'scale-in-75 200ms ease-out forwards',
                'slide-fade-bottom': 'slide-fade-bottom 250ms ease-out forwards',
            },
            keyframes: {
                'slide-in-left': {
                    '0%': { translate: '-100% 0' },
                    '100%': { translate: '0' },
                },
                'slide-in-right': {
                    '0%': { translate: '100% 0' },
                    '100%': { translate: '0' },
                },
                'fade-in-transparent': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '70' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '100' },
                },
                'scale-in-75': {
                    '0%': { scale: '75%' },
                    '100%': { scale: '100%' },
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
        createThemes(({ dark }) => ({
            dark: dark(themes.dark),
        })),
    ],
};
