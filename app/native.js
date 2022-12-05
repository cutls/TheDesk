const { AiScript, parse, values, utils } = require('@syuilo/aiscript')
const gcc = require('textarea-caret')
const { v4: uuidv4 } = require('uuid')
global.uuid = uuidv4
global.getCaretCoordinates = gcc
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