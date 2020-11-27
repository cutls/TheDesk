
var plugins = getPlugin()
function getPlugin() {
    const json = localStorage.getItem('plugins')
    let ret = {
        buttonOnPostbox: [],
        buttonOnToot: []
    }
    if(!json) return ret
    const plugins = JSON.parse(json)
    for (let plugin of plugins) {
        const meta = getMeta(plugin.content)
        if (!meta) continue
        const type = meta.event
        ret[type] ? ret[type].push(plugin) : ret[type] = [plugin]
    }
    return ret
}
function initPlugin() {
    asCommon['TheDesk:dialog'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
            title: z[0].value,
            icon: z[2] ? z[2].value : 'info',
            text: z[1] ? z[1].value : ''
        })
    })
    asCommon['TheDesk:confirm'] = asValue.FN_NATIVE(async (z) => {
        const alert = await Swal.fire({
            title: z[0].value,
            text: z[1].value,
            icon: z[2] ? z[2].value : 'info',
            showCancelButton: true
        })
        return asUtil.jsToVal(!!(alert.value && alert.value === true))
    })
    asCommon['TheDesk:css'] = asValue.FN_NATIVE((z) => {
        $(escapeHTML(z[0].value)).css(escapeHTML(z[1].value), escapeHTML(z[2].value))
    })
    asCommon['TheDesk:api'] = asValue.FN_NATIVE(async (z) => {
        try {
            if (!getMeta(exe).apiGet && z[0].value == "GET") return asUtil.jsToVal(false)
            if (!getMeta(exe).apiPost && (z[0].value == "POST" || z[0].value == "DELETE" || z[0].value == "PUT")) return asUtil.jsToVal(false)
            const domain = localStorage.getItem(`domain_${z[3].value}`)
            const at = localStorage.getItem(`acct_${z[3].value}_at`)
            const start = `https://${domain}/api/${z[1].value}`
            const q = {
                method: z[0].value,
                headers: {
                    'content-type': 'application/json',
                    Authorization:
                        `Bearer ${at}`
                }
            }
            if (z[2]) q.body = z[2].value
            const promise = await fetch(start, q)
            const json = await promise.json()
            return asUtil.jsToVal(json)
        } catch (e) {
            return asUtil.jsToVal(e)
        }

    })
    const { buttonOnPostbox, init } = plugins
    for (let target of buttonOnPostbox) {
        const meta = getMeta(target.content)
        $('#dropdown2').append(`<li><a onclick="execPlugin('${target.id}','buttonOnPostbox', null);">${escapeHTML(meta.name)}</a></li>`)
    }
    for (let target of init) {
        const as = new AiScript(asCommon)
        const meta = getMeta(target.content)
        M.toast({ html: `${escapeHTML(meta.name)}を実行しました`, displayLength: 1000 })
        if (target) as.exec(asParse(target.content))
    }
}
function getMeta(plugin) {
    try {
        return AiScript.collectMetadata(asParse(plugin)).get(null)
    } catch (e) {
        console.error(e)
        return null
    }
}
async function execPlugin(id, source, args) {
    const coh = plugins[source]
    let exe = null
    for (let plugin of coh) {
        if (plugin.id == id) {
            exe = plugin.content
            break
        }
    }
    const common = _.cloneDeep(asCommon)
    if (source == 'buttonOnToot') {
        common.DATA = args
        const domain = localStorage.getItem(`domain_${args.acct_id}`)
        const at = localStorage.getItem(`acct_${args.acct_id}_at`)
        const start = `https://${domain}/api/v1/statuses/${args.id}`
        const promise = await fetch(start, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization:
                    `Bearer ${at}`
            }
        })
        const json = await promise.json()
        common.TOOT = asUtil.jsToVal(json)
        common['TheDesk:changeText'] = asValue.FN_NATIVE((z) => {
            if (getMeta(exe).dangerHtml) $(`[unique-id=${args.id}] .toot`).html(z[0].value)
        })
    } else if (source == 'buttonOnPostbox') {
        const postDt = post(null, false, true)
        common.POST = asUtil.jsToVal(postDt)
        common.ACCT_ID = asUtil.jsToVal(postDt.TheDeskAcctId)
        common['TheDesk:postText'] = asValue.FN_NATIVE((z) => {
            $('#textarea').val(z[0].value)
        })
        common['TheDesk:postCW'] = asValue.FN_NATIVE((z) => {
            if (z[1]) $('#cw-text').val(z[1].value)
            cw(z[0] ? z[0].value : false)
        })
        common['TheDesk:postNSFW'] = asValue.FN_NATIVE((z) => {
            nsfw(z[0] ? z[0].value : false)
        })
        common['TheDesk:postVis'] = asValue.FN_NATIVE((z) => {
            vis(z[0].value)
        })
        common['TheDesk:postClearbox'] = asValue.FN_NATIVE(() => {
            clear()
        })
        common['TheDesk:postExec'] = asValue.FN_NATIVE(() => {
            if (getMeta(exe).apiPost) post()
        })
    }
    common['TheDesk:console'] = asValue.FN_NATIVE((z) => {
        console.log(z[0].value)
    })
    const as = new AiScript(common)
    if (exe) as.exec(asParse(exe))
}
