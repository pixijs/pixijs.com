import { useMemo } from 'react';
import type { IVersion } from './usePixiVersions';

const indexHTML = `
<!DOCTYPE html>
  <html>
  <head>
  <title>PixiJS Playground</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="src/styles.css">
</head>
<body>
  <script src="src/index.js"></script>
</body>
</html>`;

// We need to tweak the sandpack vanilla js template a little to get exactly what we want.
// The way the template, files and customSetup are merged together by sandpack is a little
// opaque and also took some trial and error to get right. This way gives us the best
// babel configuration I could find (.browserslistrc isn't working and preset-env targets
// are out of date, but it seems OK), while also allowing the best "open in sandbox"
// functionality with all required dependencies
export const useFiles = (code: string) =>
    useMemo(
        () => ({
            '.babelrc': {
                code: JSON.stringify(
                    {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'entry',
                                    corejs: '3.29',
                                    targets: 'last 2 chrome versions',
                                },
                            ],
                        ],
                    },
                    null,
                    2,
                ),
            },
            'src/styles.css': `body { margin: 0; overflow: hidden; }`,
            'src/index.js': code,
            'index.html': indexHTML,
            'package.json': {
                code: JSON.stringify(
                    {
                        scripts: {
                            start: 'parcel index.html --open',
                            build: 'parcel build index.html',
                        },
                    },
                    null,
                    2,
                ),
            },
        }),
        [code],
    );

type UseDependenciesParams = {
    isPixiWebWorkerVersion: boolean;
    pixiVersion: IVersion;
};

const isPreV8 = (version: string) => version !== 'dev' && Number(version.split('.')[0]) < 8;

const useDependencies = ({ isPixiWebWorkerVersion, pixiVersion }: UseDependenciesParams) =>
    useMemo(() =>
    {
        const isDev = !!pixiVersion.dev;
        const version = pixiVersion.version;
        const pixiPackageName = isPixiWebWorkerVersion ? '@pixi/webworker' : 'pixi.js';
        const getPackageVersion = (packageName: string) => (isDev ? `${pixiVersion.npm}/${packageName}` : version);
        const packages = [pixiPackageName];

        // Add these packages if we're using a version of pixi that doesn't have them built in, ie. < v8
        if (isPreV8(version))
        {
            packages.push('@pixi/graphics-extras', '@pixi/math-extras');
        }

        const dependencies = packages.reduce(
            (deps, packageName) => ({
                ...deps,
                [packageName]: getPackageVersion(packageName),
            }),
            {},
        );

        return {
            dependenciesKey: `${pixiPackageName}-${pixiVersion}`,
            dependencies,
        };
    }, [isPixiWebWorkerVersion, pixiVersion]);

type UseSandpackConfigurationParams = UseDependenciesParams & {
    code: string;
};

export const useSandpackConfiguration = ({ code, isPixiWebWorkerVersion, pixiVersion }: UseSandpackConfigurationParams) =>
{
    const files = useFiles(code);
    const { dependenciesKey, dependencies } = useDependencies({ isPixiWebWorkerVersion, pixiVersion });

    // TODO: adding code here is only necessary because of user edited code, otherwise we
    // could flip between examples easily, investigate why it bugs out during editing
    const key = `${dependenciesKey}-${code}`;

    const customSetup: Record<string, any> = {
        entry: 'index.html',
        dependencies,
        devDependencies: {
            'parcel-bundler': '^1.6.1',
            '@babel/core': '^7.21.3',
        },
    };

    return {
        files,
        key,
        customSetup,
    };
};
