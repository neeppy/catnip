/** @type {import('tailwindcss').Config} */
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
            colors: {
                scene: {
                    100: '#0a0a0a',
                    200: '#141414',
                    300: '#232323',
                    400: '#303030',
                    500: '#3e3e3e',
                    600: '#4a4a4a',
                    700: '#6f6f6f',
                    800: '#8c8c8c',
                    900: '#a4a4a4',
                },
                surface: {
                    100: '#1c1a1a',
                    200: '#2d2c2c',
                    300: '#3a3a3a',
                    400: '',
                    500: '',
                    600: '',
                    700: '',
                    800: '',
                    900: '',
                },
                accent: {
                    500: '#ec3636',
                    600: '#d22727',
                    700: '#9f1717',
                    800: '#800e0e',
                    900: '#660202',
                },
            },
            animation: {
                'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
                'fade-in-transparent': 'fade-in-transparent 1s ease-out forwards',
                'slide-fade-bottom': 'slide-fade-bottom 250ms ease-out forwards',
            },
            keyframes: {
                'slide-in-left': {
                    '0%': { translate: '-100% 0' },
                    '100%': { translate: 0 },
                },
                'slide-in-right': {
                    '0%': { translate: '100% 0' },
                    '100%': { translate: 0 },
                },
                'fade-in-transparent': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 70 },
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
    plugins: [],
};
