const color = require('color');

const surface = color('#303030');
const primary = color('#ec3636');
const secondary = color('#ec6736');
const text = color('#dfe0e0');

module.exports = {
    transparent: {
        300: '#fff2',
        400: '#fff1',
        500: '#fff0',
        text: text.toString(),
    },
    surface: {
        300: surface.darken(0.4).toString(),
        400: surface.darken(0.2).toString(),
        500: surface.toString(),
        600: surface.lighten(0.2).toString(),
        700: surface.lighten(0.4).toString(),
    },
    primary: {
        200: primary.darken(0.5).toString(),
        300: primary.darken(0.35).toString(),
        400: primary.darken(0.2).toString(),
        500: primary.toString(),
        600: primary.lighten(0.2).toString(),
        700: primary.lighten(0.35).toString(),
        transparent: primary.alpha(0.5).toString(),
        text: text.toString(),
    },
    secondary: {
        200: secondary.darken(0.5).toString(),
        300: secondary.darken(0.35).toString(),
        400: secondary.darken(0.2).toString(),
        500: secondary.toString(),
        600: secondary.lighten(0.2).toString(),
        700: secondary.lighten(0.35).toString(),
        transparent: secondary.alpha(0.5).toString(),
        text: '#fff',
    },
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
    accent: {
        500: '#ec3636',
        600: '#d22727',
        700: '#9f1717',
        800: '#800e0e',
        900: '#660202',
        transparent: '#ec363687',
    },
};
