import { monacoKeywords } from './monaco-keywords';
import { languages } from 'monaco-editor';
import InlayHint = languages.InlayHint;

export function onMonacoLoad() {
  const monaco: typeof import('monaco-editor') = (window as any).monaco;

  monaco.languages.register({
    id: 'glsl',
  });
  monaco.languages.setMonarchTokensProvider('glsl', {
    keywords: monacoKeywords,
    operators: [
      '=',
      '>',
      '<',
      '!',
      '~',
      '?',
      ':',
      '==',
      '<=',
      '>=',
      '!=',
      '&&',
      '||',
      '++',
      '--',
      '+',
      '-',
      '*',
      '/',
      '&',
      '|',
      '^',
      '%',
      '<<',
      '>>',
      '>>>',
      '+=',
      '-=',
      '*=',
      '/=',
      '&=',
      '|=',
      '^=',
      '%=',
      '<<=',
      '>>=',
      '>>>=',
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    integersuffix: /([uU](ll|LL|l|L)|(ll|LL|l|L)?[uU]?)/,
    floatsuffix: /[fFlL]?/,
    encoding: /u|u8|U|L/,
    tokenizer: {
      root: [
        // custom
        [/RESOLUTION|TIME|FRAME|MOUSE/, 'input-var'],

        // identifiers and keywords
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@keywords': { token: 'keyword.$0' },
              '@default': 'identifier',
            },
          },
        ],
        // Preprocessor directive (#define)
        [/^\s*#\s*\w+/, 'keyword.directive'],
        // whitespace
        { include: '@whitespace' },
        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'operator',
              '@default': '',
            },
          },
        ],
        // numbers
        [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float'],
        [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float'],
        [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex'],
        [/0[0-7']*[0-7](@integersuffix)/, 'number.octal'],
        [/0[bB][0-1']*[0-1](@integersuffix)/, 'number.binary'],
        [/\d[\d']*\d(@integersuffix)/, 'number'],
        [/\d(@integersuffix)/, 'number'],
        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],
      ],
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ['\\*/', 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],
      // Does it have strings?
      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [
          /"/,
          {
            token: 'string.quote',
            bracket: '@close',
            next: '@pop',
          },
        ],
      ],
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
    },
  });
  monaco.languages.setLanguageConfiguration('glsl', {
    brackets: [
      ['(', ')'],
      ['[', ']'],
      ['{', '}'],
    ],
  });
  monaco.languages.registerCompletionItemProvider('glsl', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      const suggestions: any = [
        {
          label: 'main-shader',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'void main() {',
            '\tvec2 uv = gl_FragCoord.xy / RESOLUTION;',
            '\tvec3 color = ${1:vec3(0.0, 0.0, 0.0)};',
            '\tgl_FragColor = vec4(color, 1.0);',
            '}',
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Main method of shader',
          range: range,
        },
        {
          label: 'gl_FragColor',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'gl_FragColor',
        },
        {
          label: 'frag-color',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'gl_FragColor = vec4(${1:color}, 1.0);',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        },
        {}, // DAS LEERE OBJEKT ERZEUGT EINEN FEHLER TODO LÖSEN
      ];
      for (let key of monacoKeywords) {
        suggestions.push({
          label: key,
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: key,
        });
      }
      return { suggestions: suggestions };
    },
  });

  monaco.languages.registerInlayHintsProvider('glsl', {
    provideInlayHints: (model, range, token) => {
      const tokenHintMap: any = {
        RESOLUTION: 'vec2',
        TIME: 'float',
        FRAME: 'int',
        MOUSE: 'vec2',
      };
      const hints: InlayHint[] = [];
      Object.keys(tokenHintMap).forEach((key) => {
        model.findMatches(key, range, true, true, null, false).forEach((match) => {
          const checkForComments = `\\/\\/.*${key}`;
          if (!model.getLineContent(match.range.startLineNumber).match(checkForComments)) {
            hints.push({
              kind: monaco.languages.InlayHintKind.Type,
              position: {
                column: match.range.startColumn,
                lineNumber: match.range.startLineNumber,
              },
              label: `${tokenHintMap[key] ?? 'any'}:`,
            });
          }
        });
      });
      return { hints, dispose: () => {} };
    },
  });

  monaco.editor.defineTheme('glsl-theme', {
    base: document.body.classList.contains('dark') ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [{ token: 'input-var', foreground: '#B078E3' }],
    colors: {},
  });
}
