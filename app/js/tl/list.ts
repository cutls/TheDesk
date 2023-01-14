import $ from 'jquery'
import { List } from '../../interfaces/MastodonApiReturns'
import api from '../common/fetch'
import lang from '../common/lang'
import timeUpdate from '../common/time'
import { escapeHTML, setLog } from '../platform/first'
import { todo } from '../ui/tips'
import { tl } from './tl'
import { userParse } from './userParse'
export function listMenu() {
	$('#left-menu a').removeClass('active')
	$('#listMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#list-box').removeClass('hide')
	$('#src-contents').html('')
}

export async function list() {
	$('#lists-user').html('')
	const acctId = $('#list-acct-sel').val()
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/lists`
	const json = await api<List[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		}
	})
	if (json) {
		let lists = ''
		for (const list of json) {
			lists =
				lists +
				escapeHTML(list.title) +
				`:<a onclick="listShow('${list.id}','${escapeHTML(list.title)}','${acctId}')" class="pointer">
						${lang.lang_list_show}
				</a>/<a onclick="listUser('${list.id}','${acctId}')" class="pointer">
					${lang.lang_list_users}
				</a><br>`
		}
		$('#lists').html(lists)
	} else {
		$('#lists').html(lang.lang_list_nodata)
	}
}
export async function makeNewList() {
	const acctId = $('#list-acct-sel').val()
	const text = $('#list-add').val()
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/lists`
	const json = await api(start, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at

		},
		body: { title: text }
	})
	list()
	$('#list-add').val('')

}
export function listShow(id: string, title: string, acctId: string) {
	localStorage.setItem(`list_${id}_${acctId}`, title)
	tl('list', id, acctId, 'add')
}
export async function listUser(id: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/lists/${id}/accounts`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at

		}
	})
	if (json) {
		let templete = userParse(json, acctId)
		if (!json[0]) templete = lang.lang_list_nouser
		$('#lists-user').html(templete)
		timeUpdate()
	} else {
		$('#lists-user').html(lang.lang_list_nouser)
	}
}
export async function hisList(user: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start1 = `https://${domain}/api/v1/lists`
	const json1 = await api<List[]>(start1, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at

		}
	})
	if (json1) {
		let lists = lang.lang_list_add + '<br>'
		for (const list of json1) {
			lists =
				lists +
				`<a onclick="listAdd('${list.id}','${user}','${acctId}')" class="pointer">
					${escapeHTML(list.title)}
				</a><br> `
		}
		$('#his-lists-a').html(lists)
	} else {
		$('#his-lists-a').html(lang.lang_list_nodata)
	}
	const start = `https://${domain}/api/v1/accounts/${user}/lists`
	const json = await api<List[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at

		},
	})
	if (json) {
		let lists = lang.lang_list_remove + '<br>'
		for (const list of json) {
			lists =
				lists +
				`<a onclick="listRemove('${list.id}','${user}','${acctId}')" class="pointer">
							${escapeHTML(list.title)}
						</a><br> `
		}
		$('#his-lists-b').html(lists)
	} else {
		$('#his-lists-b').html(lang.lang_list_nodata)
	}
}
export async function listAdd(id: string, user: string, acctId: string) {

	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = 'https://' + domain + '/api/v1/lists/' + id + '/accounts'
	const i = {
		account_ids: [user]
	}
	const json = await api(start, {
		method: 'post',
		headers: {
			'content-type': 'application/json',
            'Authorization': 'Bearer ' + at
			
		},
		body: i
	})

	hisList(user, acctId)
}
export async function listRemove(id: string, user: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const start = `https://${domain}/api/v1/lists/${id}/accounts`
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const json = await api(start, {
		method: 'delete',
		headers: {
			'content-type': 'application/json',
            'Authorization': 'Bearer ' + at
			
		},
		body: {
			account_ids: [user]
		}
	})

	hisList(user, acctId)
}
