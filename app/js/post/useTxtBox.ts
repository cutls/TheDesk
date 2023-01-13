import lang from "../common/lang"
import $ from 'jquery'
import { clear } from "./post"
import { cw, isIVis, IVis, vis } from "./secure"
import { formSelectInit, modalInitGetInstance } from "../common/declareM"
import { stripTags } from "../platform/first"

/*リプライ*/
export function re(id: string, atsCm: string, acctId: string, mode: IVis, cwTxt: string) {
	clear()
	const ats = atsCm.split(',')
	localStorage.setItem('nohide', 'true')
	show()
	$('#reply').val(id)
	for (let i = 0; i < ats.length; i++) {
		const at = ats[i]
		const te = $('#textarea').val()
		if (at !== localStorage.getItem('user_' + acctId)) $('#textarea').val('@' + at + ' ' + te)
	}
	$('#rec').text(lang.lang_yesno)
	$('#post-acct-sel').val(acctId)
	$('#post-acct-sel').prop('disabled', true)
	formSelectInit($('select'))
	mdCheck()
	$('#textarea').attr('placeholder', lang.lang_usetxtbox_reply)
	$('#textarea').focus()
	let profimg = localStorage.getItem('prof_' + acctId)
	if (!profimg) profimg = '../../img/missing.svg'
	$('#acct-sel-prof').attr('src', profimg)
	vis(mode)
	if (localStorage.getItem('cw-continue') === 'yes') {
		cw(true)
		$('#cw-text').val(cwTxt)
	}
}
export function reEx(id: string) {
	const instance = modalInitGetInstance($('#tootmodal'))
	instance.close()
	const at = $('#tootmodal').attr('data-user') || ''
	const acctId = $('#status-acct-sel').val()?.toString()
	if (!acctId) return
	const mode = $('#tootmodal .vis-data').attr('data-vis') || 'public'
	if (!isIVis(mode)) return
	const cwTxt = $('#cw-text').val()?.toString() || ''
	re(id, at, acctId, mode, cwTxt)
}
//引用
export function qt(id: string, acctId: string, at: string, url: string) {
	localStorage.setItem('nohide', 'true')
	const qt = localStorage.getItem('quote') || 'simple'
	if (qt === 'nothing') return false
	if (qt === 'simple') {
		show()
		$('#textarea').val('\n' + url)
	} else if (qt === 'mention') {
		show()
		$('#textarea').val('\n' + url + ' From:@' + at)
	} else if (qt === 'full') {
		show()
		let html = $('[toot-id=' + id + '] .toot').html()
		const m = html.match(/^<p>(.+)<\/p>$/)
		html = m ? m[1] : html
		html = html.replace(/<br\s?\/?>/, '\n')
		html = html.replace(/<p>/, '\n')
		html = html.replace(/<\/p>/, '\n')
		html = stripTags(html)
		$('#textarea').val('\n' + '@' + at + ' ' + html + '\n' + url)
	} else if (qt === 'apiQuote') {
		clear()
		localStorage.setItem('nohide', 'true')
		show()
		$('#quote').val(id)
		$('#post-acct-sel').val(acctId)
		$('#post-acct-sel').prop('disabled', true)
		formSelectInit($('select'))
		$('#textarea').attr('placeholder', lang.lang_usetxtbox_reply)
		$('#textarea').focus()
		let profimg = localStorage.getItem('prof_' + acctId)
		if (!profimg) profimg = '../../img/missing.svg'
		$('#acct-sel-prof').attr('src', profimg)
	}
	$('#post-acct-sel').val(acctId)
	formSelectInit($('select'))
	mdCheck()
	$('#textarea').focus()
}
