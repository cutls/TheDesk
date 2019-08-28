const JSON5 = require('json5')
const fs = require("fs")
fs.writeFileSync("main.json", JSON.stringify(JSON5.parse(fs.readFileSync("lang." + process.argv[2] + ".js", 'utf8').replace("var lang = ", ""))))