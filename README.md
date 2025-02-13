# r2d2-ai-refactor-tool README

This extension tests the ability to refactor R2D2.

## Requirements

You must create an OpenAPI key:

- https://platform.openai.com/settings/organization/api-keys

## Setup

1. Use the command palette in VSCode (Shift + Command + P (Mac) / Ctrl + Shift + P (Windows/Linux)) and type "r2d2"
1. Select the option for setting the OpenAI key. Paste your key here.
1. Once the key is set, open the command palette again and select the refactor command.

## Features

- Refactors JSS components to styled components

## Extension Settings

This extension contributes the following settings:

- `r2d2-ai-refactor-tool.openAIKey`: The open AI key

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 1.0.0

- Initial release

## Installation

- Obtain a .vsix file
  - To get a prebuild file, go to the releases tab https://github.com/HumbertoL/vscode-refactor/releases
  - To build your own, see section below
- Run `code --install-extension ./r2d2-ai-refactor-tool-0.0.3.vsix`
- See Setup section above to set up API key

## Packaging and Distributing

1. Install `vsce`

- `yarn global add vsce`

1. Update the version number in package.json
1. Run `yarn build`
1. See Installation section above

---
