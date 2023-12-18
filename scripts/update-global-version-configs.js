const { writeFileSync, readFileSync } = require('fs');
const glob = require('glob');
const recast = require('recast');
const { resolve } = require('path');

const ROOT = resolve(__dirname, '..');

console.log('Update docusaurus version config and pixi-versions.json...\n');

// Find all pixi-version.json files
const versionFiles = glob.sync(`${ROOT}/**/pixi-version.json`);

// Read and parse each pixi-version.json file
const versions = versionFiles.map((file) =>
{
    const data = readFileSync(file, 'utf8');

    return { ...JSON.parse(data), isCurrent: file === `${ROOT}/docs/pixi-version.json` };
});

console.log(`Versions found:\n${versions.map((v) => `- ${v.versionLabel} (v${v.version})`).join('\n')}\n`);

// Extract the version numbers
const versionNumbers = versions.map((version) => version.version);

// Create a set from the version numbers
const uniqueVersionNumbers = new Set(versionNumbers);

// Check if there are duplicate versions
if (uniqueVersionNumbers.size < versionNumbers.length)
{
    console.warn('** Warning - There are duplicate versions! Please update accordingly **\n');
}

// Read the docusaurus.config.js file
let code = readFileSync('docusaurus.config.js', 'utf8');

// Parse the JavaScript code into an AST
const ast = recast.parse(code);

// Traverse the AST
recast.visit(ast, {
    visitObjectExpression(path)
    {
        // Check if the node is the `versions` object
        if (path.node.properties.some((prop) => prop.key.name === 'versions'))
        {
            // Update the `versions` object
            path.node.properties = path.node.properties.map((prop) =>
            {
                if (prop.key.name === 'versions')
                {
                    prop.value.properties = versions.map((version) =>
                    {
                        const versionProps = [
                            recast.types.builders.property(
                                'init',
                                recast.types.builders.identifier('label'),
                                recast.types.builders.literal(version.versionLabel),
                            ),
                        ];

                        if (!version.isCurrent)
                        {
                            versionProps.push(
                                recast.types.builders.property(
                                    'init',
                                    recast.types.builders.identifier('path'),
                                    recast.types.builders.literal(version.version),
                                ),
                            );
                        }

                        return recast.types.builders.property(
                            'init',
                            recast.types.builders.identifier(version.isCurrent ? 'current' : `'${version.version}'`),
                            recast.types.builders.objectExpression(versionProps),
                        );
                    });
                }

                return prop;
            });
        }
        this.traverse(path);
    },
});

// Generate the modified JavaScript code
code = recast.print(ast, { quote: 'single' }).code;

// Write the modified code back to the docusaurus.config.js file
writeFileSync('docusaurus.config.js', code);
console.log('Docusaurus version config updated successfully!');

// Overwrite pixi-versions.json
writeFileSync('pixi-versions.json', JSON.stringify(versions, null, 2));
console.log('pixi-versions.json updated successfully!');
