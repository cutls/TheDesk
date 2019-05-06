const fs = require("fs")
const ver="Usamin (18.3.2)"
const langs=["ja","en","ps"]
const simples=["acct","index","setting","update","setting"]
const samples=["acct.sample.html","index.sample.html","setting.sample.html","update.sample.html","setting.sample.js"]
const pages=["acct.html","index.html","setting.html","update.html","setting.vue.js"]

for(let i=0; i<samples.length; i++){
    let sample=samples[i]
    let source = fs.readFileSync(sample, 'utf8')
    for(let j=0; j<langs.length; j++){
        let lang=langs[j]
        let target = JSON.parse(fs.readFileSync("language/"+simples[i]+"."+lang+".json", 'utf8'))
        Object.keys(target).forEach(function(key) {
            let str = target[key]
            var regExp = new RegExp("@@" + key + "@@", "g")
			source = source.replace(regExp, str)
        })
        if(lang=="ps"){
            source = source.replace(/@@comment-start@@/g, "")
            source = source.replace(/@@comment-end@@/g, "")
        }else{
            source = source.replace(/@@comment-start@@/g, "<!--")
            source = source.replace(/@@comment-end@@/g, "-->")
        }
        source = source.replace(/@@versionLetter@@/g, ver)
        source = source.replace(/@@lang@@/g, lang)
        fs.writeFileSync("../"+lang+"/"+pages[i], source)
    }
}