import * as fs from 'fs';
import path from 'path';
import * as ts from 'typescript';

async function generateDefinitionFile() {
  const url = 'https://cdn.jsdelivr.net/npm/pixi.js@latest/dist/pixi.js.d.ts';

  try {
    // Fetch the definition file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch definition file: ${response.statusText}`);
    }
    const content = await response.text();

    // Create source file from fetched content
    const sourceFile = ts.createSourceFile('pixi.js.d.ts', content, ts.ScriptTarget.Latest, true);

    // Track the positions we need to remove
    const removals: { pos: number; end: number }[] = [];

    function visit(node: ts.Node) {
      const jsDoc = ts.getJSDocTags(node);

      // Check for nodes to remove entirely
      const hasRestrictedTag = jsDoc.some(
        (tag) =>
          tag.tagName.text === 'internal' ||
          tag.tagName.text === 'advanced' ||
          tag.tagName.text === 'private' ||
          tag.tagName.text === 'protected' ||
          tag.tagName.text === 'ignore',
      );

      // Check if node is a private member
      const isPrivateMember =
        ts.canHaveModifiers(node) &&
        ts
          .getModifiers(node)
          ?.some(
            (modifier) =>
              modifier.kind === ts.SyntaxKind.PrivateKeyword || modifier.kind === ts.SyntaxKind.ProtectedKeyword,
          );

      // Check for private identifier
      const isPrivateIdentifier =
        node.kind === ts.SyntaxKind.PrivateIdentifier || node.kind === ts.SyntaxKind.ProtectedKeyword;

      if (hasRestrictedTag || isPrivateMember || isPrivateIdentifier) {
        removals.push({
          pos: node.getFullStart(),
          end: node.getEnd(),
        });
      } else {
        ts.forEachChild(node, visit);
      }
    }

    // Visit all nodes
    visit(sourceFile);

    // Sort removals in reverse order to not affect other positions
    removals.sort((a, b) => b.pos - a.pos);

    // Get the file content
    let fileContent = sourceFile.getFullText();

    // Remove the marked sections
    for (const { pos, end } of removals) {
      fileContent = fileContent.slice(0, pos) + fileContent.slice(end);
    }

    // Clean up any empty JSDoc comments
    fileContent = fileContent.replace(/\/\*\*\s*\*\s*\*\//g, '');
    fileContent = fileContent.replace(/\/\*\*\s*\*\//g, '');

    // Step 1: Replace `*   /` with `*/` unless it's part of `* //`
    fileContent = fileContent.replace(/(\*)\s+(\/)(?!\/)/g, (match, _asterisk, _slash, offset, str) => {
      const afterMatch = str.slice(offset + match.length).trimStart();
      if (afterMatch.startsWith('/')) return match;
      return '*/';
    });

    // Step 2: Remove lines that contain @category or @standard
    fileContent = fileContent
      .split('\n')
      .filter(
        (line) =>
          !line.trim().match(/^\*\s*@(?:see|noInheritDoc|extends|readonly|author|class|interface|category|standard)\b/),
      )
      .join('\n');

    // wrap the content in a markdown code block
    fileContent = '```typescript\n' + fileContent + '\n```';

    // Write the modified content back to file
    const outputPath = path.join(process.cwd(), 'src/data/pixi.js.md');
    fs.writeFileSync(outputPath, fileContent);

    console.log(`Processed file saved to: ${outputPath}`);
    console.log(`Removed ${removals.length} elements and tags`);
  } catch (error) {
    console.error(`Error fetching the file: ${(error as Error).message}`);
    return;
  }
}

console.log('Starting to generate the definition file...');
// @ts-expect-error - this does work
await generateDefinitionFile();
console.log('Definition file generation completed.');
