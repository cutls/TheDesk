//お気に入り登録やブースト等、フォローやブロック等

import Swal from "sweetalert2"
import { Account, Search, Toot } from "../../interfaces/MastodonApiReturns"
import { dropdownInitGetInstance, formSelectInit, toast } from "../common/declareM"
import api from "../common/fetch"
import lang from "../common/lang"
import { execCopy } from "../platform/end"
import { columnReload } from "../tl/tl"
import { show, mdCheck } from "../ui/postBox"
import { showReq, showDom } from "../userdata/hisData"
import { cw, IVis, vis } from "./secure"
import { reEx } from "./useTxtBox"
import $ from 'jquery'

//お気に入り登録
export async function fav(id: string, acctId: string, remote: boolean) {
    const flag = $(`.cvo[unique-id=${id}]`).hasClass('faved') ? 'unfavourite' : 'favourite'
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
    let json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })

    if (json.reblog) json = json.reblog
    if (!remote) {
        //APIのふぁぼカウントがおかしい
        let fav = json.favourites_count
        if ($('[unique-id=${id}] .fav_ct').text() === json.favourites_count) {
            if (flag === 'unfavourite') {
                let fav = json.favourites_count - 1
                if (fav < 0) fav = 0
            }
        }
        $(`[unique-id=${id}] .fav_ct`).text(fav)
        $(`[unique-id=${id}] .rt_ct`).text(json.reblogs_count)
        if ($(`[unique-id=${id}]`).hasClass('faved')) {
            $(`[unique-id=${id}]`).removeClass('faved')
            $(`.fav_${id}`).removeClass('yellow-text')
        } else {
            $(`[unique-id=${id}]`).addClass('faved')
            $(`.fav_${id}`).addClass('yellow-text')
        }
    } else {
        toast({ html: lang.lang_status_favWarn, displayLength: 1000 })
    }
}

//ブースト
export async function rt(id: string, acctId: string, remote: boolean, vis?: IVis) {
    const flag = $(`.cvo[toot-id=${id}]`).hasClass('rted') ? 'unreblog' : 'reblog'
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
    let json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        },
        body: vis ? { visibility: vis } : undefined
    })
    if (json.reblog) {
        json = json.reblog
    }
    console.log(['Success: boost', json])
    $('[toot-id=' + id + '] .fav_ct').text(json.favourites_count)
    let rt = json.reblogs_count
    if (!json.reblog) {
        rt = rt - 1
        if (flag === 'unreblog') {
            if (rt * 1 < 0) {
                rt = 0
            }
        }
    }
    $(`[toot-id=${id}] .rt_ct`).text(rt)

    if ($(`[toot-id=${id}]`).hasClass('rted')) {
        $(`[toot-id=${id}]`).removeClass('rted')
        $('.rt_' + id).removeClass('light-blue-text')
    } else {
        $(`[toot-id=${id}]`).addClass('rted')
        $('.rt_' + id).addClass('light-blue-text')
    }
}

export function boostWith(vis) {
    const id = $('#tootmodal').attr('data-id')
    const acctId = $('#tootmodal').attr('data-acct')
    if (!id || !acctId) return Swal.fire(`No toot`)
    rt(id, acctId, false, vis)
}
//ブックマーク
export async function bkm(id: string, acctId: string) {
    const flag = $(`.cvo[unique-id=${id}]`).hasClass('bkmed') ? 'unbookmark' : 'bookmark'
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
    let json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
    if (json.reblog) json = json.reblog
    const fav = json.favourites_count
    $(`[toot-id=${id}] .fav_ct`).text(fav)
    $(`[toot-id=${id}] .rt_ct`).text(json.reblogs_count)
    if (flag === 'unbookmark') {
        $('.bkmStr_' + id).text(lang.lang_parse_bookmark)
        $('.bkm_' + id).removeClass('red-text')
        $(`[toot-id=${id}]`).removeClass('bkmed')
    } else {
        $('.bkmStr_' + id).text(lang.lang_parse_unbookmark)
        $('.bkm_' + id).addClass('red-text')
        $(`[toot-id=${id}]`).addClass('bkmed')
    }
    const tlidTar = $(`.bookmark-timeline[data-acct=${acctId}]`).attr('tlid') || '0'
    columnReload(tlidTar, 'bookmark')
}

