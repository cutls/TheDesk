import { Account } from "../../interfaces/MastodonApiReturns"
import $ from 'jquery'
import lang from "../common/lang"
import { toast } from "../common/declareM"
import { escapeHTML, twemojiParse } from "../platform/first"
import { date } from "./date"

const gif = (localStorage.getItem('gif') || 'yes') === 'yes'
//オブジェクトパーサー(ユーザーデータ)
type NotoficationEvent = 'follow_request' | 'follow' | 'moved' | 'admin.sign_up' | 'admin.report' | null
export function userParse(obj: Account[], acctId: string, notfEvent?: NotoficationEvent, tlid?: string, popup?: number) {
	popup = popup || 0
	let templete = ''
	for (let toot of obj) {
		if (toot) {
			const notf = !toot.username
			if (!toot.username) break
			//Instance Actorって…
			if (toot.username.indexOf('.') < 0) {
				const locked = toot.locked ? ' <i class="fas fa-lock red-text"></i>' : ''
				const authhtml = notfEvent === 'follow_request' ? `<i class="material-icons gray pointer" onclick="request('${toot.id}','authorize','${acctId}')" title="Accept" aria-hidden="true">
							person_add
						</i>
						<i class="material-icons gray pointer" onclick="request('${toot.id}','reject','${acctId}')" title="Reject" aria-hidden="true">
							person_add_disabled
						</i>` : ''
				let ftxt = `New event`
				if (notfEvent === 'follow') {
					ftxt = lang.lang_parse_followed
				} else if (notfEvent === 'moved') {
					ftxt = lang.lang_parse_moved
				} else if (notfEvent === 'follow_request') {
					ftxt = lang.lang_parse_request
				} else if (notfEvent === 'admin.sign_up') {
					ftxt = lang.lang_parse_signup
				}
				let notftext = ''
				if (popup  > 0 || popup === -1 || notf) {
					notftext = ftxt + '<br>'
				}
				popupNotification(toot, popup, notftext, tlid || '', ftxt, acctId)
				let disName = toot.display_name ? escapeHTML(toot.display_name) : toot.username
				if (toot.emojis) {
					disName = customEmojiReplace(disName, toot, gif)
				}
				if (disName) disName = twemojiParse(disName)
				let avatar = '../../img/missing.svg'
				if (toot.avatar) avatar = gif ? toot.avatar : toot.avatar_static
				let udg = `<a onclick="udg('${toot.id}','${acctId}');" user="${toot.acct}" class="udg">`
				if (tlid === 'dir' && acctId === 'noauth') {
					udg = `<a onclick="udgEx('${toot.url}','main');" user="${toot.acct}" class="udg">`
				}
				const latest = date(toot.last_status_at || new Date().toDateString(), 'relative')
				const latestHtml = toot.last_status_at ?  `<div class="cbadge" style="width:100px;">Last <span class="voice">toot</span>: ${latest}</div>` : ''
				templete =
					templete +
					`<div class="cusr" style="padding-top:5px;" user-id="${toot.id}">
					<div class="area-notice">${notftext}</div>
					<div class="area-icon">
						${udg}
						<img
							draggable="false"
							src="${avatar}"
							width="40"
							class="prof-img"
							user="${toot.acct}"
							onerror="this.src='../../img/loading.svg'"
							alt=""
							loading="lazy"
						/>
					</a></div>
					<div class="area-display_name">
						<div class="flex-name">
							<span class="user">${disName} </span>
							<span
								class="sml gray"
								style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"
							>
								@${toot.acct}${locked}</span>
						</div>
					</div>
					<div class="area-status">
						<div class="cbadge" style="width:100px;">
							${lang.lang_status_follow}:${toot.following_count}
						</div>
						<div class="cbadge" style="width:100px;">
							${lang.lang_status_followers}:${toot.followers_count}
						</div>
						${latestHtml}
					</div>
					<div class="area-actions" style="justify-content: flex-end;">
						${authhtml}
					</div>
				</div>
				`
			}
		}
	}
	return templete
}
export function popupNotification(toot: Account, popup: number, notftext: string, tlid: string, ftxt: string, acctId: string) {
	return new Promise(() => {
		const memory = localStorage.getItem('notice-mem')
		if (popup >= 0 && obj.length < 5 && notftext !== memory) {
			toast({ html: escapeHTML(toot.display_name || toot.acct) + ':' + ftxt, displayLength: popup * 1000 })
			$('.notf-icon_' + tlid).addClass('red-text')
			localStorage.setItem('notice-mem', notftext)
			notftext = ''
			const native = localStorage.getItem('nativenotf') || 'yes'
			if (native === 'yes') {
				const options = {
					body: `${toot.display_name}(${toot.acct})${ftxt}`,
					icon: toot.avatar
				}
				const domain = localStorage.getItem('domain_' + acctId)
				new Notification('TheDesk:' + domain, options)
			}
		}
	})
}