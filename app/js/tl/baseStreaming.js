
//MastodonBaseStreaming
var mastodonBaseWs = {}
var mastodonBaseWsStatus = {}
function mastodonBaseStreaming(acct_id) {
    console.log('start to connect mastodonBaseStreaming of ' + acct_id)
    notfCommon(acct_id, 0, false)
    const domain = localStorage.getItem(`domain_${acct_id}`)
    if (mastodonBaseWsStatus[domain]) return
    mastodonBaseWsStatus[domain] = 'undetected'
    const at = localStorage.getItem(`acct_${acct_id}_at`)
    let wss = 'wss://' + domain
    if (localStorage.getItem('streaming_' + acct_id)) {
        wss = localStorage.getItem('streaming_' + acct_id).replace('https://', 'wss://')
    }
    const start = `${wss}/api/v1/streaming/?access_token=${at}`
    mastodonBaseWs[domain] = new WebSocket(start)
    mastodonBaseWs[domain].onopen = function () {
        mastodonBaseWsStatus[domain] = 'connecting'
        setTimeout(function () {
            mastodonBaseWsStatus[domain] = 'available'
        }, 3000)
        mastodonBaseWs[domain].send(JSON.stringify({ type: 'subscribe', stream: 'user' }))
        $('.notice_icon_acct_' + acct_id).removeClass('red-text')
    }
    mastodonBaseWs[domain].onmessage = function (mess) {
        $(`div[data-acct=${acct_id}] .landing`).hide()
        const typeA = JSON.parse(mess.data).event
        if (typeA === 'delete') {
            $(`[unique-id=${JSON.parse(mess.data).payload}]`).hide()
            $(`[unique-id=${JSON.parse(mess.data).payload}]`).remove()
        } else if (typeA === 'update' || typeA === 'conversation') {
            //markers show中はダメ
            const tl = JSON.parse(mess.data).stream
            const obj = JSON.parse(JSON.parse(mess.data).payload)
            const tls = getTlMeta(tl[0], tl, acct_id, obj)
            insertTl(obj, tls)
        } else if (typeA === 'filters_changed') {
            filterUpdate(acct_id)
        } else if (~typeA.indexOf('announcement')) {
            announ(acct_id, tlid)
        } else if (typeA === 'status.update') {
            const tl = JSON.parse(mess.data).stream
            const obj = JSON.parse(JSON.parse(mess.data).payload)
            const tls = getTlMeta(tl[0], tl, acct_id, obj)
            const template = insertTl(obj, tls, true)
            $(`[unique-id=${obj.id}]`).html(template)
            $(`[unique-id=${obj.id}] [unique-id=${obj.id}]`).unwrap()
        } else if (typeA === 'notification') {
            const obj = JSON.parse(JSON.parse(mess.data).payload)
            let template = ''
            localStorage.setItem('lastnotf_' + acct_id, obj.id)
            let popup = localStorage.getItem('popup')
            if (!popup) {
                popup = 0
            }
            if (obj.type !== 'follow' && obj.type !== 'move' && obj.type !== 'request' && obj.type !== 'admin.sign_up') {
                template = parse([obj], 'notf', acct_id, 'notf', popup)
            } else if (obj.type === 'follow_request') {
                template = userParse([obj.account], 'request', acct_id, 'notf', -1)
            } else {
                template = userParse([obj], obj.type, acct_id, 'notf', popup)
            }
            if (!$('div[data-notfIndv=' + acct_id + '_' + obj.id + ']').length) {
                $('div[data-notf=' + acct_id + ']').prepend(template)
                $('div[data-const=notf_' + acct_id + ']').prepend(template)
            }
            timeUpdate()
        } else {
            console.error('unknown type ' + typeA)
        }
    }
    mastodonBaseWs[domain].onerror = function (error) {
        notfCommon(acct_id, 0, true) //fallback
        console.error('Error closing ' + domain)
        console.error(error)
        if (mastodonBaseWsStatus[domain] === 'available') {
            /*toast({
                html:
                    `${lang.lang_parse_disconnected}<button class="btn-flat toast-action" onclick="location.reload()">${lang.lang_layout_reconnect}</button>`,
                completeCallback: function () {
                    parseColumn()

                },
                displayLength: 3000
            })*/
            parseColumn()
        }
        mastodonBaseWsStatus[domain] = 'cannotuse'
        setTimeout(function () {
            mastodonBaseWsStatus[domain] = 'cannotuse'
        }, 3000)
        mastodonBaseWs[domain] = false
        return false
    }
    mastodonBaseWs[domain].onclose = function () {
        notfCommon(acct_id, 0, true) //fallback
        console.warn('Closing ' + domain)
        if (mastodonBaseWsStatus[domain] === 'available') {
            /*toast({
                html:
                    `${lang.lang_parse_disconnected}<button class="btn-flat toast-action" onclick="location.reload()">${lang.lang_layout_reconnect}</button>`,
                completeCallback: function () {
                    parseColumn()

                },
                displayLength: 3000
            })*/
            parseColumn()
        }
        mastodonBaseWs[domain] = false
        mastodonBaseWsStatus[domain] = 'cannotuse'
        setTimeout(function () {
            mastodonBaseWsStatus[domain] = 'cannotuse'
        }, 3000)
        return false
    }
}
function insertTl(obj, tls, dry) {
    for (const timeline of tls) {
        const { id, voice, type, acct_id } = timeline
        const mute = getFilterTypeByAcct(acct_id, type)
        if ($(`#unread_${id} .material-icons`).hasClass('teal-text')) continue
        if (!$(`#timeline_${id} [toot-id=${obj.id}]`).length) {
            if (voice) {
                say(obj.content)
            }
            const template = parse([obj], type, acct_id, id, '', mute, type)
            if (dry) return template
            console.log($(`#timeline_box_${id}_box .tl-box`).scrollTop(), `timeline_box_${id}_box .tl-box`)
            if (
                $(`#timeline_box_${id}_box .tl-box`).scrollTop() === 0
            ) {
                $(`#timeline_${id}`).prepend(template)
            } else {
                let pool = localStorage.getItem('pool_' + id)
                if (pool) {
                    pool = template + pool
                } else {
                    pool = template
                }
                localStorage.setItem('pool_' + id, pool)
            }
            scrollck()
            additional(acct_id, id)
            timeUpdate()
        }
    }
}
function getTlMeta(type, data, num, status) {
    const acct_id = num.toString()
    const columns = localStorage.getItem('column')
    const obj = JSON.parse(columns)
    let ret = []
    let i = -1
    switch (type) {
        case 'user':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'mix' || tl.type === 'home') {
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'public:local':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'mix' || tl.type === 'local') {
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'public:local:media':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'local-media') {
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'public':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'pub') {
                    console.log(i, tl)
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'public:media':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'pub-media') {
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'list':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'list' && tl.data === data[1]) {
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'direct':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                if (tl.type === 'dm') {
                    let voice = false
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        case 'hashtag':
            for (const tl of obj) {
                i++
                if (tl.domain !== acct_id) continue
                const columnDataRaw = tl.data
                let columnData
                if (!columnDataRaw.name) {
                    columnData = { name: columnDataRaw }
                } else {
                    columnData = columnDataRaw
                }
                if (tl.type === 'tag') {
                    let voice = false
                    let can = false
                    if (columnData.name === data[1]) can = true
                    //any
                    if (columnData.any.split(',').includes(data[1])) can = true
                    //all
                    const { tags } = status
                    if (columnData.all) can = true
                    for (const { name } of tags) {
                        if (!columnData.all.split(',').includes(name)) {
                            can = false
                            break
                        }
                    }
                    //none
                    if (columnData.none) can = true
                    for (const { name } of tags) {
                        if (columnData.none.split(',').includes(name)) {
                            can = false
                            break
                        }
                    }
                    if (localStorage.getItem('voice_' + i)) voice = true
                    ret.push({
                        id: i,
                        voice: voice,
                        type: tl.type,
                        acct_id: tl.domain
                    })
                }
            }
            break
        default:
            console.error('Cannot catch')
    }
    return ret
}