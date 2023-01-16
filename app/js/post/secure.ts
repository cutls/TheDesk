/*保護系*/
//画像保護
import $ from 'jquery'
import { StatusTheDeskExtend } from '../../interfaces/MastodonApiRequests'
import { dropdownInitGetInstance } from '../common/declareM'
import lang from '../common/lang'
import { getMulti } from '../common/storage'
import { idata } from '../login/instance'

import { escapeHTML, formatTime } from '../platform/first'
import { post } from './post'
import { draftToPost } from './status'

export function nsfw(force?: boolean) {
	if (force || !$('#nsfw').hasClass('nsfw-avail')) {
		$('#nsfw').addClass('yellow-text')
		$('#nsfw').html('visibility')
		$('#nsfw').addClass('nsfw-avail')
	} else {
		$('#nsfw').removeClass('yellow-text')
		$('#nsfw').html('visibility_off')
		$('#nsfw').removeClass('nsfw-avail')
	}
}

//投稿公開範囲
export type IVis = 'public' | 'unlisted' | 'private' | 'direct' | 'limited' | 'local' | 'inherit'
export const isIVis = (item: string): item is IVis => ['public', 'unlisted', 'private', 'direct', 'limited', 'local', 'inherit'].includes(item)
export function vis(set: IVis) {
	$('#vis').text(set)
	$('#vis-icon').removeClass('red-text')
	$('#vis-icon').removeClass('orange-text')
	$('#vis-icon').removeClass('blue-text')
	$('#vis-icon').removeClass('purple-text')
	$('#vis-icon').removeClass('light-blue-text')
	$('#vis-icon').removeClass('teal-text')
	if (set === 'public') {
		$('#vis-icon').text('public')
		$('#vis-icon').addClass('purple-text')
	} else if (set === 'unlisted') {
		$('#vis-icon').text('lock_open')
		$('#vis-icon').addClass('blue-text')
	} else if (set === 'private') {
		$('#vis-icon').text('lock')
		$('#vis-icon').addClass('orange-text')
	} else if (set === 'direct') {
		$('#vis-icon').text('mail')
		$('#vis-icon').addClass('red-text')
	} else if (set === 'limited') {
		$('#vis-icon').text('group')
		$('#vis-icon').addClass('teal-text')
	} else if (set === 'local') {
		$('#vis-icon').text('visibility')
		$('#vis-icon').addClass('light-blue-text')
	}
	const vis = localStorage.getItem('vis')
	if (vis === 'memory') {
		const acct_id = $('#post-acct-sel').val()
		localStorage.setItem('vis-memory-' + acct_id, set)
	}
	const ins = dropdownInitGetInstance($('#dropdown1'))
	if (ins) ins.close()
}
export function loadVis() {
	const vist = localStorage.getItem('vis')
	if (!vist) {
		vis('public')
	} else {
		if (vist === 'memory') {
			const acct_id = $('#post-acct-sel').val()
			let memory = localStorage.getItem('vis-memory-' + acct_id)
			if (!memory) memory = 'public'
			if (!isIVis(memory)) return
			vis(memory)
		} else if (vist === 'useapi') {
			const acct_id = parseInt($('#post-acct-sel').val()?.toString() || '0', 10)
			const obj = getMulti()
			let memory = obj[acct_id].vis
			memory = 'public'
			if (!isIVis(memory)) return
			vis(memory)
		} else {
			if (!isIVis(vist)) return
			vis(vist)
		}
	}
}

