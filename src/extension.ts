import * as vscode from 'vscode';
import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch, { Headers } from 'node-fetch';

// 전역 객체에 fetch와 Headers 설정
(global as any).fetch = fetch;
(global as any).Headers = Headers;

let apiKey: string | undefined;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'spy-ai.request',
    async (uri?: vscode.Uri) => {
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
        const genAI = new GoogleGenerativeAI(apiKey);
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
        vscode.window.showInformationMessage(
          'AI 요청이 완료되었습니다. 결과가 클립보드에 복사되었습니다.'
        );
      } catch (error) {
        vscode.window.showErrorMessage(`오류가 발생했습니다: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
