import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Selection } from 'monaco-editor';

loader.config({ monaco });

interface OwnProps {
    defaultValue: string;
    onSubmit: (query: string) => unknown;
    onEscape?: () => unknown;
}

export function Editor({ defaultValue, onSubmit, onEscape }: OwnProps) {
    return (
        <MonacoEditor
            theme="vs-dark"
            language="sql"
            defaultValue={defaultValue}
            onMount={editor => {
                editor.focus();
                editor.setSelection(new Selection(999, 999, 999, 999));
                editor.addCommand(monaco.KeyCode.Enter, () => onSubmit(editor.getValue()));
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
