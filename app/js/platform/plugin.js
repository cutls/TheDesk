
var plugins = getPlugin()
function getPlugin() {
    const json = localStorage.getItem('plugins')
    let ret = {
        buttonOnPostbox: [],
        buttonOnToot: [],
        buttonOnBottom: [],
        init: [],
        tips: [],
        none: []
    }
    if (!json) return ret
    const plugins = JSON.parse(json)
    for (let plugin of plugins) {
        const meta = getMeta(plugin.content).data
        if (!meta) continue
        const type = meta.event
        ret[type] ? ret[type].push(plugin) : ret[type] = [plugin]
        if (type === 'buttonOnToot') continue
        if (type === 'tips') {
            if (meta.interval) {
                const matchCID = /custom:([abcdef0-9]{8}-[abcdef0-9]{4}-4[abcdef0-9]{3}-[abcdef0-9]{4}-[abcdef0-9]{12})/
                setInterval(function () {
                    const tipsName = localStorage.getItem('tips')
                    if (tipsName.match(matchCID)) {
                        const id = tipsName.match(matchCID)[1]
                        if (id === plugin.id) if (location.href.split('/').pop() === 'index.html') execPlugin(id, 'tips', null)
                    }

                }, meta.interval)
            }
            continue
        }
        const shortcut = meta.shortcut
        $(window).keydown(function (e) {
            if (e.keyCode === shortcut && e.altKey) execPlugin(plugin.id, type)
        })
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
    asCommon['TheDesk:openLink'] = asValue.FN_NATIVE((z) => {
        postMessage(['openUrl', z[0].value], '*')
    })

    const { buttonOnPostbox, init, buttonOnBottom, tips } = plugins
    for (let target of buttonOnPostbox) {
        const meta = getMeta(target.content).data
        $('#dropdown2').append(`<li><a onclick="execPlugin('${target.id}','buttonOnPostbox', null);">${escapeHTML(meta.name)}</a></li>`)
    }
    for (let target of buttonOnBottom) {
        const meta = getMeta(target.content).data
        $('#group .btnsgroup').append(`<a onclick="execPlugin('${target.id}','buttonOnBottom', null);" class="nex waves-effect pluginNex"><span title="${escapeHTML(meta.name)}">${escapeHTML(meta.name).substr(0, 1)}</span></a>`)
    }
    for (let target of tips) {
        const meta = getMeta(target.content).data
        $('#tips-menu .btnsgroup').append(`<a onclick="tips('custom', '${target.id}')" class="nex waves-effect pluginNex"><span title="${escapeHTML(meta.name)}">${escapeHTML(meta.name).substr(0, 1)}</span></a>`)
    }
    for (let target of init) {
        const as = new AiScript(asCommon)
        const meta = getMeta(target.content).data
        M.toast({ html: `${escapeHTML(meta.name)}を実行しました`, displayLength: 1000 })
        if (target) as.exec(asParse(target.content))
    }
}
function getMeta(plugin) {
    try {
        return { success: true, data: AiScript.collectMetadata(asParse(plugin)).get(null) }
    } catch (e) {
        console.error(e)
        return e
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
        let json = await promise.json()
        common.TOOT = asUtil.jsToVal(json)
        common['TheDesk:changeText'] = asValue.FN_NATIVE((z) => {
            const v = sanitizeHtml(z[0].value,
                {
                    allowedTags: ['p', 'br', 'a', 'span'],
                    allowedAttributes: {
                        'a': ['href', 'class', 'rel', 'target'],
                        'span': [],
                        'p': [],
                        'br': [],
                    }
                }).replace(/href="javascript:/, 'href="').replace(/href='javascript:/, 'href="').replace(/href=javascript:/, 'href="')
            json.content = v
            if (getMeta(exe).data.dangerHtml) $(`[unique-id=${args.id}] .toot`).html(parse([json], null, null, null, null, null, null, true))
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
            if (getMeta(exe).data.apiPost) post()
        })
    } else if (source == 'tips') {
        common['TheDesk:refreshTipsView'] = asValue.FN_NATIVE((z) => {
            const v = sanitizeHtml(z[0].value,
                {
                    allowedTags: ['p', 'br', 'a', 'span', 'img'],
                    allowedAttributes: {
                        'a': ['href', 'class', 'rel', 'target', 'style'],
                        'span': ['style'],
                        'p': ['style'],
                        'br': [],
                        'img': ['src', 'style']
                    }
                }).replace(/href="javascript:/, 'href="').replace(/href='javascript:/, 'href="').replace(/href=javascript:/, 'href="')
            if (getMeta(exe).data.dangerHtml) $('#tips-text').html(v)
        })
    }
    common['TheDesk:console'] = asValue.FN_NATIVE((z) => {
        console.log(z[0].value)
    })
    common['TheDesk:api'] = asValue.FN_NATIVE(async (z) => {
        try {
            if (!getMeta(exe).data.apiGet && z[0].value == "GET") return asUtil.jsToVal(null)
            if (!getMeta(exe).data.apiPost && (z[0].value == "POST" || z[0].value == "DELETE" || z[0].value == "PUT")) return asUtil.jsToVal(null)
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
            return asUtil.jsToVal(null)
        }

    })
    common['TheDesk:getRequest'] = asValue.FN_NATIVE(async (z) => {
        try {
            if (!getMeta(exe).data.apiGet) return asUtil.jsToVal(null)
            const start = `https://${z[0].value}`
            const promise = await fetch(start)
            let json = null
            if (z[1].value) {
                json = await promise.json()
            } else {
                json = await promise.text()
            }
            return asUtil.jsToVal(json)
        } catch (e) {
            return asUtil.jsToVal(null)
        }

    })
    const as = new AiScript(common)
    if (exe) as.exec(asParse(exe))
}
async function testExec(exe) {
    asCommon.TOOT = null
    asCommon.ACCT_ID = 0
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
    asCommon['TheDesk:openLink'] = asValue.FN_NATIVE((z) => {
        postMessage(['openUrl', z[0].value], '*')
    })
    asCommon['TheDesk:changeText'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `changeText is cannot use on try exec.`,
			text: '',
		})
        return true
    })
    asCommon['TheDesk:refreshTipsView'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `refreshTipsView is cannot use on try exec.`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:postText'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `postText is cannot use on try exec.`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:postCW'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `postCW is cannot use on try exec.`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:postNSFW'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `postNSFW is cannot use on try exec.`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:postVis'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `postVis is cannot use on try exec.`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:postClearbox'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `postClearbox is cannot use on try exec.`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:postExec'] = asValue.FN_NATIVE((z) => {
        Swal.fire({
			icon: 'info',
			title: `postExec is cannot use on try exec. It only returns {}`,
			text: '',
		})
        return true    
    })
    asCommon['TheDesk:api'] = asValue.FN_NATIVE(async (z) => {
        try {
            if (!getMeta(exe).data.apiGet && z[0].value == "GET") return asUtil.jsToVal(null)
            if (!getMeta(exe).data.apiPost && (z[0].value == "POST" || z[0].value == "DELETE" || z[0].value == "PUT")) return asUtil.jsToVal(null)
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
            return asUtil.jsToVal(null)
        }

    })
    asCommon['TheDesk:getRequest'] = asValue.FN_NATIVE(async (z) => {
        Swal.fire({
			icon: 'info',
			title: `getRequest is cannot use on try exec. It only returns {}`,
			text: '',
		})
        return {}
    })
    try {
        const as = new AiScript(asCommon)
        if (exe) as.exec(asParse(exe))
    } catch (e) {
        console.log(e)
        Swal.fire({
			icon: 'error',
			title: `error on line ${e.location.start.line}`,
			text: e,
		})
    }
}
