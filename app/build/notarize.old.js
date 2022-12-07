require('dotenv').config()
const { notarize } = require('electron-notarize')

// Notarizeをしない場合、下のuseNotarizeをtrueからfalseに変更してください。
const useNotarize = true


exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== 'darwin' || !useNotarize) return
    const appName = context.packager.appInfo.productFilename
    console.log(`start notarize: ${appOutDir}/${appName}.app`)
    try {
        return await notarize({
            appBundleId: 'top.thedesk',
            appPath: `${appOutDir}/${appName}.app`,
            appleId: process.env.APPLEID,
            appleIdPassword: process.env.APPLEIDPASS,
        })
    } catch (e) {
        throw console.log(e)
    }
}
