const builder = require('electron-builder')
const path = require('path')
const fs = require('fs')
const basefile = __dirname + '/'
const package = fs.readFileSync(basefile + 'package.json')
const data = JSON.parse(package)
const version = data.version
const codename = data.codename
const ver = `${version} (${codename})`
const construct = require('./view/make/make.js')
const { platform, arch } = process
const Platform = builder.Platform
const Arch = builder.Arch
const config = {
    productName: 'TheDesk',
    appId: 'top.thedesk',
    asarUnpack: ['node_modules/itunes-nowplaying-mac', 'main/script'],
    afterSign: 'build/notarize.js',
    directories: {
        output: '../build',
    },
    win: {
        icon: 'build/thedesk.ico',
        target: ['nsis', 'appx', 'portable'],
        publish: []
    },
    appx: {
        identityName: '53491Cutls.TheDesk',
        applicationId: 'Cutls.TheDesk',
        publisherDisplayName: 'Cutls',
        publisher: 'CN=629757F5-A5EE-474F-9562-B304A89A9FD1',
        languages: ['JA-JP', 'EN-US'],
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        artifactName: 'TheDesk-setup.${ext}',
    },
    linux: {
        target: ['zip', 'appImage', 'snap', 'deb'],
        category: 'Network',
    },
    mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: 'build/entitlements.mac.plist',
        entitlementsInherit: 'build/entitlements.mac.plist',
    },
    dmg: {
        sign: false,
    },
}

