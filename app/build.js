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
        icon: 'build/icons',
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
    })
}
async function cmd() {
    if (isTrue('onlyStore') || isTrue('withStore')) {
        console.log('start building for application stores')
        construct(ver, basefile, false, true)
        if (platform == 'win32') {
            if ((isTrue('withIa32') && arch == 'x64') || arch == 'ia32') {
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
        } else if (platform == 'linux') {
            if ((isTrue('withIa32') && arch == 'x64') || arch == 'ia32') {
                await build(Platform.LINUX, Arch.ia32, config)
            }
            if (arch == 'x64') {
                await build(Platform.LINUX, Arch.x64, config)
                if (!isTrue('onlyStore')) {
                    fs.renameSync(
                        `../build/thedesk_${version}_amd64.snap`,
                        `../build/thedesk_${version}_amd64-store.snap`
                    )
                }
            }
        } else if (platform == 'darwin') {
            console.log('Mac App Store should be use electron-packager')
        } else {
            return false
        }
    }
    if (!isTrue('onlyStore')) {
        console.log('start building for normal usage')
        construct(ver, basefile, false, false)
        if (platform == 'win32') {
            if ((isTrue('withIa32') && arch == 'x64') || arch == 'ia32') {
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
        } else if (platform == 'linux') {
            if ((isTrue('withIa32') && arch == 'x64') || arch == 'ia32') {
                await build(Platform.LINUX, Arch.ia32, config)
            }
            if (arch == 'x64') {
                await build(Platform.LINUX, Arch.x64, config)
                fs.renameSync(
                    `../build/thedesk_${version}_amd64.snap`,
                    `../build/thedesk_${version}_amd64-normal.snap`
                )
                if (isTrue('onlyStore') || isTrue('withStore')) {
                    fs.renameSync(
                        `../build/thedesk_${version}_amd64-store.snap`,
                        `../build/thedesk_${version}_amd64.snap`
                    )
                }
            }
        } else if (platform == 'darwin') {
            await build(Platform.MAC, Arch.x64, config)
        } else {
            return false
        }
    }
}
function isTrue(long, short) {
    const { argv } = process
    if (argv.includes(`--${long}`)) return true
    if (short && argv.includes(`-${short}`)) return true
    return false
}
cmd()
