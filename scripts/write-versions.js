// async iife
(async () => {
  const shell = require('shelljs')
  const { compareVersions } = require('compare-versions')

  shell.exec('npm view pixi.js --json > scripts/pixiVersions.json')

  const pixiVersions = require('./pixiVersions.json')
  const tags = pixiVersions['dist-tags']

  const v4 = tags['latest-4.x']
  const v5 = tags['latest-5.3.x']
  const v6 = tags['latest-6.x']
  const prerelease = tags.prerelease
  const allV7s = pixiVersions.versions.filter(v => v.startsWith('7'))
  const minorV7s = new Map()

  // loop through each minor version of v7 and add the largest to the array
  for (let i = 0; i < allV7s.length; i++) {
    const v = allV7s[i]
    const minor = v.split('.')[1]

    if (!minorV7s.has(minor)) {
      minorV7s.set(minor, v)
    }
    // compare the two versions
    const current = minorV7s.get(minor)

    if (compareVersions(current, v) !== 1) {
      minorV7s.set(minor, v)
    }
  }

  // check if the prerelease version is higher than the latest v7
  const addPrelease = compareVersions(prerelease, tags.latest) > 0

  const versions = [
    {
      version: '4.x',
      releaseNotes: `https://github.com/pixijs/pixijs/releases/tags/v${v4}`,
      build: `https://pixijs.download/v${v4}/pixi.min.js`,
      docs: `https://pixijs.download/v${v4}/docs/index.html`
    },
    {
      version: '5.x',
      releaseNotes: `https://github.com/pixijs/pixijs/releases/tags/v${v5}`,
      build: `https://pixijs.download/v${v5}/pixi.min.js`,
      docs: `https://pixijs.download/v${v5}/docs/index.html`
    },
    {
      version: '6.x',
      releaseNotes: `https://github.com/pixijs/pixijs/releases/tags/v${v6}`,
      build: `https://pixijs.download/v${v6}/pixi.min.js`,
      docs: `https://pixijs.download/v${v6}/docs/index.html`
    }
  ]

  minorV7s.forEach(v => {
    versions.push({
      version: v.split('.').slice(0, 2).join('.') + '.x',
      releaseNotes: `https://github.com/pixijs/pixijs/releases/tags/v${v}`,
      build: `https://pixijs.download/v${v}/pixi.min.js`,
      docs: `https://pixijs.download/v${v}/docs/index.html`
    })
  })

  if (addPrelease) {
    versions.push({
      version: prerelease,
      releaseNotes: `https://github.com/pixijs/pixijs/releases/tags/v${prerelease}`,
      build: `https://pixijs.download/v${prerelease}/pixi.min.js`,
      docs: `https://pixijs.download/v${prerelease}/docs/index.html`,
      prerelease: true
    })
  }

  versions.push({
    version: 'dev',
    releaseNotes: 'https://github.com/pixijs/pixijs/releases',
    build: 'https://pixijs.download/dev/pixi.min.js',
    docs: '/api'
  })

  const json = JSON.stringify(versions.reverse(), null, 2)

  shell.exec(`echo '${json}' > ./pixi-versions.json`)
  // delete the file
  shell.rm('./scripts/pixiVersions.json')
})()
