/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import Versions from '@site/pixi-versions.json';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

function DocumentationLabel()
{
    return <Translate id="versionsPage.versionEntry.link">Documentation</Translate>;
}

function BuildLabel()
{
    return <Translate id="versionsPage.versionEntry.build">Build</Translate>;
}

function ReleaseNotesLabel()
{
    return <Translate id="versionsPage.versionEntry.releaseNotes">Release Notes</Translate>;
}

interface IVersion {
    version: string;
    releaseNotes: string;
    docs: string;
    build: string;
    prerelease: boolean;
}

export default function Version(): JSX.Element
{
    const versions = Versions as IVersion[];
    const devVersion: IVersion = versions[0];
    const latestVersion: IVersion = versions[1].prerelease ? versions[2] : versions[1];
    const preReleaseVersion = versions.find((version) => version.prerelease);
    const pastVersions = versions.slice(2);

    return (
        <Layout title="Versions" description="PixiJS Versions page listing all API documentation versions">
            <main className="container margin-vert--lg">
                <Heading as="h1">
                    <Translate id="versionsPage.title">PixiJS API documentation versions</Translate>
                </Heading>

                <div className="margin-bottom--lg">
                    <Heading as="h3" id="next">
                        <Translate id="versionsPage.current.title">Current version (Stable)</Translate>
                    </Heading>
                    <p>
                        <Translate id="versionsPage.current.description">
                            Here you can find the documentation for current released version.
                        </Translate>
                    </p>
                    <table>
                        <tbody>
                            <tr>
                                <th>{latestVersion.version}</th>
                                <td>
                                    <Link to={latestVersion.docs}>
                                        <DocumentationLabel />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={latestVersion.build}>
                                        <BuildLabel />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={latestVersion.releaseNotes}>
                                        <ReleaseNotesLabel />
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="margin-bottom--lg">
                    <Heading as="h3" id="latest">
                        <Translate id="versionsPage.next.title">Next version (Unreleased)</Translate>
                    </Heading>
                    <p>
                        <Translate id="versionsPage.next.description">
                            Here you can find the documentation for work-in-process unreleased version.
                        </Translate>
                    </p>
                    <table>
                        <tbody>
                            <tr>
                                <th>{devVersion.version}</th>
                                <td>
                                    <Link to={devVersion.docs}>
                                        <DocumentationLabel />
                                    </Link>
                                </td>
                                <td>
                                    <Link to={latestVersion.build}>
                                        <BuildLabel />
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {preReleaseVersion && (
                    <div className="margin-bottom--lg">
                        <Heading as="h3" id="latest">
                            <Translate id="versionsPage.next.title">Prerelease version</Translate>
                        </Heading>
                        <p>
                            <Translate id="versionsPage.next.description">
                                Here you can find the documentation for the prerelease version.
                            </Translate>
                        </p>
                        <table>
                            <tbody>
                                <tr>
                                    <th>{preReleaseVersion.version}</th>
                                    <td>
                                        <Link to={preReleaseVersion.docs}>
                                            <DocumentationLabel />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={preReleaseVersion.build}>
                                            <BuildLabel />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {pastVersions.length > 0 && (
                    <div className="margin-bottom--lg">
                        <Heading as="h3" id="archive">
                            <Translate id="versionsPage.archived.title">Past versions (Not maintained anymore)</Translate>
                        </Heading>
                        <p>
                            <Translate id="versionsPage.archived.description">
                                Here you can find documentation for previous versions of PixiJS.
                            </Translate>
                        </p>
                        <table>
                            <tbody>
                                {pastVersions.map((version) => (
                                    <tr key={version.version}>
                                        <th>{version.version}</th>
                                        <td>
                                            <Link to={version.docs}>
                                                <DocumentationLabel />
                                            </Link>
                                        </td>
                                        <td>
                                            <Link href={version.releaseNotes}>
                                                <ReleaseNotesLabel />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </Layout>
    );
}
