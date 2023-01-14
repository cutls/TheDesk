/*メディアフィルター機能*/

import { FilterV1 } from "../../interfaces/MastodonApiReturns"
import { IColumnType } from "../../interfaces/Storage"
import { toast } from "../common/declareM"
import api from "../common/fetch"
import lang from "../common/lang"
import { getColumn } from "../common/storage"
import { escapeHTML, stripTags } from "../platform/first"
import { date } from "./date"
import { columnReload } from "./tl"
type IFilterType = 'home' | 'local' | 'notf' | 'pub' | 'notifications' | 'public' | 'thread' | 'account' | 'mix' | 'none'

//各TL上方のMedia[On/Off]
export function mediaToggle(tlid: string) {
    const media = localStorage.getItem('media_' + tlid)
    if (media) {
        localStorage.removeItem('media_' + tlid)
        $('#sta-media-' + tlid).text('Off')
        $('#sta-media-' + tlid).css('color', 'red')
        $('#timeline_' + tlid).removeClass('media-filter')
    } else {
        localStorage.setItem('media_' + tlid, 'true')
        $('#sta-media-' + tlid).text('On')
        $('#sta-media-' + tlid).css('color', '#009688')
        $('#timeline_' + tlid).addClass('media-filter')
    }
}
/* Remote only */
export function remoteOnly(tlid: string, type: IColumnType) {
    const obj = getColumn()
    if (obj[tlid].data) {
        if (obj[tlid].data.remote) {
            obj[tlid].data.remote = false
            const json = JSON.stringify(obj)
            localStorage.setItem('column', json)
            $('#sta-remote-' + tlid).text('Off')
            $('#sta-remote-' + tlid).css('color', '#009688')
        } else {
            obj[tlid].data.remote = true
            const json = JSON.stringify(obj)
            localStorage.setItem('column', json)
            $('#sta-remote-' + tlid).text('On')
            $('#sta-remote-' + tlid).css('color', 'red')
        }
    } else {
        obj[tlid].data = {}
        obj[tlid].data.remote = true
        const json = JSON.stringify(obj)
        localStorage.setItem('column', json)
        $('#sta-remote-' + tlid).text('On')
        $('#sta-remote-' + tlid).css('color', 'red')
    }
    columnReload(tlid, type)
}

export function remoteOnlyCk(tlid: string) {
    const obj = getColumn()
    if (obj[tlid].data) {
        if (obj[tlid].data.remote) {
            $('#sta-remote-' + tlid).text('On')
            $('#sta-remote-' + tlid).css('color', 'red')
            return true
        }
    }
    return false
}
//各TL上方のBT[BTOnly/BTExc/Off]
export function ebtToggle(tlid: string) {
    const ebt = localStorage.getItem('ebt_' + tlid)
    if (ebt === 'true') {
        localStorage.setItem('ebt_' + tlid, 'but')
        $('#sta-bt-' + tlid).text('BT Only')
        $('#sta-bt-' + tlid).css('color', '#ff9800')
        $('#timeline_' + tlid).addClass('except-bt-filter')
        $('#timeline_' + tlid).removeClass('bt-filter')
    } else if (ebt === 'but') {
        localStorage.removeItem('ebt_' + tlid)
        $('#sta-bt-' + tlid).text('Off')
        $('#sta-bt-' + tlid).css('color', 'red')
        $('#timeline_' + tlid).removeClass('bt-filter')
        $('#timeline_' + tlid).removeClass('except-bt-filter')
    } else {
        localStorage.setItem('ebt_' + tlid, 'true')
        $('#sta-bt-' + tlid).text('BT Ex')
        $('#sta-bt-' + tlid).css('color', '#009688')
        $('#timeline_' + tlid).addClass('bt-filter')
        $('#timeline_' + tlid).removeClass('except-bt-filter')
    }
}
//各TL上方のMedia[On/Off]をチェック
export function mediaCheck(tlid: string) {
    const media = localStorage.getItem('media_' + tlid)
    if (media) {
        $('#sta-media-' + tlid).text('On')
        $('#sta-media-' + tlid).css('color', '#009688')
        $('#timeline_' + tlid).addClass('media-filter')
    } else {
        $('#sta-media-' + tlid).text('Off')
        $('#sta-media-' + tlid).css('color', 'red')
        $('#timeline_' + tlid).removeClass('media-filter')
    }
}
//各TL上方のBT[On/Off]をチェック
export function ebtCheck(tlid: string) {
    const ebt = localStorage.getItem('ebt_' + tlid)
    if (ebt === 'true') {
        $('#sta-bt-' + tlid).text('BT Ex')
        $('#sta-bt-' + tlid).css('color', '#009688')
        $('#timeline_' + tlid).addClass('bt-filter')
        $('#timeline_' + tlid).removeClass('except-bt-filter')
    } else if (ebt === 'but') {
        $('#sta-bt-' + tlid).text('BT Only')
        $('#sta-bt-' + tlid).css('color', '#ff9800')
        $('#timeline_' + tlid).addClass('except-bt-filter')
        $('#timeline_' + tlid).removeClass('bt-filter')
    } else {
        $('#sta-bt-' + tlid).text('Off')
        $('#sta-bt-' + tlid).css('color', 'red')
        $('#timeline_' + tlid).removeClass('bt-filter')
        $('#timeline_' + tlid).removeClass('except-bt-filter')
    }
}

