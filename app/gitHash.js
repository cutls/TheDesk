const fs = require('fs')
const execSync = require('child_process').execSync
const gitHash = execSync('git rev-parse HEAD')
    .toString()
    .trim()
fs.writeFileSync('git', gitHash)
