import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MonacoEditorLoaderService } from "@materia-ui/ngx-monaco-editor";
import { Shader } from "../../../rest/model/shader";
import { ErrorService } from "../../../rest/service/error.service";
import { ShaderService } from "../../../rest/service/shader.service";

@Component({
  selector: "app-shader-code-window",
  templateUrl: "./shader-code-window.component.html",
  styleUrls: ["./shader-code-window.component.css"],
})
export class ShaderCodeWindowComponent implements OnInit, OnDestroy {
  // Monaco Editor
  // https://github.com/materiahq/ngx-monaco-editor
  // Syntax Highlighting
  // https://github.com/microsoft/monaco-editor/issues/2992
  // Autocomplete
  // https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages

  @Input() readOnly: boolean = false;
  @Output() codeChanged = new EventEmitter<string>();

  editorOptions: any = { theme: "vs-light", language: "glsl" };
  code: string =
    "// Variables you can use:\n" +
    "// TIME: float which represents the runtime\n" +
    "// RESOLUTION: vec2 which represents the resultion of the screen\n" +
    "\n\n" +
    "// Basic Shader:\n\n" +
    "void main() {\n" +
    "\tvec2 uv = gl_FragCoord.xy / RESOLUTION;\n" +
    "\tvec3 color = vec3(0.0);\n" +
    "\tgl_FragColor = vec4(color, 1.0);\n" +
    "}\n";
  lastChange: number = 0;
  needsUpdate: boolean = false;
  changeInterval: any = null;
  monacoLoaded: any = null;

