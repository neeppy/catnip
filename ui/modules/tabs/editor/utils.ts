import { editor, Selection, Token } from 'monaco-editor';

const QUERY_START_REGEXP = /select|insert|update|delete|create|alter|truncate|drop|grant|revoke/i;

function getQueryLines(model: editor.ITextModel, tokens: Token[][], lineNumber: number = 0): number[] {
    const currentLineTokens = tokens[lineNumber];

    if (lineNumber === tokens.length) {
        return [];
    }

    if (currentLineTokens.length === 0) {
        return getQueryLines(model, tokens, lineNumber + 1);
    }

    const [firstToken] = currentLineTokens;

    if (firstToken.type === 'keyword.sql') {
        const word = model.getWordAtPosition({
            lineNumber: lineNumber + 1,
            column: model.getLineFirstNonWhitespaceColumn(lineNumber + 1)
        });

        if (!word) {
            throw new Error('No word at offset: ' + firstToken.offset);
        }

        // nested queries might be first tokens of their line, but they will most likely be indented
        if (QUERY_START_REGEXP.test(word.word) && word.startColumn === 1) {
            return [
                lineNumber + 1,
                ...getQueryLines(model, tokens, lineNumber + 1),
            ];
        }
    }

    return getQueryLines(model, tokens, lineNumber + 1);
}

export function getCurrentQueries(sqlContent: string, selection: Selection | null): string[] {
    if (!selection) {
        throw new Error('No current selection.');
    }

    const [activeEditor] = editor.getEditors();
    const model = activeEditor.getModel();

    if (!model) {
        throw new Error('Active editor has no model.');
    }

    const { startLineNumber, endLineNumber } = selection;
    const tokens = editor.tokenize(sqlContent, 'sql');
    const queryLines = getQueryLines(model, tokens);

    const queries = [];
    const totalLineCount = model.getLineCount();

    for (let i = 0; i < queryLines.length; i++) {
        let toLine = totalLineCount;

        if (i < queryLines.length - 1) {
            toLine = queryLines[i + 1] - 1;
        }

        queries.push({
            fromLine: queryLines[i],
            toLine,
            content: model.getValueInRange({
                startLineNumber: queryLines[i],
                startColumn: 1,
                endLineNumber: toLine,
                endColumn: model.getLineLastNonWhitespaceColumn(toLine)
            }).trim()
        });
    }

    return queries.filter(query => Math.max(startLineNumber, query.fromLine) <= Math.min(endLineNumber, query.toLine))
        .map(query => query.content);
}
