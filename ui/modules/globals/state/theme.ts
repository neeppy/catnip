import { atom } from 'jotai';

type Theme = 'dark' | 'skyblue';

const initialTheme = localStorage.getItem('theme') as Theme;

export const themeState = atom<Theme>(initialTheme || 'dark');