//フォロー
export async function follow(acctId: string, resolve: boolean) {
    const locked = $('#his-data').hasClass('locked')
    if (!acctId && acctId !== 'selector') {
        acctId = $('#his-data').attr('use-acct') || ''
    } else if (acctId === 'selector') {
        acctId = $('#user-acct-sel').val()?.toString() || ''
    }
    let flag = 'follow'
    if (!resolve && $('#his-data').hasClass('following')) {
        flag = 'unfollow'
    }

    let id = $('#his-data').attr('user-id')
    if (resolve) {
        const fullacct = $('#his-acct').attr('fullname')
        if (!fullacct) return toast('Error')
        const data = await acctResolve(acctId, fullacct)
        if (!data) return toast(`Error to resolve account ${fullacct}`)
        id = data.id
        console.log(id)
    }
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
    const json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
    console.log(['Success: folllow', json])
    if ($('#his-data').hasClass('following')) {
        $('#his-data').removeClass('following')
        $('#his-follow-btn-text').text(lang.lang_status_follow)
    } else {
        $('#his-data').addClass('following')
        if (locked) {
            $('#his-follow-btn-text').text(lang.lang_status_requesting)
        } else {
            $('#his-follow-btn-text').text(lang.lang_status_unfollow)
        }
    }
}
export async function acctResolve(acctId: string, user: string) {
    console.log('Get user data of ' + user)
    const domain = localStorage.getItem(`domain_${acctId}`) || ''
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const options = {
        method: 'get' as const,
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at,
        },
    }
    try {
        const start = `https://${domain}/api/v1/accounts/lookup?acct=${user}`
        const idJson = await api<Account>(start, options)
        if (idJson) {
            return idJson
        } else {
            return await acctResolveLegacy(domain, user, options)
        }
    } catch {
        return await acctResolveLegacy(domain, user, options)
    }
}
export async function acctResolveLegacy(domain: string, user: string, options: any) {
    console.log(`Get user data of ${user} with legacy method`)
    try {
        const start = 'https://' + domain + '/api/v2/search?resolve=true&q=' + user
        const idJson = await api<Search>(start, options)
        if (idJson.accounts[0]) {
            return idJson.accounts[0]
        } else {
            toast({ html: lang.lang_fatalerroroccured, displayLength: 2000 })
        }
    } catch {
        console.log('Error occured on searching and fetching with resolve')
    }
}
//ブロック
export async function block(acctId: string) {
    if (!acctId) acctId = $('#his-data').attr('use-acct') || ''
    const isBlock = $('#his-data').hasClass('blocking')
    const flag = isBlock ? 'unblock' : 'block'
    const txt = isBlock ? lang.lang_status_unblock : lang.lang_status_block
    const result = await Swal.fire({
        title: txt,
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: lang.lang_yesno,
        cancelButtonText: lang.lang_no,
    })
    if (result.value) {
        const id = $('#his-data').attr('user-id')
        const domain = localStorage.getItem(`domain_${acctId}`)
        const at = localStorage.getItem(`acct_${acctId}_at`)
        const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
        const json = await api(start, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + at
            },
        })
        if ($('#his-data').hasClass('blocking')) {
            $('#his-data').removeClass('blocking')
            $('#his-block-btn-text').text(lang.lang_status_block)
        } else {
            $('#his-data').addClass('blocking')
            $('#his-block-btn-text').text(lang.lang_status_unblock)
        }
    }
}