/*ワードフィルター機能*/
export function filterMenu() {
    $('#left-menu a').removeClass('active')
    $('#filterMenu').addClass('active')
    $('.menu-content').addClass('hide')
    $('#filter-box').removeClass('hide')
}

export async function filter() {
    $('#filtered-words').html('')
    $('#filter-edit-id').val('')
    const acctId = $('#filter-acct-sel').val()
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/filters`
    const json = await api<FilterV1[]>(start, {
        method: 'get',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at
        }
    })
    if (json) {
        let filters = ''
        for (const filterWord of json) {
            const context = filterWord.context.join(',')
            filters =
                filters +
                escapeHTML(filterWord.phrase) +
                `<span class="sml">(for ${context})</span>:
                <a onclick="filterEdit('${filterWord.id}','${acctId}')" class="pointer">
                    ${lang.lang_edit}
                </a>/
                <a onclick="filterDel('${filterWord.id}','${acctId}')" class="pointer">
                    ${lang.lang_del}
                </a><br> `
        }
        if (filters === '') filters = lang.lang_filter_nodata + '<br>'
        $('#filtered-words').html(filters)
    } else {
        $('#filtered-words').html(lang.lang_filter_nodata)
    }
}

export function filterTime(day: number, hour: number, min: number) {
    $('#days_filter').val(day)
    $('#hours_filter').val(hour)
    $('#mins_filter').val(min)
}

export async function makeNewFilter() {
    const acctId = $('#filter-acct-sel').val()?.toString() || '0'
    const phr = $('#filter-add-word').val()
    const cont: FilterV1['context'] = []
    if ($('#home_filter:checked').val()) {
        cont.push('home')
    }
    if ($('#local_filter:checked').val()) {
        cont.push('public')
    }
    if ($('#notf_filter:checked').val()) {
        cont.push('notifications')
    }
    if ($('#conv_filter:checked').val()) {
        cont.push('thread')
    }
    if ($('#prof_filter:checked').val()) {
        cont.push('account')
    }
    if (!cont.length) toast(`Error:${lang.lang_filter_errordegree}`)
    const exc = !!$('#except_filter:checked').val()
    const who = !!$('#wholeword_filter:checked').val()
    const time = parseInt($('#days_filter').val()?.toString() || '0', 10) * 24 * 60 * 60 + parseInt($('#hours_filter').val()?.toString() || '0', 10) * 60 * 60 + parseInt($('#mins_filter').val()?.toString() || '0', 10) * 60
    const domain = localStorage.getItem('domain_' + acctId)
    const at = localStorage.getItem('acct_' + acctId + '_at')
    let start = `https://${domain}/api/v1/filters`
    let method: 'post' | 'put' = 'post'
    if ($('#filter-edit-id').val()) {
        start = `https://${domain}/api/v1/filters/${$('#filter-edit-id').val()}`
        method = 'put'
    }
    const json = await api(start, {
        method,
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at
        },
        body: {
            phrase: phr,
            context: cont,
            irreversible: exc,
            whole_word: who,
            expires_in: time,
        }
    })
    filter()
    filterUpdate(acctId)
    $('#filter-add-word').val('')
    $('#home_filter').prop('checked', false)
    $('#local_filter').prop('checked', false)
    $('#notf_filter').prop('checked', false)
    $('#conv_filter').prop('checked', false)
    $('#prof_filter').prop('checked', false)
    $('#except_filter').prop('checked', false)
    $('#wholeword_filter').prop('checked', false)
    $('#days_filter').val('0')
    $('#hours_filter').val('0')
    $('#mins_filter').val('0')
    $('#add-filter-btn').text(lang.lang_add)
    $('#filter-edit-id').val('')
}

