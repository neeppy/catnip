import { atom } from 'jotai';

export const appMode = atom<'simple' | 'advanced'>('simple');