//ミュート
export async function muteDo(acctId: string) {
    if (!acctId) acctId = $('#his-data').attr('use-acct') || ''
    const isBlock = $('#his-data').hasClass('muting')
    const flag = isBlock ? 'unblock' : 'block'
    const txt = isBlock ? lang.lang_status_unmute : lang.lang_status_mute
    const result = await Swal.fire({
        title: txt,
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: lang.lang_yesno,
        cancelButtonText: lang.lang_no,
    })
    if (result.value) {
        const id = $('#his-data').attr('user-id')
        const domain = localStorage.getItem(`domain_${acctId}`)
        const at = localStorage.getItem(`acct_${acctId}_at`)
        const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
        const days = parseInt($('#days_mute').val()?.toString() || '0', 10)
        const hours = parseInt($('#hours_mute').val()?.toString() || '0', 10)
        const mins = parseInt($('#mins_mute').val()?.toString() || '0', 10)
        const notf = $('#notf_mute:checked').val() === '1'
        const duration = days * 24 * 60 * 60 + hours * 60 + mins
        const q: any = {
            notifications: notf
        }
        if (duration > 0) q.duration = duration * 60
        if (days < 0 || hours < 0 || mins < 0) return Swal.fire('Invalid number')
        const json = await api(start, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + at
            },
            body: q
        })
        if ($('#his-data').hasClass('blocking')) {
            $('#his-data').removeClass('blocking')
            $('#his-block-btn-text').text(lang.lang_status_block)
        } else {
            $('#his-data').addClass('blocking')
            $('#his-block-btn-text').text(lang.lang_status_unblock)
        }
    }
}
export function muteMenu() {
    $('#muteDuration').toggleClass('hide')
    !$('#muteDuration').hasClass('hide') ? $('#his-des').css('max-height', '112px') : $('#his-des').css('max-height', '196px')
}
export function muteTime(day: number, hour: number, min: number) {
    $('#days_mute').val(day)
    $('#hours_mute').val(hour)
    $('#mins_mute').val(min)
}

//投稿削除
export async function del(id: string, acctId: string) {
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/statuses/${id}`
    const json = await api(start, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
    return json
}
//redraft
export async function redraft(id: string, acctId: string) {
    const result = await Swal.fire({
        title: lang.lang_status_redraftTitle,
        text: lang.lang_status_redraft,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: lang.lang_yesno,
        cancelButtonText: lang.lang_no,
    })
    if (result.value) {
        show()
        const json = await del(id, acctId)
        draftToPost(json, acctId)
    }
}
// edit
export async function editToot(id: string, acctId: string) {
    show()
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/statuses/${id}/source`
    const json = await api(start, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        },
    })
    draftToPost(json, acctId, id)
}

export function draftToPost(json: Toot, acctId: string, id?: string) {
    $('#post-acct-sel').prop('disabled', true)
    $('#post-acct-sel').val(acctId)
    formSelectInit($('select'))
    if (id) $('#tootmodal').attr('data-edit', id)
    mdCheck()
    const mediaCk = json.media_attachments ? json.media_attachments[0] : null
    //メディアがあれば
    const media_ids: string[] = []
    if (mediaCk) {
        for (let i = 0; i <= 4; i++) {
            if (!json.media_attachments[i]) break
            media_ids.push(json.media_attachments[i].id)
            $('#preview').append(`<img src="${json.media_attachments[i].preview_url}" style="width:50px; max-height:100px;">`)

        }
    }
    const visMode = json.visibility
    vis(visMode)
    const medias = media_ids.join(',')
    $('#media').val(medias)
    localStorage.setItem('nohide', 'true')
    show()
    const html = json.text || json.content
    $('#textarea').val(html)
    if (json.spoiler_text) {
        cw(true)
        $('#cw-text').val(json.spoiler_text)
    }
    if (json.sensitive) {
        $('#nsfw').addClass('yellow-text')
        $('#nsfw').html('visibility')
        $('#nsfw').addClass('nsfw-avail')
    }
    if (json.in_reply_to_id) $('#reply').val(json.in_reply_to_id)
}
//ピン留め
export async function pin(id: string, acctId: string) {
    const flag = $(`.cvo[unique-id=${id}]`).hasClass('pined') ? 'unpin' : 'pin'
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
    const json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        },
    })
    console.log(['Success: pinned', json])
    if (flag === 'unpin') {
        $(`[toot-id=${id}]`).removeClass('pined')
        $('.pin_' + id).removeClass('blue-text')
        $('.pinStr_' + id).text(lang.lang_parse_pin)
    } else {
        $(`[toot-id=${id}]`).addClass('pined')
        $('.pin_' + id).addClass('blue-text')
        $('.pinStr_' + id).text(lang.lang_parse_unpin)
    }
}

