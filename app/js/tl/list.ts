import $ from 'jquery'
import lang from '../common/lang'
import { escapeHTML, setLog } from '../platform/first'
import { todo } from '../ui/tips'
export function listMenu() {
	$('#left-menu a').removeClass('active')
	$('#listMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#list-box').removeClass('hide')
	$('#src-contents').html('')
}

export function list() {
	$('#lists-user').html('')
	const acct_id = $('#list-acct-sel').val()
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	const start = 'https://' + domain + '/api/v1/lists'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			if (json) {
				let lists = ''
				Object.keys(json).forEach(function (key) {
					const list = json[key]
					lists =
						lists +
						escapeHTML(list.title) +
						`:<a onclick="listShow('${list.id}','${escapeHTML(
							list.title
						)}','${acct_id}')" class="pointer">
								${lang.lang_list_show}
							</a>/
							<a onclick="listUser('${list.id}','${acct_id}')" class="pointer">
								${lang.lang_list_users}
							</a><br>`
				})
				$('#lists').html(lists)
			} else {
				$('#lists').html(lang.lang_list_nodata)
			}
		})
}
export function makeNewList() {
	const acct_id = $('#list-acct-sel').val()
	const text = $('#list-add').val()
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) !== 'misskey') {
		const start = 'https://' + domain + '/api/v1/lists'
		const httpreq = new XMLHttpRequest()
		httpreq.open('POST', start, true)
		httpreq.setRequestHeader('Content-Type', 'application/json')
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
		httpreq.responseType = 'json'
		httpreq.send(
			JSON.stringify({
				title: text
			})
		)
		httpreq.onreadystatechange = function () {
			if (httpreq.readyState === 4) {
				const json = httpreq.response
				if (this.status !== 200) {
					setLog(start, this.status, this.response)
				}
				list()
				$('#list-add').val('')
			}
		}
	} else {
		const start = 'https://' + domain + '/api/users/lists/create'
		const httpreq = new XMLHttpRequest()
		httpreq.open('POST', start, true)
		httpreq.setRequestHeader('Content-Type', 'application/json')
		httpreq.responseType = 'json'
		httpreq.send(
			JSON.stringify({
				i: at,
				title: text
			})
		)
		httpreq.onreadystatechange = function () {
			if (httpreq.readyState === 4) {
				const json = httpreq.response
				if (this.status !== 200) {
					setLog(start, this.status, this.response)
				}
				list()
				$('#list-add').val('')
			}
		}
	}
}
export function listShow(id, title, acct_id) {
	localStorage.setItem('list_' + id + '_' + acct_id, title)
	tl('list', id, acct_id, 'add')
}
export function listUser(id, acct_id) {
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	const start = 'https://' + domain + '/api/v1/lists/' + id + '/accounts'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			if (json) {
				const lists = ''
				const templete = userParse(json, '', acct_id)
				if (!json[0]) {
					templete = lang.lang_list_nouser
				}
				$('#lists-user').html(templete)
				jQuery('time.timeago').timeago()
			} else {
				$('#lists-user').html(lang.lang_list_nouser)
			}
		})
}
export function hisList(user, acct_id) {
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) !== 'misskey') {
		const start = 'https://' + domain + '/api/v1/lists'
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
		})
			.then(function (response) {
				if (!response.ok) {
					response.text().then(function (text) {
						setLog(response.url, response.status, text)
					})
				}
				return response.json()
			})
			.catch(function (error) {
				todo(error)
				setLog(start, 'JSON', error)
				console.error(error)
			})
			.then(function (json) {
				if (json) {
					const lists = lang.lang_list_add + '<br>'
					Object.keys(json).forEach(function (key) {
						const list = json[key]
						lists =
							lists +
							`<a onclick="listAdd('${list.id}','${user}','${acct_id}')" class="pointer">
								${escapeHTML(list.title)}
							</a><br> `
					})
					$('#his-lists-a').html(lists)
				} else {
					$('#his-lists-a').html(lang.lang_list_nodata)
				}
			})
		const start = 'https://' + domain + '/api/v1/accounts/' + user + '/lists'
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
		})
			.then(function (response) {
				if (!response.ok) {
					response.text().then(function (text) {
						setLog(response.url, response.status, text)
					})
				}
				return response.json()
			})
			.catch(function (error) {
				todo(error)
				setLog(start, 'JSON', error)
				console.error(error)
			})
			.then(function (json) {
				if (json) {
					const lists = lang.lang_list_remove + '<br>'
					Object.keys(json).forEach(function (key) {
						const list = json[key]
						lists =
							lists +
							`<a onclick="listRemove('${list.id}','${user}','${acct_id}')" class="pointer">
								${escapeHTML(list.title)}
							</a><br> `
					})
					$('#his-lists-b').html(lists)
				} else {
					$('#his-lists-b').html(lang.lang_list_nodata)
				}
			})
	} else {
		const start = 'https://' + domain + '/api/users/lists/list'
		fetch(start, {
			method: 'POST',
			body: JSON.stringify({
				i: at
			})
		})
			.then(function (response) {
				if (!response.ok) {
					response.text().then(function (text) {
						setLog(response.url, response.status, text)
					})
				}
				return response.json()
			})
			.catch(function (error) {
				todo(error)
				setLog(start, 'JSON', error)
				console.error(error)
			})
			.then(function (json) {
				if (json) {
					const lists = ''
					Object.keys(json).forEach(function (key) {
						const list = json[key]
						lists =
							lists +
							list.title +
							`:<a onclick="listShow('${list.id}','${escapeHTML(
								list.title
							)}','${acct_id}')" class="pointer">
								${lang.lang_list_show}
							</a>/
							<a onclick="listAdd('${list.id}','${user}','${acct_id}')" class="pointer">
								${lang.lang_list_add}
								${lang.lang_list_add_misskey}
							'</a><br>`
					})
					$('#his-lists-a').html(lists)
				} else {
					$('#his-lists-a').html(lang.lang_list_nodata)
				}
			})
		$('#his-lists-b').html('')
	}
}
export function listAdd(id, user, acct_id) {
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) === 'misskey') {
		const start = 'https://' + domain + '/api/users/lists/push'
		const i = {
			i: at,
			listId: id,
			userId: user
		}
	} else {
		const start = 'https://' + domain + '/api/v1/lists/' + id + '/accounts'
		const i = {
			account_ids: [user]
		}
	}
	const httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send(JSON.stringify(i))
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			const json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, this.response)
			}
			hisList(user, acct_id)
		}
	}
}
export function listRemove(id, user, acct_id) {
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) === 'misskey') {
		const start = 'https://' + domain + '/api/users/lists/push'
		const method = 'POST'
		const i = {
			i: at,
			listId: id,
			userId: user
		}
	} else {
		const start = 'https://' + domain + '/api/v1/lists/' + id + '/accounts'
		const method = 'DELETE'
		const i = {
			account_ids: [user]
		}
	}
	const httpreq = new XMLHttpRequest()
	httpreq.open(method, start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send(JSON.stringify(i))
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			const json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, this.response)
			}
			hisList(user, acct_id)
		}
	}
}