//コンテントワーニング
export function cw(force?: boolean) {
	if (force || !$('#cw').hasClass('cw-avail')) {
		$('#cw-text').show()
		$('#cw').addClass('yellow-text')
		$('#cw').addClass('cw-avail')
		const cwt = localStorage.getItem('cw-text')
		if (cwt) {
			$('#cw-text').val(cwt)
		}
	} else {
		$('#cw-text').val()
		$('#cw-text').hide()
		$('#cw').removeClass('yellow-text')
		$('#cw').removeClass('cw-avail')
	}
}
//TLでコンテントワーニングを表示トグル
export function cwShow(e: any) {
	$(e).parent().parent().find('.cw_hide').toggleClass('cw')
	$(e).parent().find('.cw_long').toggleClass('hide')
}
$(function () {
	$('#cw-text').on('change', function () {
		const acct_id = $('#post-acct-sel').val()
		const domain = localStorage.getItem('domain_' + acct_id)
		const cwlen = $('#cw-text').val()?.toString().length || 0
		$('#textarea').attr('data-length', (idata[domain + '_letters'] || 500) - cwlen)
	})
})
//スケジュール
export function schedule() {
	if ($('#sch-box').hasClass('sch-avail')) {
		$('#sch-box').hide()
		$('#sch-box').removeClass('sch-avail')
	} else {
		const date = new Date()
		$('#sch-box').show()
		$('#sch-date').val(formatTime(date))
		$('#sch-box').addClass('sch-avail')
	}
}

//下書き機能
export function draftToggle(force?: boolean) {
	if ($('#draft').hasClass('hide') || force) {
		$('#draft').removeClass('hide')
		$('#right-side').show()
		$('#right-side').css('width', '300px')
		$('#left-side').css('width', 'calc(100% - 300px)')
		const width = parseInt((localStorage.getItem('postbox-width') || '300px').replace('px', ''), 10) + 300
		$('#post-box').css('width', width + 'px')
		$('#suggest').html('')
		$('#draft').html('')
		draftDraw()
	} else {
		$('#poll').addClass('hide')
		$('#draft').addClass('hide')
		$('#right-side').hide()
		$('#right-side').css('width', '300px')
		$('#emoji').addClass('hide')
		$('#suggest').html('')
		$('#draft').html('')
		$('#left-side').css('width', '100%')
		const width = parseInt((localStorage.getItem('postbox-width') || '300px').replace('px', ''), 10)
		$('#post-box').css('width', width + 'px')
	}
}
function draftDraw() {
	const draft = localStorage.getItem('draft')
	let html = `<button class="btn waves-effect green" style="width:100%; padding:0; margin-top:0;" onclick="addToDraft();">${lang.lang_secure_draft}</button>`
	if (draft) {
		const draftObj = JSON.parse(draft)
		for (let i = 0; i < draftObj.length; i++) {
			const toot = draftObj[i]
			html =
				html +
				`<div class="tootInDraft">
				<i class="waves-effect gray material-icons" onclick="useThisDraft(${i})" title="${lang.lang_secure_useThis}">reply</i>
				<i class="waves-effect gray material-icons" onclick="deleteThisDraft(${i})" title="${lang.lang_secure_deleteThis}">cancel</i>
				${escapeHTML(toot.status).replace(/\n/, '').substr(0, 10)}
			</div>`
		}
	}
	$('#draft').html(html)
}
export async function addToDraft() {
	const json = await post(undefined, true)
	if (!json) return
	const draft = localStorage.getItem('draft')
	let draftObj: StatusTheDeskExtend[] = []
	if (draft) draftObj = JSON.parse(draft)
	draftObj.push(json)
	const newDraftStr = JSON.stringify(draftObj)
	localStorage.setItem('draft', newDraftStr)
	draftDraw()
}
export function useThisDraft(i) {
	const draft = localStorage.getItem('draft') || `{}`
	const draftObj = JSON.parse(draft)
	draftToPost(draftObj[i], draftObj[i].TheDeskAcctId, '0')
	draftToggle()
}
export function deleteThisDraft(i) {
	const draft = localStorage.getItem('draft') || `{}`
	const draftObj = JSON.parse(draft)
	draftObj.splice(i, 1)
	const newDraftStr = JSON.stringify(draftObj)
	localStorage.setItem('draft', newDraftStr)
	draftDraw()
}
