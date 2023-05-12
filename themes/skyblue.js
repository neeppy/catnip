const color = require('color');

const surface = color('#ced3ef');
const accent = color('#a0a4ff');
const primary = color('#3676ec');
const secondary = color('#ec6736');
const text = color('#363636ee');

module.exports = {
    transparent: {
        200: '#0003',
        300: '#0002',
        400: '#0001',
        500: '#0000',
        text: text.toString(),
    },
    accent: accent.toString(),
    foreground: {
        subtlest: text.alpha(0.4).toString(),
        subtle: text.alpha(0.7).toString(),
        default: text.toString(),
    },
    surface: {
        100: surface.darken(0.2).toString(),
        200: surface.darken(0.15).toString(),
        300: surface.darken(0.1).toString(),
        400: surface.darken(0.05).toString(),
        500: surface.toString(),
        600: surface.lighten(0.05).toString(),
        700: surface.lighten(0.1).toString(),
        800: surface.lighten(0.15).toString(),
    },
    primary: {
        100: primary.darken(0.75).toString(),
        200: primary.darken(0.5).toString(),
        300: primary.darken(0.35).toString(),
        400: primary.darken(0.2).toString(),
        500: primary.toString(),
        600: primary.lighten(0.2).toString(),
        700: primary.lighten(0.35).toString(),
        transparent: primary.alpha(0.35).toString(),
        text: '#fff',
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
};
