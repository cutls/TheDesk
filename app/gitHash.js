const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const gitHash = execSync('git rev-parse HEAD')
    .toString()
    .trim()
fs.writeFileSync('git', gitHash)

createContributorsList()
async function createContributorsList() {
    const basefile = path.join(__dirname)
    const packageRaw = fs.readFileSync(`${basefile}/package.json`, 'utf8')
    const package = JSON.parse(packageRaw)
    const repo = package.repository
    if (!repo.match(/https:\/\/github.com/)) return
    const apiUrl = repo.replace('github.com', 'api.github.com/repos').replace(/\/$/, '') + '/stats/contributors'
    const response = await fetch(apiUrl)
    const json = await response.json()
    const res = []
    if (!Array.isArray(json)) return console.error('API error')
    for (const c of json) {
        const author = c.author
        res.push({
            contributes: c.total,
            url: author.html_url,
            avatar: author.avatar_url,
            name: author.login
        })
    }
    res.sort((a, b) => b.contributes - a.contributes)
    fs.writeFileSync(
        basefile + '/contributors.js',
        JSON.stringify(res).replace(/^\[/, 'const contributors = [')
    )
    createContributorsSvg(res)
}
async function createContributorsSvg(contributors) {
    if (!contributors) return console.log('no contributors')
    const basefile = path.join(__dirname)
    const data = []
    let x = 5
    let y = 5
    for (const c of contributors) {
        const image = await fetch(c.avatar)
        const blob = await image.arrayBuffer()
        const base64 = Buffer.from(blob, 'binary').toString('base64')
        data.push(`<defs><clipPath id="clip-path${x}${y}">
        <rect width="64" height="64" x="${x}" y="${y}" rx="32" />
    </clipPath></defs><a xlink:href="${c.url}" class="svg" target="_blank" rel="nofollow sponsored" id="${c.name}">
        <image clip-path="url(#clip-path${x}${y})" x="${x}" y="${y}" width="64" height="64" xlink:href="data:image/png;base64,${base64}"/>
        </a>`)
        x = x + 69
        if (x > 400) {
            x = 5
            y = y + 69
        }
    }
    const last = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="420" height="${y + 70}">
    <style>.svg { cursor: pointer; }</style>${data.join('')}</svg>`
    fs.writeFileSync(
        basefile + '/img//contributors.svg',
        last
    )
}