import $ from 'jquery'
import { toast } from '../common/declareM'
import lang from '../common/lang'
import { playSound } from '../platform/end'
import { escapeHTML, stripTags } from '../platform/first'
import { date, isDateType } from './date'
const dateType = localStorage.getItem('datetype') || 'absolute'
import { customEmojiReplace, INotf } from './parse'

const native = (localStorage.getItem('nativenotf') || 'yes') === 'yes'
const gif = (localStorage.getItem('gif') || 'yes') === 'yes'

export function notfParse(obj: INotf | undefined, acctId: string, tlid: string | 'notf', popup: number, targetContent?: string) {
	if (!obj || !isDateType(dateType))
		return {
			noticeAvatar: '',
			ifNotf: '',
			noticeText: '',
		}
	const domain = localStorage.getItem(`domain_${acctId}`)
	const account = obj.eventBy
	const type = obj.event
	const { createdAt, id } = obj
	let noticeavatar = gif ? account.avatar : account.avatar_static
	noticeavatar = `<a onclick="udg('${account.id}','${acctId}');" user="${account.acct}" class="udg">
                <img draggable="false" src="${noticeavatar}" width="20" class="notf-icon prof-img" user="${account.acct}" alt="" loading="lazy">
            </a>`
	let what = 'New event'
	let icon = 'fa-help grey-text'
	if (type === 'mention') {
		what = lang.lang_parse_mentioned
		icon = 'fa-share teal-text'
		noticeavatar = ''
	} else if (type === 'reblog') {
		what = lang.lang_parse_bted
		icon = 'fa-retweet light-blue-text'
	} else if (type === 'favourite') {
		what = lang.lang_parse_faved
		icon = 'fa-star  yellow-text'
	} else if (type === 'poll') {
		what = lang.lang_parse_polled
		icon = 'fa-tasks  purple-text'
	}

	let disName = escapeHTML(account.display_name || account.acct)
	//絵文字があれば
	if (account.emojis.length) disName = customEmojiReplace(disName, account, gif)
	const notfFilHide = tlid === 'notf' ? 'hide' : ''
	const noticetext = `<span onclick="notfFilter('${account.id}','${tlid}');" class=" pointer big-text ${notfFilHide}">
                <i class="fas fa-filter" title="${lang.lang_parse_notffilter}"></i>
                <span class="voice">${lang.lang_parse_notffilter}</span>
            </span>
            <span class="cbadge cbadge-hover" title="${date(createdAt, 'absolute')}(${lang.lang_parse_notftime})" aria-hidden="true">
                <i class="far fa-clock"></i>
                ${date(createdAt, dateType)}
            </span>
            <span class="voice">${date(createdAt, 'absolute')}(${lang.lang_parse_notftime})</span>
            <i class="big-text fas ${icon}"></i>
            <a onclick="udg('${account.id}','${acctId}')" class="pointer grey-text notf-udg-text">
                ${disName}(@${account.acct})
            </a>`
	const memory = localStorage.getItem('notice-mem')
	if (popup >= 0 && noticetext !== memory) {
		let file = ''
		let sound = ''
		if (obj.fromStreaming) {
			if (type === 'mention') {
				const favCt = parseInt($(`.notf-reply_${acctId}`).first().text() || '0', 10)
				$(`.notf-reply_${acctId}`).text(favCt + 1)
				$(`.boxIn[data-acct=${acctId}] .notice-box`).addClass('has-notf')
				sound = localStorage.getItem('replySound') || 'default'
				if (sound === 'default') file = '../../source/notif3.wav'
			} else if (type === 'reblog') {
				const btCt = parseInt($(`.notf-bt_${acctId}`).first().text() || '0', 10)
				$(`.notf-bt_${acctId}`).text(btCt + 1)
				$(`.boxIn[data-acct=${acctId}] .notice-box`).addClass('has-notf')
				sound = localStorage.getItem('btSound') || 'default'
				if (sound === 'default') file = '../../source/notif2.wav'
			} else if (type === 'favourite') {
				const favCt = parseInt($(`.notf-fav_${acctId}`).first().text() || '0', 10)
				console.log($(`.notf-fav_${acctId}`).text())
				$(`.notf-fav_${acctId}`).text(favCt + 1)
				$(`.boxIn[data-acct=${acctId}] .notice-box`).addClass('has-notf')
				sound = localStorage.getItem('favSound') || 'default'
				if (sound === 'default') file = '../../source/notif.wav'
			}
		}
		if (popup > 0) {
			toast({
				html: '[' + domain + ']' + escapeHTML(account.display_name || '?') + what,
				displayLength: popup * 1000,
			})
		}
		//通知音
		if (sound === 'c1') {
			file = localStorage.getItem('custom1') || '../../source/notif.wav'
		} else if (sound === 'c2') {
			file = localStorage.getItem('custom2') || '../../source/notif.wav'
		} else if (sound === 'c3') {
			file = localStorage.getItem('custom3') || '../../source/notif.wav'
		} else if (sound === 'c4') {
			file = localStorage.getItem('custom4') || '../../source/notif.wav'
		}
		if (file) {
			const request = new XMLHttpRequest()
			request.open('GET', file, true)
			request.responseType = 'arraybuffer'
			request.onload = () => playSound(request)
			request.send()
		}
		if (native && obj.fromStreaming) {
			const options = {
				body: `${account.display_name}(${account.acct})${what}\n\n${stripTags(targetContent || '')}`,
				icon: account.avatar,
			}
			new Notification('TheDesk:' + domain, options)
		}
		localStorage.setItem('notice-mem', noticetext)
	}
	const ifNotf = `data-notfIndv="${acctId}_${id}" data-notf="${id}"`
	return {
		noticeAvatar: noticeavatar,
		ifNotf,
		noticeText: noticetext,
	}
}