async function build(os, arch, config) {
    let targets = new Map()
    let archToType = new Map()
    archToType.set(arch, [])
    targets.set(os, archToType)
    await builder.build({
        targets: targets,
        config: config,
        publish: 'never'
    })
}
async function cmd(options) {
    if (isTrue(options, 'help', 'h')) {
        return console.log(help())
    }
    if (isTrue(options, 'onlyStore') || isTrue(options, 'withStore')) {
        console.log('start building for application stores')
        construct(ver, basefile, false, true)
        if ((platform == 'win32' && !isTrue(options, 'skiWindows')) || isTrue(options, 'windows', 'w')) {
            if ((isTrue(options, 'withIa32') && arch == 'x64') || arch == 'ia32') {
                await build(Platform.WINDOWS, Arch.ia32, config)
                fs.renameSync(
                    `../build/TheDesk ${version}.exe`,
                    '../build/TheDesk-ia32-store.exe'
                )
                fs.renameSync(
                    `../build/TheDesk-setup.exe`,
                    '../build/TheDesk-setup-ia32-store.exe'
                )
            }
            if (arch == 'x64') {
                await build(Platform.WINDOWS, Arch.x64, config)
                fs.renameSync(
                    `../build/TheDesk ${version}.exe`,
                    '../build/TheDesk-store.exe'
                )
                fs.renameSync(
                    `../build/TheDesk-setup.exe`,
                    '../build/TheDesk-setup-store.exe'
                )
            }
        }
        if ((platform == 'linux' && !isTrue(options, 'skipLinux')) || isTrue(options, 'linux', 'l')) {
            if (arch == 'ia32') {
                await build(Platform.LINUX, Arch.ia32, config)
            }
            if ((isTrue(options, 'withIa32') && arch == 'x64')) {
                console.log('snapcraft does not curretly support builing i386 on amd64')
            }
            if (arch == 'x64') {
                await build(Platform.LINUX, Arch.x64, config)
                if (!isTrue(options, 'onlyStore')) {
                    fs.renameSync(
                        `../build/thedesk_${version}_amd64.snap`,
                        `../build/thedesk_${version}_amd64-store.snap`
                    )
                }
            }
        }
    }
    if (!isTrue(options, 'onlyStore')) {
        console.log('start building for normal usage')
        construct(ver, basefile, false, false)
        if ((platform == 'win32' && !isTrue(options, 'skiWindows')) || isTrue(options, 'windows', 'w')) {
            if ((isTrue(options, 'withIa32') && arch == 'x64') || arch == 'ia32') {
                await build(Platform.WINDOWS, Arch.ia32, config)
                fs.renameSync(
                    `../build/TheDesk ${version}.exe`,
                    '../build/TheDesk-ia32.exe'
                )
                fs.renameSync(
                    `../build/TheDesk-setup.exe`,
                    '../build/TheDesk-setup-ia32.exe'
                )
            }
            if (arch == 'x64') {
                await build(Platform.WINDOWS, Arch.x64, config)
                fs.renameSync(
                    `../build/TheDesk ${version}.exe`,
                    '../build/TheDesk.exe'
                )
            }
            if ((isTrue(options, 'withArm64') && arch == 'x64') || arch == 'arm64') {
                await build(Platform.WINDOWS, Arch.arm64, config)
                fs.renameSync(
                    `../build/TheDesk ${version}.exe`,
                    '../build/TheDesk-arm64.exe'
                )
                fs.renameSync(
                    `../build/TheDesk-setup.exe`,
                    '../build/TheDesk-setup-arm64.exe'
                )
            }
        }
        if ((platform == 'linux' && !isTrue(options, 'skipLinux')) || isTrue(options, 'linux', 'l')) {
            if (arch == 'ia32') {
                await build(Platform.LINUX, Arch.ia32, config)
            }
            if (isTrue(options, 'withIa32') && arch == 'x64') {
                console.log('snapcraft does not curretly support builing i386 on amd64')
            }
            if (arch == 'x64') {
                await build(Platform.LINUX, Arch.x64, config)
                fs.renameSync(
                    `../build/thedesk_${version}_amd64.snap`,
                    `../build/thedesk_${version}_amd64-normal.snap`
                )
                if (isTrue(options, 'onlyStore') || isTrue(options, 'withStore')) {
                    fs.renameSync(
                        `../build/thedesk_${version}_amd64-store.snap`,
                        `../build/thedesk_${version}_amd64.snap`
                    )
                }
            }
        }
        if (platform == 'darwin' && !isTrue(options, 'skipMacOS')) {
            if(isTrue(options, 'unnotarize')) delete config.afterSign
            await build(Platform.MAC, Arch.x64, config)
        }
    }
}
function isTrue(options, long, short) {
    const { argv } = process
    if (options ? options[long] : 0) return true
    if (argv.includes(`--${long}`)) return true
    if (short && argv.includes(`-${short}`)) return true
    return false
}
function help() {
    return `
TheDesk Builder command tool
    yarn build [options] (or node build.js [options])
    yarn build:[preset] (check package.json)

    --help or -h: show help

    [Build for other platforms]
    --windows (-w)
    --linux (-l)

    --skipWindows
    --skipLinux
    --skipMacOS
        To skip building for itself platform.


    [only Windows, Linux]
    --onlyStore: application store of platforms assets(without update check)
    --withStore: application store assets and normal version

    [only Windows]

    --withIa32: ia32 build on x64 system(if your machine is ia32, it will be built if this arg is not passed)
    --withArm64(beta) arm64 build on x64 system(if your machine is arm64, it will be built if this arg is not passed, and not build store build for arm64)

    [only macOS]
    --unnotarize: Without notarize
    `
}

/**
 * Builder
 * @module builder
 * @param {Object} [options] - Options
 * @param {boolean} [options.onlyStore] - App Store of platforms assets(without update check)
 * @param {boolean} [options.withStore] - App Store of platforms assets(without update check) assets and normal version
 * @param {boolean} [options.withIa32] - [Windows only] ia32 build on x64 system(if your machine is ia32, it will be built if this arg is not passed)
 * @param {boolean} [options.withArm64] - [Windows only(beta)] arm64 build on x64 system(if your machine is arm64, it will be built if this arg is not passed, and not build store build for arm64)
 * @return {void}
 */
 module.exports = cmd