export async function filterEdit(id: string, acctId: string) {
    $('#filter-add-word').val('')
    $('#home_filter').prop('checked', false)
    $('#local_filter').prop('checked', false)
    $('#notf_filter').prop('checked', false)
    $('#conv_filter').prop('checked', false)
    $('#except_filter').prop('checked', false)
    $('#wholeword_filter').prop('checked', false)
    $('#days_filter').val('0')
    $('#hours_filter').val('0')
    $('#mins_filter').val('0')
    $('#add-filter-btn').text(lang.lang_edit)
    $('#filter-edit-id').val(id)
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/filters/${id}`
    const json = await api<FilterV1>(start, {
        method: 'get',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at
        }
    })
    const now = Math.floor(new Date().getTime() / 1000)
    $('#filter-add-word').val(json.phrase)
    for (const context of json.context) $('[value=' + context + ']').prop('checked', true)
    if (json.irreversible) $('#except_filter').prop('checked', true)
    if (json.whole_word) $('#wholeword_filter').prop('checked', true)
    const exp = date(json.expires_at || new Date().toISOString(), 'unix')
    if (typeof exp === 'string') return
    const expires = exp - now
    const mins = Math.floor(expires / 60) % 60
    const hours = Math.floor(expires / 3600) % 24
    const days = Math.floor(expires / 3600 / 24)
    $('#days_filter').val(days)
    $('#hours_filter').val(hours)
    $('#mins_filter').val(mins)
}

export async function filterDel(id: string, acctId: string) {
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/filters/${id}`
    const json = await api(start, {
        method: 'delete',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at
        }
    })
    filter()
    filterUpdate(acctId)
}

