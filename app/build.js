const builder = require("electron-builder");
const fs = require('fs');
const os = process.platform;
const Platform = builder.Platform
const Arch = builder.Arch
const targets = new Map();
const archToType = new Map();
const pref = {
    productName: "TheDesk",
    appId: "top.thedesk",
    asarUnpack: [
        "node_modules/itunes-nowplaying-mac"
    ],
    directories: {
        output: "../build/"
    },
    win: {
        icon: "build/thedesk.ico",
        target: [
            "nsis",
            "portable",
            "appx"
        ]
    },
    appx: {
        identityName: "53491Cutls.TheDesk",
        applicationId: "Cutls.TheDesk",
        publisherDisplayName: "Cutls",
        publisher: "CN=629757F5-A5EE-474F-9562-B304A89A9FD1",
        languages: [
            "JA-JP",
            "EN-US"
        ]
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
    },
    linux: {
        icon: "build/icons",
        target: [
            "zip",
            "snap"
        ],
        category: "Network"
    },
    mac: {
        target: [
            "dmg",
            "zip"
        ]
    },
    electronDownload: {
        version: "5.0.1"
    },
    electronVersion: "5.0.1"
}
const json = JSON.parse(fs.readFileSync("package.json", 'utf8'));
const version = json.version;


if (os == "win32") {
    archToType.set(Arch.ia32, []);
    targets.set(Platform.WINDOWS, archToType);
} else if (os == "linux") {
    archToType.set(Arch.x64, []);
    archToType.set(Arch.ia32, []);
    targets.set(Platform.LINUX, archToType);
} else if (os == "darwin") {
    archToType.set(Arch.x64, []);
    targets.set(Platform.MAC, archToType);
} else {
    return false
}
builder.build({
    targets: targets,
    config: pref
})
    .then(() => {
        if (os == "win32") {
            fs.renameSync('../build/TheDesk ' + version + '.exe', '../build/TheDesk-ia32.exe');
            fs.renameSync('../build/TheDesk Setup ' + version + '.exe', '../build/TheDesk-setup-ia32.exe');
            retry()
        }
    })
    .catch((error) => {
        // handle error
    })
function retry(){
    const targetsAlt = new Map();
    const archToTypeAlt = new Map();
    targetsAlt.set(Platform.WINDOWS, archToTypeAlt);
    archToTypeAlt.set(Arch.x64, []);
    builder.build({
        targets: targetsAlt,
        config: pref
    })
        .then(() => {
            fs.renameSync('../build/TheDesk Setup ' + version + '.exe', '../build/TheDesk-setup.exe');
            fs.renameSync('../build/TheDesk ' + version + '.exe', '../build/TheDesk.exe');
        })
        .catch((error) => {
            // handle error
        })
}