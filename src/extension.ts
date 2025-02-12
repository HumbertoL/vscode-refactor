import * as vscode from 'vscode';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const VSCODE_EXTENSION_ID = 'r2d2-ai-refactor-tool';

const STYLES_PROMPT = `Convert this component to use styled components. 
Use object notation for the styled component. 
Use one styled component for the root and use classnames for any children.
Use kebabCase for the class names, but do not add an ampersand in front of the class names..
Name the styled element StyledRoot. or if the render function has a Component as the root that is being returned, use the component name and call it StyledComponentName.
ex. If the root element being returned is a div, name it StyledRoot. If the root element being returned is a Button, name it StyledButton.
Do not import React. Do not change the order of the imports. 
Give me the entire file. Do not add any explanation. 
Provide only the code, do not surround the code in backticks.
Do not change anything other than the styles. \n\n`;

async function setApiKey() {
  const apiKey = await vscode.window.showInputBox({
    prompt: 'Enter your OpenAI API Key',
    ignoreFocusOut: true,
    password: true,
  });

  if (apiKey) {
    await vscode.workspace
      .getConfiguration()
      .update(
        `${VSCODE_EXTENSION_ID}.openAIKey`,
        apiKey,
        vscode.ConfigurationTarget.Global,
      );
    vscode.window.showInformationMessage('OpenAI API Key saved successfully!');
  }
}

async function refactorCode() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found!');
    return;
  }

  const document = editor.document;
  const fileContent = document.getText();

  const openAIKeyFromConfig = vscode.workspace
    .getConfiguration()
    .get<string>(`${VSCODE_EXTENSION_ID}.openAIKey`);

  const openAIKey = openAIKeyFromConfig || process.env.OPENAI_API_KEY;

  if (!openAIKey) {
    vscode.window.showErrorMessage(
      "OpenAI API Key is not set. Run 'Set OpenAI API Key' first.",
    );
    return;
  }

  // vscode.window.showInformationMessage('Sending code to AI for refactoring...');

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Refactoring Code with AI',
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({ message: '\nSending code to AI. Please wait...' });
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are a code refactoring assistant specializing in modern JavaScript and React best practices.',
              },
              {
                role: 'user',
                content: `${STYLES_PROMPT}${fileContent}`,
              },
            ],
            temperature: 0.3,
            // max is 4096,
            max_tokens: 2048,
          },
          {
            headers: {
              Authorization: `Bearer ${openAIKey}`,
              'Content-Type': 'application/json',
            },
          },
        );

        progress.report({ message: '\nApplying refactored code...' });

        const refactoredCode = response.data.choices[0].message.content.trim();

        console.log('Refactored code:\n', refactoredCode);

        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
          document.lineAt(0).range.start,
          document.lineAt(document.lineCount - 1).range.end,
        );
        edit.replace(document.uri, fullRange, refactoredCode);

        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage('\nCode refactored successfully!');
      } catch (error) {
        vscode.window.showErrorMessage(
          'Error refactoring code: ' + (error as Error).message,
        );
      }
    },
  );
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${VSCODE_EXTENSION_ID}.setApiKey`,
      setApiKey,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${VSCODE_EXTENSION_ID}.refactorStyles`,
      refactorCode,
    ),
  );
}

export function deactivate() {}