export async function getFilter(acctId: string) {
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/filters/`
    const json = await api<FilterV1[]>(start, {
        method: 'get',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at
        }
    })
    localStorage.setItem('filter_' + acctId, JSON.stringify(json))
}

export function getFilterType(json: FilterV1[], typeR: IFilterType) {
    if (!json) return []
    let type: string = typeR
    if (type === 'local') {
        type = 'public'
    } else if (type === 'list') {
        type = 'home'
    } else if (type === 'notf') {
        type = 'notifications'
    }
    const mutedFilters: string[] = []
    for (const filterWord of json) {
        const phrases = filterWord.phrase
        const arr = filterWord.context
        if (arr.join(',').indexOf(type) !== -1) {
            mutedFilters.push(phrases)
        } else if (type === 'mix') {
            if (arr.indexOf('home') !== -1 || arr.indexOf('public') !== -1) {
                mutedFilters.push(phrases)
            }
        }
    }
    return mutedFilters
}

export function convertColumnToFilter(column: IColumnType): IFilterType {
    if (column === 'bookmark' || column === 'fav' || column === 'noauth' || column === 'tootsearch' || column === 'webview') return 'none'
    if (column === 'dm') return 'thread'
    if (column === 'home' || column === 'list') return 'home'
    if (column === 'local' || column === 'local-media' || column === 'pub' || column === 'pub-media' || column === 'utl' || column === 'tag') return 'public'
    if (column === 'mix' || column === 'plus') return 'mix'
    if (column === 'notf') return 'notifications'
    return 'none'
}

export function getFilterTypeByAcct(acctId: string, type: IFilterType) {
    if (localStorage.getItem('filter_' + acctId) !== 'undefined') {
        return getFilterType(JSON.parse(localStorage.getItem('filter_' + acctId) || '[]'), type)
    } else {
        return []
    }
}

export async function filterUpdate(acctId: string) {
    const domain = localStorage.getItem(`domain_${acctId}`)
    const at = localStorage.getItem(`acct_${acctId}_at`)
    const start = `https://${domain}/api/v1/filters`
    const json = await api<FilterV1[]>(start, {
        method: 'get',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + at
        }
    })
    localStorage.setItem('filter_' + acctId, JSON.stringify(json))
    filterUpdateInternal(json, 'home', acctId)
    filterUpdateInternal(json, 'local', acctId)
    filterUpdateInternal(json, 'notf', acctId)
    filterUpdateInternal(json, 'pub', acctId)
}

export function filterUpdateInternal(json: FilterV1[], type: IFilterType, acctId: string) {
    let home = getFilterType(json, type)
    const wordMuteRaw = localStorage.getItem('word_mute') || '[]'
    const wordMute = JSON.parse(wordMuteRaw)
    home = home.concat(wordMute)
    if (home) {
        $(`[data-acct=${acctId}] [data-type=${type}] .cvo`).each(function (i, elem) {
            const id = $(elem).attr('toot-id')
            $('[toot-id=' + id + ']').removeClass('hide')
            const text = $(elem).find('.toot').html()
            for (const word of home) {
                const regExp = new RegExp(word.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'), 'g')
                if (stripTags(text).match(regExp)) {
                    $(`[toot-id=${id}]`).addClass('hide')
                }
            }
        })
    }
}
//通知フィルター
export function exclude(key: string) {
    const excTypes: string[] = []
    if ($(`#exc-reply-${key}:checked`).val()) excTypes.push('mention')
    if ($(`#exc-fav-${key}:checked`).val()) excTypes.push('favourite')
    if ($(`#exc-bt-${key}:checked`).val()) excTypes.push('reblog')
    if ($(`#exc-follow-${key}:checked`).val()) excTypes.push('follow')
    if ($(`#exc-poll-${key}:checked`).val()) excTypes.push('poll')
    if ($(`#exc-status-${key}:checked`).val()) excTypes.push('status')
    if ($(`#exc-update-${key}:checked`).val()) excTypes.push('update')
    if ($(`#exc-follow_request-${key}:checked`).val()) excTypes.push('follow_request')
    const excludetxt = excTypes.map(function(el, idx) {
        return `exclude_types[]=${el}`;
    }).join('&');
    localStorage.setItem('exclude-' + key, excludetxt)
    parseColumn(key)
}

export function excludeCk(key: string, target: string) {
    const exc = localStorage.getItem('exclude-' + key)
    if (!exc) return ''
    return ~exc.indexOf(target) ? 'checked' : ''
}

export function checkNotfFilter(tlid: string) {
    const excludetxt = localStorage.getItem('exclude-' + tlid)
    return !excludetxt || excludetxt !== ''
}

export function resetNotfFilter(tlid: string) {
    localStorage.setItem('exclude-' + tlid, '')
    parseColumn(tlid)
}

export function notfFilter(id: string, tlid: string, acctId: string) {
    let excludetxt = localStorage.getItem('exclude-' + tlid)
    if (excludetxt || excludetxt !== '') {
        excludetxt = `${excludetxt}&account_id=${id}`
    } else {
        excludetxt = `?account_id=${id}`
    }
    localStorage.setItem('exclude-' + tlid, excludetxt)
    parseColumn(tlid)
}