  constructor(
    private monacoLoaderService: MonacoEditorLoaderService,
    private route: ActivatedRoute,
    private shaderService: ShaderService,
    private errorService: ErrorService
  ) {
    this.monacoLoaded = this.monacoLoaderService.isMonacoLoaded$.subscribe(
      () => {
        if (typeof monaco === "undefined") return;

        monaco.languages.register({
          id: "glsl",
        });
        monaco.languages.setMonarchTokensProvider("glsl", {
          keywords: this.keywords,
          operators: [
            "=",
            ">",
            "<",
            "!",
            "~",
            "?",
            ":",
            "==",
            "<=",
            ">=",
            "!=",
            "&&",
            "||",
            "++",
            "--",
            "+",
            "-",
            "*",
            "/",
            "&",
            "|",
            "^",
            "%",
            "<<",
            ">>",
            ">>>",
            "+=",
            "-=",
            "*=",
            "/=",
            "&=",
            "|=",
            "^=",
            "%=",
            "<<=",
            ">>=",
            ">>>=",
          ],
          symbols: /[=><!~?:&|+\-*\/\^%]+/,
          escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
          integersuffix: /([uU](ll|LL|l|L)|(ll|LL|l|L)?[uU]?)/,
          floatsuffix: /[fFlL]?/,
          encoding: /u|u8|U|L/,
          tokenizer: {
            root: [
              // identifiers and keywords
              [
                /[a-zA-Z_]\w*/,
                {
                  cases: {
                    "@keywords": { token: "keyword.$0" },
                    "@default": "identifier",
                  },
                },
              ],

              // Preprocessor directive (#define)
              [/^\s*#\s*\w+/, "keyword.directive"],

              // whitespace
              { include: "@whitespace" },

              // delimiters and operators
              [/[{}()\[\]]/, "@brackets"],
              [
                /@symbols/,
                {
                  cases: {
                    "@operators": "operator",
                    "@default": "",
                  },
                },
              ],

              // numbers
              [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, "number.float"],
              [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, "number.float"],
              [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, "number.hex"],
              [/0[0-7']*[0-7](@integersuffix)/, "number.octal"],
              [/0[bB][0-1']*[0-1](@integersuffix)/, "number.binary"],
              [/\d[\d']*\d(@integersuffix)/, "number"],
              [/\d(@integersuffix)/, "number"],

              // delimiter: after number because of .\d floats
              [/[;,.]/, "delimiter"],
            ],

            comment: [
              [/[^\/*]+/, "comment"],
              [/\/\*/, "comment", "@push"],
              ["\\*/", "comment", "@pop"],
              [/[\/*]/, "comment"],
            ],

            // Does it have strings?
            string: [
              [/[^\\"]+/, "string"],
              [/@escapes/, "string.escape"],
              [/\\./, "string.escape.invalid"],
              [
                /"/,
                {
                  token: "string.quote",
                  bracket: "@close",
                  next: "@pop",
                },
              ],
            ],

            whitespace: [
              [/[ \t\r\n]+/, "white"],
              [/\/\*/, "comment", "@comment"],
              [/\/\/.*$/, "comment"],
            ],
          },
        });
        monaco.languages.registerCompletionItemProvider("glsl", {
          provideCompletionItems: () => {
            let suggestions: any = [];
            for (let key of this.keywords) {
              suggestions.push({
                label: key,
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: key,
              });
            }
            return { suggestions: suggestions };
          },
        });
      }
    );
  }

  keywords = [
    "const",
    "uniform",
    "break",
    "continue",
    "do",
    "for",
    "while",
    "if",
    "else",
    "switch",
    "case",
    "in",
    "out",
    "inout",
    "true",
    "false",
    "invariant",
    "discard",
    "return",
    "sampler2D",
    "samplerCube",
    "sampler3D",
    "struct",
    "radians",
    "degrees",
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "pow",
    "sinh",
    "cosh",
    "tanh",
    "asinh",
    "acosh",
    "atanh",
    "exp",
    "log",
    "exp2",
    "log2",
    "sqrt",
    "inversesqrt",
    "abs",
    "sign",
    "floor",
    "ceil",
    "round",
    "roundEven",
    "trunc",
    "fract",
    "mod",
    "modf",
    "min",
    "max",
    "clamp",
    "mix",
    "step",
    "smoothstep",
    "length",
    "distance",
    "dot",
    "cross ",
    "determinant",
    "inverse",
    "normalize",
    "faceforward",
    "reflect",
    "refract",
    "matrixCompMult",
    "outerProduct",
    "transpose",
    "lessThan ",
    "lessThanEqual",
    "greaterThan",
    "greaterThanEqual",
    "equal",
    "notEqual",
    "any",
    "all",
    "not",
    "packUnorm2x16",
    "unpackUnorm2x16",
    "packSnorm2x16",
    "unpackSnorm2x16",
    "packHalf2x16",
    "unpackHalf2x16",
    "dFdx",
    "dFdy",
    "fwidth",
    "textureSize",
    "texture",
    "textureProj",
    "textureLod",
    "textureGrad",
    "texelFetch",
    "texelFetchOffset",
    "textureProjLod",
    "textureLodOffset",
    "textureGradOffset",
    "textureProjLodOffset",
    "textureProjGrad",
    "intBitsToFloat",
    "uintBitsToFloat",
    "floatBitsToInt",
    "floatBitsToUint",
    "isnan",
    "isinf",
    "vec2",
    "vec3",
    "vec4",
    "ivec2",
    "ivec3",
    "ivec4",
    "uvec2",
    "uvec3",
    "uvec4",
    "bvec2",
    "bvec3",
    "bvec4",
    "mat2",
    "mat3",
    "mat2x2",
    "mat2x3",
    "mat2x4",
    "mat3x2",
    "mat3x3",
    "mat3x4",
    "mat4x2",
    "mat4x3",
    "mat4x4",
    "mat4",
    "float",
    "int",
    "uint",
    "void",
    "bool",
  ];

  ngOnInit(): void {
    this.codeChanged.emit(this.code);
    this.lastChange = new Date().getTime();
    this.changeInterval = setInterval(() => {
      if (this.needsUpdate && new Date().getTime() - this.lastChange > 1000) {
        this.needsUpdate = false;
        this.codeChanged.emit(this.code);
      }
    }, 1000);

    if (this.readOnly) {
      this.editorOptions = {
        theme: "vs-light",
        language: "glsl",
        readOnly: this.readOnly,
      };
    }

    let path: string = "/" + this.route.snapshot.url.join("/");
    if (path !== "/shader/new") {
      let shaderId: string = this.route.snapshot.params["id"];
      this.shaderService.getShaderById(shaderId).subscribe({
        next: (shader: Shader) => {
          if (shader.shaderCode !== undefined) {
            this.code = shader.shaderCode;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.code = "// Shader could not be loaded\n\n" + "void main() {}";
          this.errorService.showError(error);
          console.error(error.message);
        },
      });
    }
  }

  ngModelChanged(_code: string): void {
    this.needsUpdate = true;
    this.lastChange = new Date().getTime();
  }

  ngOnDestroy(): void {
    if (this.monacoLoaded) this.monacoLoaded.unsubscribe();
    clearInterval(this.changeInterval);
  }
}
