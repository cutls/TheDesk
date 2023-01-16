//ディレクトリ

import { Account } from '../../interfaces/MastodonApiReturns'
import api from '../common/fetch'
import timeUpdate from '../common/time'
import { userParse } from './userParse'
import $ from 'jquery'

//ディレクトリトグル
export function dirMenu() {
	$('#dir-contents').html('')
	directory('directory')
	$('#left-menu a').removeClass('active')
	$('#dirMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#dir-box').removeClass('hide')
}

export function dirselCk() {
	const acct = $('#dir-acct-sel').val()
	if (acct === 'noauth') {
		$('#dirNoAuth').removeClass('hide')
	} else {
		$('#dirNoAuth').addClass('hide')
		directory('check')
	}
}
type IDirMode = 'directory' | 'suggest' | 'check'
export function dirChange(mode: IDirMode) {
	if (mode === 'directory') $('#directoryConfig').removeClass('hide')
	if (mode === 'suggest') $('#directoryConfig').addClass('hide')
	directory(mode)
}

export async function directory(modeRaw: IDirMode, isMore?: boolean) {
	const mode = modeRaw === 'check' ? $('[name=dirsug]:checked').val()?.toString() : modeRaw
	const order = $('[name=sort]:checked').val()?.toString() || 'active'
	const local_only = $('#local_only:checked').val() ? 'true' : 'false'
	const acctId = $('#dir-acct-sel').val()?.toString() || ''
	let at = ''
	let domain = $('#dirNoAuth-url').val()?.toString() || ''
	if (acctId !== 'noauth') {
		domain = localStorage.getItem(`domain_${acctId}`) || ''
		at = localStorage.getItem(`acct_${acctId}_at`) || ''
	}

	const addOffset = isMore ? $('#dir-contents .cvo').length : 0
	$('#dir-contents').append(`<div class="progress transparent"><div class="indeterminate"></div></div>`)
	let start = `https://${domain}/api/v1/directory?order=${order}&local=${local_only}&offset=${addOffset}`
	if (mode === 'suggest') start = `https://${domain}/api/v2/suggestions`
	console.log(start)
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (json) {
		$('#moreDir').removeClass('disabled')
		let obj: Account[] = []
		if (mode === 'suggest') {
			$('#moreDir').addClass('disabled')
			for (const suggest of json) obj.push(suggest.account)
		} else {
			obj = json
		}
		const html = userParse(obj, acctId)
		$('#dir-contents').append(html)
		timeUpdate()
	} else {
		$('#moreDir').addClass('disabled')
	}
}
