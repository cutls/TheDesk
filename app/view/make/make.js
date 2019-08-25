const fs = require("fs")
const readlineSync = require('readline-sync');
let ver = "Usamin (18.8.3)"
let input = readlineSync.question('version string [empty: '+ ver +' (default)]? ');
if (input){
    ver = input
}
console.log("Constructing view files " + ver + ": make sure to update package.json")
const langs = ["ja", "en", "ps", "bg", "cs", "de"]
const langsh = ["日本語", "English", "Crowdin translate system(beta)", "български", "Česky", "Deutsch"]
const simples = ["acct", "index", "setting", "update", "setting"]
const samples = ["acct.sample.html", "index.sample.html", "setting.sample.html", "update.sample.html", "setting.sample.js"]
const pages = ["acct.html", "index.html", "setting.html", "update.html", "setting.vue.js"]
let langstr = ""
for (let n = 0; n < langs.length; n++) {
    let lang = langs[n]
    langstr = langstr + '<a onclick="changelang(\'' + lang + '\')" class="pointer" style="margin-right:5px;">' + langsh[n] + '</a>'
}
for (let i = 0; i < samples.length; i++) {
    let sample = samples[i]
    let sourceParent = fs.readFileSync(sample, 'utf8')
    for (let j = 0; j < langs.length; j++) {
        let source = sourceParent
        let lang = langs[j]
        let target = JSON.parse(fs.readFileSync("language/" + lang + "/"  + simples[i] + ".json", 'utf8'))
        Object.keys(target).forEach(function (key) {
            let str = target[key]
            str = str.replace(/"/g, '\\"')
            var regExp = new RegExp("@@" + key + "@@", "g")
            source = source.replace(regExp, str)
        })
        if (lang == "ps") {
            source = source.replace(/@@comment-start@@/g, "")
            source = source.replace(/@@comment-end@@/g, "")
        } else {
            source = source.replace(/@@comment-start@@/g, "<!--")
            source = source.replace(/@@comment-end@@/g, "-->")
        }
        source = source.replace(/@@versionLetter@@/g, ver)
        source = source.replace(/@@lang@@/g, lang)
        source = source.replace(/@@langlist@@/g, langstr)
        fs.writeFileSync("../" + lang + "/" + pages[i], source)
    }
}