//入力時にハッシュタグと@をサジェスト
import $ from 'jquery'
import { Search } from '../../interfaces/MastodonApiReturns'
import api from '../common/fetch'
import { escapeHTML } from '../platform/first'
import gcc from 'textarea-caret'
import { favTag } from '../tl/tag'

// @ts-ignore
let timer: any = 0
export function suggestInit() {
	const input = <HTMLInputElement>document.getElementById('textarea')

	let prevVal = input.value
	let oldSuggest
	let suggest

	input &&
		input.addEventListener(
			'focus',
			function () {
				localStorage.removeItem('cursor')
				const acct_id = $('#post-acct-sel').val()
				$('#suggest').html('')
				$('#suggest').hide()
				window.clearInterval(timer)
				// @ts-ignore
				timer = window.setInterval(async function () {
					const newVal = input.value
					if (newVal === '') {
						$('#suggest').html('')
						$('#suggest').hide()
						return
					}
					let q
					if (prevVal !== newVal) {
						const pos = input.selectionStart || 0
						let startI = pos - 1
						let hasDomain = false
						let hasDomainOnce = false
						for (startI = pos - 1; startI >= 0; startI--) {
							if (newVal[startI].match(/\s/)) {
								$('#suggest').html('')
								$('#suggest').hide()
								return
							}
							if (newVal[startI].match(/\./)) hasDomain = true
							if (newVal[startI].match(/#|@|:/) && !hasDomain) break
							if (newVal[startI].match(/@/) && hasDomainOnce) break
							if (newVal[startI].match(/@/) && !hasDomainOnce) hasDomainOnce = true
						}
						const target = newVal.substr(startI, pos - startI)
						const tag = target.match(/#(\S{3,})/g)
						const acct = target.match(/@(\S{3,})(@(\S{3,}))?/g)
						const emoji = target.match(/:(\S{1,})/g)
						if (emoji && emoji[0]) {
							const l = emoji[0]
							const emojis = localStorage.getItem('emojis_raw_' + acct_id)
							const json = emojis ? JSON.parse(emojis) : []
							const reg = new RegExp(`${emoji[0]}`)
							let listHtml = ''
							for (const emoji of json) {
								const { shortcode, url } = emoji
								if (`:${shortcode}`.match(reg)) {
									listHtml = listHtml + `${listHtml ? `<br>` : ``}<a onclick="emojiInsert(':${shortcode}:','${l}')" class="pointer suggestedKey" tabindex=0><img src="${url}" width="15">:${shortcode}:</a>`
								}
							}
							$('#suggest').html(listHtml)
							document.querySelectorAll('.suggestedKey').forEach(function (button: any) {
								button.addEventListener('keydown', function (evt) {
									if (evt.key == 'Enter') button.click()
								})
							})
							$('#suggest').show()
						} else if (tag && tag[0]) {
							q = tag[0]
						} else if (acct && acct[0]) {
							q = acct[0]
						} else {
							$('#suggest').html('')
							$('#suggest').hide()
							return
						}
						if (q) {
							const domain = localStorage.getItem('domain_' + acct_id)
							const at = localStorage.getItem('acct_' + acct_id + '_at')
							suggest = `https://${domain}/api/v2/search?q=${encodeURIComponent(q)}`
							if (suggest !== oldSuggest) {
								const json = await api<Search>(suggest, {
									method: 'get',
									headers: {
										'Content-Type': 'application/json',
										Authorization: 'Bearer ' + at,
									},
								})
								//ハッシュタグ
								if (json.hashtags[0] && tag) {
									if (tag[0]) {
										let tags: any[] = []
										Object.keys(json.hashtags).forEach(function (key4) {
											const tag = json.hashtags[key4]
											const his = tag.history
											const uses = his[0].uses * 1 + his[1].uses * 1 + his[2].uses * 1 + his[3].uses * 1 + his[4].uses * 1 + his[5].uses * 1 + his[6].uses * 1
											const tagHTML = `<br><a onclick="tagInsert('#${escapeHTML(tag.name)}','${q}')" class="pointer suggestedKey" tabindex="0">#${escapeHTML(tag.name)}</a>&nbsp;${uses}toot(s)`
											const item = {
												uses: uses,
												html: tagHTML,
											}
											tags.push(item)
										})
										const num_a = -1
										const num_b = 1
										tags = tags.sort(function (a, b) {
											const x = a.uses
											const y = b.uses
											if (x > y) return num_a
											if (x < y) return num_b
											return 0
										})
										let ins = ''
										let nev = false
										let key7 = 0
										for (const t of tags) {
											ins = ins + t.html
											if (key7 <= 0 && !nev) {
												//ins = ins + '<br>'
												nev = true
											}
											key7++
										}
										$('#suggest').html(ins)
										$('#suggest').show()
										document.querySelectorAll('.suggestedKey').forEach(function (button: any) {
											button.addEventListener('keydown', function (evt) {
												if (evt.key == 'Enter') button.click()
											})
										})
									}
								} else if (json.accounts[0] && acct && acct[0]) {
									let accts = ''
									for (const acct of json.accounts) {
										if (acct.acct !== q) {
											//Instance Actorって…
											if (acct.username.indexOf('.') < 0) {
												accts = accts + `<a onclick="tagInsert('@${acct.acct}','${q}')" class="pointer suggestedKey" tabindex=0>@${acct.acct}</a><br>`
											}
										}
									}
									$('#suggest').html(accts)
									$('#suggest').show()
									document.querySelectorAll('.suggestedKey').forEach(function (button: any) {
										button.addEventListener('keydown', function (evt) {
											if (evt.key == 'Enter') button.click()
										})
									})
								}
							}
						}
					}
					oldSuggest = suggest
					prevVal = newVal

					const rectTextarea = <HTMLInputElement>document.querySelector('#textarea')
					const rect = rectTextarea.getBoundingClientRect()
					const caret = gcc(rectTextarea, rectTextarea.selectionEnd || 0)
					$('#suggest').css('top', `calc(${caret.top}px + 1rem)`)
					const left = rect.width / 2 < caret.left ? rect.width / 2 : caret.left
					$('#suggest').css('left', left)
				}, 1000)
			},
			false
		)

	input &&
		input.addEventListener(
			'blur',
			function () {
				window.clearInterval(timer)
				favTag()
			},
			false
		)
}
export function tagInsert(code: string, del: string) {
	let blankBefore = ' '
	let blankAfter = ' '
	const textarea = <HTMLInputElement>document.querySelector('#textarea')
	let sentence = textarea.value
	const len = sentence.length
	const pos = textarea.selectionStart || 0
	const delLen = del.length || 0
	const before = sentence.substr(0, pos - delLen)
	const last = before.substr(-1, 1)
	if (last === ' ') blankBefore = ''
	const after = sentence.substr(pos, len)
	const start = after.substr(0, 1)
	if (start === ' ') blankAfter = ''
	let word = blankBefore + code + blankAfter
	if (len === delLen) {
		word = code + blankAfter
	} else if (len === pos) {
		word = blankBefore + code + blankAfter
	} else if (pos === 0) {
		word = code + blankAfter
	}
	sentence = before + word + after
	textarea.value = sentence
	$('#suggest').html('')
	$('#suggest').hide()
	$('#textarea').focus()
}
