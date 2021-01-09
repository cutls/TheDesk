const { AiScript, parse, values, utils } = require('@syuilo/aiscript')
global.sanitizeHtml = require('sanitize-html')
global.asValue = values
global.AiScript = AiScript
global.asParse = parse
global.asCommon = {
    'TheDesk:console': values.FN_NATIVE((z) => {
        console.log(z[0].value)
    })
}
global.asUtil = utils