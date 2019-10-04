const fs = require("fs")
let ver = "Usamin (18.11.0)"
const execSync = require('child_process').execSync;
let gitHash = execSync("git rev-parse HEAD").toString().trim()
fs.writeFileSync("../../git", gitHash)
if (process.argv.indexOf("--automatic") === -1) {
    let input = require('readline-sync').question('version string [empty: ' + ver + ' (default)]? ');
    if (input) {
        ver = input
    }
}
console.log("Constructing view files " + ver + ": make sure to update package.json")
const langs = ["ja", "en", "ps", "bg", "cs", "de", "es-AR"]
const langsh = ["日本語", "English", "Crowdin translate system(beta)", "български", "Česky", "Deutsch", "Spanish, Argentina"]
const simples = ["acct", "index", "setting", "update", "setting"]
const samples = ["acct.sample.html", "index.sample.html", "setting.sample.html", "update.sample.html", "setting.sample.js"]
const pages = ["acct.html", "index.html", "setting.html", "update.html", "setting.vue.js"]
let langstr = ""
let refKey = []
for (let n = 0; n < langs.length; n++) {
    let lang = langs[n]
    let targetDir = '../' + lang
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }
    langstr = langstr + '<a onclick="changelang(\'' + lang + '\')" class="pointer" style="margin-right:5px;">' + langsh[n] + '</a>'
    fs.writeFileSync("../" + lang + "/main.js", fs.readFileSync("language/" + lang + "/main.json", 'utf8').replace(/^{/, "var lang = {"))
}
for (let i = 0; i < samples.length; i++) {
    let sample = samples[i]
    let sourceParent = fs.readFileSync(sample, 'utf8')
    let englishRefer = JSON.parse(fs.readFileSync("language/en/" + simples[i] + ".json", 'utf8'))
    for (let j = 0; j < langs.length; j++) {
        let source = sourceParent
        let lang = langs[j]
        let target = JSON.parse(fs.readFileSync("language/" + lang + "/" + simples[i] + ".json", 'utf8'))
        if (lang == "ja") {
            Object.keys(target).forEach(function (key) {
                refKey.push(key)
                let str = target[key]
                str = str.replace(/"/g, '\\"')
                var regExp = new RegExp("@@" + key + "@@", "g")
                source = source.replace(regExp, str)
            })
        } else {
            for (let k = 0; k < refKey.length; k++) {
                let tarKey = refKey[k]
                if (target[tarKey]) {
                    var str = target[tarKey]
                } else {
                    var str = englishRefer[tarKey]
                }
                var regExp = new RegExp("@@" + tarKey + "@@", "g")
                source = source.replace(regExp, str)
            }
        }
        if (lang == "ps") {
            source = source.replace(/@@comment-start@@/g, "")
            source = source.replace(/@@comment-end@@/g, "")
        } else {
            source = source.replace(/@@comment-start@@/g, "<!--")
            source = source.replace(/@@comment-end@@/g, "-->")
        }
        source = source.replace(/@@versionLetter@@/g, ver)
        source = source.replace(/@@gitHash@@/g, gitHash)
        source = source.replace(/@@gitHashShort@@/g, gitHash.slice(0, 7))
        source = source.replace(/@@lang@@/g, lang)
        source = source.replace(/@@langlist@@/g, langstr)
        fs.writeFileSync("../" + lang + "/" + pages[i], source)
    }
}