//フォロリク
export async function request(id: string, flag: 'authorize' | 'reject', acctId: string) {
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/follow_requests/${id}/${flag}`
    const json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
    showReq('', acctId)
}

//ドメインブロック
export async function domainBlock(add: string, isPositive: boolean, acctId?: string) {
    if (!acctId) acctId = $('#his-data').attr('use-acct')
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/domain_blocks`
    const json = await api(start, {
        method: isPositive ? 'post' : 'delete',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        },
        body: { domain: add }
    })
    showDom('', acctId || '0')
}

export function addDomainblock() {
    const domain = $('#domainblock').val()?.toString() || ''
    if (!domain) return Swal.fire(`No instance`)
    domainBlock(domain, true)
}
//ユーザー強調
export function empUser() {
    const usr = localStorage.getItem('user_emp') || '[]'
    const obj: string[] = JSON.parse(usr)
    const id = $('#his-acct').attr('fullname')
    if (!id) return
    if (!obj) {
        const obj = [id]
        const json = JSON.stringify(obj)
        localStorage.setItem('user_emp', json)
        toast({ html: id + lang.lang_status_emphas, displayLength: 4000 })
    } else {
        let can = false
        let key = 0
        for (const usT of obj) {
            if (usT !== id && !can) {
                can = false
            } else {
                can = true
                obj.splice(key, 1)
                toast({ html: id + lang.lang_status_unemphas, displayLength: 4000 })
            }
            key++
        }
    }
}
//Endorse
export async function pinUser() {
    const id = $('#his-data').attr('user-id')
    const acctId = $('#his-data').attr('use-acct')
    if (!acctId) return
    const flag = $('#his-end-btn').hasClass('endorsed') ? 'unpin' : 'pin'
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
    const json = await api(start, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
    if ($('#his-end-btn').hasClass('endorsed')) {
        $('#his-end-btn').removeClass('endorsed')
        $('#his-end-btn').text(lang.lang_status_endorse)
    } else {
        $('#his-end-btn').addClass('endorsed')
        $('#his-end-btn').text(lang.lang_status_unendorse)
    }
}
//URLコピー
export function tootUriCopy(url: string) {
    execCopy(url)
    toast({ html: lang.lang_details_url, displayLength: 1500 })
}

//他のアカウントで…
export async function staEx(mode: 'rt' | 'fav' | 'reply') {
    const url = $('#tootmodal').attr('data-url')
    const acctId = $('#status-acct-sel').val()?.toString()
    if (!acctId) return
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v2/search?resolve=true&q=${url}`
    const json = await api<Search>(start, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + at
        }
    })
    if (json.statuses) {
        if (json.statuses[0]) {
            const id = json.statuses[0].id
            if (mode === 'rt') {
                rt(id, acctId, true)
            } else if (mode === 'fav') {
                fav(id, acctId, true)
            } else if (mode === 'reply') {
                reEx(id)
            }
        }
    }
    return
}

export function toggleAction(elm: NodeListOf<Element> | HTMLElement | JQuery<HTMLElement>) {
    const instance = dropdownInitGetInstance(elm)
    instance.open()
}