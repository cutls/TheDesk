require('dotenv').config()
const { notarize } = require('@electron/notarize')
const useNotarize = true
exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== 'darwin' || !useNotarize) return
    const appName = context.packager.appInfo.productFilename
    console.log(`start notarize: ${appOutDir}/${appName}.app`)
    try {
        return await notarize({
            teamId: 'J529S6NXTQ',
            appPath: `${appOutDir}/${appName}.app`,
            appleId: process.env.APPLEID,
            appleIdPassword: process.env.APPLEIDPASS,
            tool: 'notarytool'
        })
    } catch (e) {
        throw console.log(e)
    }
}