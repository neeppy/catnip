import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEffect } from 'react';
import { useSettings } from 'ui/hooks';

loader.config({ monaco });

interface OwnProps {
    defaultValue: string;
    submitOnEnter?: boolean;
    onBlur?: () => unknown;
    onFocus?: () => unknown;
    onChange?: (event: monaco.editor.IModelContentChangedEvent) => unknown;
    onPartialSubmit?: (content: string, cursorPosition: monaco.Selection | null) => unknown;
    onSave?: (content: string) => unknown;
    onSubmit?: (query: string) => unknown;
    onEscape?: () => unknown;
}

export function Editor({
    defaultValue,
    submitOnEnter = false,
    onBlur,
    onChange,
    onFocus,
    onPartialSubmit,
    onSubmit,
    onSave,
    onEscape
}: OwnProps) {
    const { settings } = useSettings();

    useEffect(() => {
        function resizeHandler() {
            const [activeEditor] = monaco.editor.getEditors();

            activeEditor.layout({} as unknown as monaco.editor.IDimension);
        }

        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    return (
        <MonacoEditor
            theme={settings.appearance.theme !== 'dark' ? 'light' : 'vs-dark'}
            language="sql"
            defaultValue={defaultValue}
            onMount={editor => {
                onBlur && editor.onDidBlurEditorWidget(onBlur);
                onFocus && editor.onDidFocusEditorWidget(onFocus);
                onChange && editor.onDidChangeModelContent(onChange);

                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => onPartialSubmit?.(editor.getValue(), editor.getSelection()));
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave?.(editor.getValue()));
                editor.addCommand(monaco.KeyCode.Escape, () => onEscape?.());
            }}
            options={{
                lineNumbersMinChars: 3,
                lineDecorationsWidth: 0,
                scrollbar: { vertical: 'hidden' },
                minimap: { enabled: false },
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                cursorBlinking: 'smooth',
            }}
        />
    );
}
