import { AiScript, parse, values, utils } from '@syuilo/aiscript'
import gcc from 'textarea-caret'
import { v4 as uuidv4 } from 'uuid'
import sanitizeHtml from 'sanitize-html'
global.uuid = uuidv4
global.getCaretCoordinates = gcc
global.sanitizeHtml = sanitizeHtml
global.asValue = values
global.AiScript = AiScript
global.asParse = parse
global.asCommon = {
    'TheDesk:console': values.FN_NATIVE((z) => {
        if(z[0].type === 'str') console.log(z[0].value)
    })
}
global.asUtil = utils