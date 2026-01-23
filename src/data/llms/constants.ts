/**
 * Code examples and configuration for the LLMs documentation page.
 */

// IDE configuration code snippets
export const cursorProjectRules = `---
description: PixiJS API
globs: **/*.{js,ts,jsx,tsx}
alwaysApply: false
---

@https://pixijs.com/llms.txt`;

export const vscodeInstructions = `# PixiJS Context

When working with PixiJS,
refer to the API documentation at:
https://pixijs.com/llms.txt`;

export const windsurfGlobalRules = `When working with PixiJS, use the
API reference from:
https://pixijs.com/llms.txt`;

// Claude Code examples
export const claudeCodeExample = `# PixiJS Project

## Documentation
For PixiJS API reference, fetch:
https://pixijs.com/llms.txt
`;

export const claudeSlashCommand = `Fetch the PixiJS API documentation from:
https://pixijs.com/llms.txt

Use this documentation to answer questions
about PixiJS APIs, patterns, and best practices.`;

export const claudeInlineContext = `Using the PixiJS documentation from
https://pixijs.com/llms.txt,
help me implement a particle system
with thousands of sprites.`;

// ChatGPT examples
export const chatGptQuickContext = `Read the PixiJS API docs from
https://pixijs.com/llms.txt
and help me create a sprite animation
with custom easing.`;
