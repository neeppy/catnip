import { atom } from 'jotai';

type Theme = 'dark';

export const themeState = atom<Theme>('dark');
