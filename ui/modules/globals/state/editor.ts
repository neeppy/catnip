import * as monaco from 'monaco-editor';
import { atom, useAtom } from 'jotai';

export const globalEditor = atom<monaco.editor.IStandaloneCodeEditor | null>(null);

export function useGlobalEditor(): monaco.editor.IStandaloneCodeEditor {
    const [editor] = useAtom(globalEditor);

    if (!editor) {
        throw new Error('Editor not initialized yet.');
    }

    return editor;
}
