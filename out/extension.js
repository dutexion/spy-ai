"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const generative_ai_1 = require("@google/generative-ai");
const node_fetch_1 = __importStar(require("node-fetch"));
// 전역 객체에 fetch와 Headers 설정
global.fetch = node_fetch_1.default;
global.Headers = node_fetch_1.Headers;
let apiKey;
function activate(context) {
    let disposable = vscode.commands.registerCommand('spy-ai.request', async (uri) => {
        try {
            // uri가 없으면 현재 활성화된 에디터의 파일 경로 사용
            if (!uri) {
                const activeEditor = vscode.window.activeTextEditor;
                if (!activeEditor) {
                    vscode.window.showErrorMessage('활성화된 에디터가 없습니다.');
                    return;
                }
                uri = activeEditor.document.uri;
            }
            // API 키가 없으면 입력 요청
            if (!apiKey) {
                apiKey = await vscode.window.showInputBox({
                    prompt: 'Gemini API 키를 입력해주세요',
                    placeHolder: 'API 키를 입력하세요',
                    ignoreFocusOut: true,
                });
                if (!apiKey) {
                    vscode.window.showErrorMessage('API 키가 필요합니다.');
                    return;
                }
            }
            // 파일 내용 읽기
            const fileContent = fs.readFileSync(uri.fsPath, 'utf8');
            // Gemini API 초기화
            const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            // AI 요청 보내기
            const result = await model.generateContent([
                '다음 코드를 분석하고 개선된 버전을 제안해주세요. 코드만 반환해주세요:',
                fileContent,
            ]);
            const response = await result.response;
            const text = response.text();
            // 결과를 클립보드에 복사
            await vscode.env.clipboard.writeText(text);
            // 알림 표시
            vscode.window.showInformationMessage('AI 요청이 완료되었습니다. 결과가 클립보드에 복사되었습니다.');
        }
        catch (error) {
            vscode.window.showErrorMessage(`오류가 발생했습니다: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map