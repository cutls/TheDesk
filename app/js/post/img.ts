import { formSelectInit, toast } from '../common/declareM'
import api from '../common/fetch'
import $ from 'jquery'
import lang from '../common/lang'
import { tips, todc, todo } from '../ui/tips'
import { setLog } from '../platform/first'
import Swal from 'sweetalert2'
import { post } from './post'
import { Media } from '../../interfaces/MastodonApiReturns'
import { parseRemainXmlHttpRequest } from '../common/apiRemain'

//ドラッグ・アンド・ドロップからアップロードまで。uiのimg.jsとは異なります。
const obj = $('body')
let isLocked
//ドラッグスタート
obj.on('dragstart', function () {
	isLocked = true
})
//何もなくファイルが通過
obj.on('dragend', function () {
	isLocked = false
})
//ドラッグファイルが画面上に
obj.on('dragenter', function () {
	if (!isLocked) $('#drag').css('display', 'flex')
})
$('body').on('dragover', function (e) {
	e.stopPropagation()
	e.preventDefault()
})
//ドロップした
$('body').on('drop', function (e) {
	if (!isLocked) {
		$('#drag').css('display', 'none')
		e.preventDefault()
		const files = e.originalEvent?.dataTransfer?.files
		if (files) pimg(files)
	}
})
//何もなくファイルが通過
$('#drag').on('dragleave', function () {
	$('#drag').css('display', 'none')
})

//複数アップ 
function pimg(files: FileList) {
	for (let i = 0; i < files.length; i++) {
		const m = files[i].path.match(/\.(.+)$/)
		if (!m) return handleFileUpload(files[i], i)
		const dot = m[1]
		if (dot === 'bmp' || dot === 'BMP') {
			postMessage(['bmpImage', [files[i].path, i]], '*')
			todo(lang.lang_progress)
		} else {
			handleFileUpload(files[i], i)
		}
	}
}
//ドラッグ・アンド・ドロップを終了
export function closeDrop() {
	$('#drag').css('display', 'none')
}
//ファイル選択
export function fileSelect() {
	postMessage(['sendSinmpleIpc', 'file-select'], '*')
}

//ファイル読み込み
function handleFileUpload(files: Blob, no: number) {
	const fr = new FileReader()
	fr.onload = function (evt) {
		const b64 = evt.target?.result?.toString()
		const resize = parseInt(localStorage.getItem('uploadCrop') || '0', 10)
		if (!b64) return
		if (resize > 0) {
			const element = new Image()
			element.onload = function () {
				const width = element.naturalWidth
				const height = element.naturalHeight
				if (width > resize || height > resize) {
					postMessage(['resizeImage', [b64, resize]], '*')
					return false
				} else {
					$('#b64-box').val(b64)
					media(b64, files.type, no)
				}
			}
			element.src = b64
			return false
		}
		$('#b64-box').val(b64)
		media(b64, files.type, no)
	}
	fr.readAsDataURL(files)
	$('#mec').append(files.name + '/')
}

//ファイルアップロード
export async function media(b64: string, type: string, no: number | 'new', stamped?: boolean) {
	const acctId = $('#post-acct-sel').val()
	const domain = localStorage.getItem(`domain_${acctId}`) || ''
	const at = localStorage.getItem(`acct_${acctId}_at`) || ''
	const user = localStorage.getItem(`user_${acctId}`)
	if ($('#stamp').hasClass('stamp-avail') && !stamped) {
		postMessage(['stampImage', [b64, user + '@' + domain]], '*')
		return false
	}
	const l = 4
	const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const cl = c.length
	let r = ''
	for (let i = 0; i < l; i++) {
		r += c[Math.floor(Math.random() * cl)]
	}
	if ($('#media').val()) {
		$('#media').val($('#media').val() + ',' + 'tmp_' + r)
	} else {
		$('#media').val('tmp_' + r)
	}
	$('.toot-btn-group').prop('disabled', true)
	$('#post-acct-sel').prop('disabled', true)
	todo('Image Upload...')
	const media = toBlob(b64, type)
	if (!media) return toast({ html: 'Cannot convert to Blob: ' + lang.lang_postimg_failupload })
	const fd = new FormData()
	fd.append('file', media)
	const httpreq = new XMLHttpRequest()
	const previewer = 'preview_url'
	//v2/media
	try {
		const id = await v2MediaUpload(domain, at, fd)
		if (!id) {
			const start = `https://${domain}/api/v1/media`
			httpreq.open('POST', start, true)
			httpreq.upload.addEventListener('progress', progShow, false)
			httpreq.responseType = 'json'
			httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
			httpreq.send(fd)
		} else {
			let mediav = $('#media').val()?.toString() || ''
			const regExp = new RegExp('tmp_' + r, 'g')
			mediav = mediav.replace(regExp, id)
			$('#media').val(mediav)
			const html = `<img src="../../img/picture.svg" class="preview-img pointer unknown" data-acct="${acctId}" data-media="${id}" oncontextmenu="deleteImage('${id}')" onclick="altImage('${acctId}','${id}')" title="${lang.lang_postimg_delete}">`
			$('#preview').append(html)
			todc()
			if (localStorage.getItem('nsfw_' + acctId)) {
				$('#nsfw').addClass('yellow-text')
				$('#nsfw').html('visibility')
				$('#nsfw').addClass('nsfw-avail')
			}
			$('.toot-btn-group').prop('disabled', false)
			formSelectInit($('select'))
			$('#mec').text(lang.lang_there)
			$('#imgup').text('')
			$('#imgsel').show()
			localStorage.removeItem('image')
		}
	} catch {
		const start = `https://${domain}/api/v1/media`
		httpreq.open('POST', start, true)
		httpreq.upload.addEventListener('progress', progShow, false)
		httpreq.responseType = 'json'
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
		httpreq.send(fd)
	}
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === httpreq.DONE) {
			const json = httpreq.response
			if (this.status !== 200) {
				setLog(`https://${domain}/api/v1/media`, this.status, json)
				$('.toot-btn-group').prop('disabled', false)
				$('#mec').text(lang.lang_there)
				toast({ html: this.status + ':' + json, displayLength: 2000 })
				$('#imgup').text('')
				$('#imgsel').show()
			}
			if (!json.id) {
				todc()
				$('#imgup').text('')
				$('.toot-btn-group').prop('disabled', false)
				$('#post-acct-sel').prop('disabled', false)
				$('#imgsel').show()
				toast({ html: lang.lang_postimg_failupload, displayLength: 5000 })
				formSelectInit($('select'))
				return false
			}
			$('#imgup').text('')
			$('.toot-btn-group').prop('disabled', false)
			formSelectInit($('select'))
			$('#imgsel').show()
			const img = localStorage.getItem('img') || 'no-act'
			if (json.type.indexOf('image') !== -1) {
				const html = `<img src="${json[previewer]}" class="preview-img pointer" data-media="${json.id}" oncontextmenu="deleteImage('${json.id}')" onclick="altImage('${acctId}','${json.id}')" title="${lang.lang_postimg_delete}">`
				$('#preview').append(html)
			} else {
				$('#preview').append(lang.lang_postimg_previewdis)
			}
			if (img !== 'inline') {
				let mediav = $('#media').val()?.toString() || ''
				const regExp = new RegExp('tmp_' + r, 'g')
				mediav = mediav.replace(regExp, json.id)
				$('#media').val(mediav)
			}
			if (img === 'url' && json.text_url) $('#textarea').val($('#textarea').val() + ' ' + json.text_url)
			parseRemainXmlHttpRequest(this.responseURL,this,'post')
			tips('refresh')
		}
	}
}
function progShow(e: ProgressEvent<XMLHttpRequestEventTarget>) {
	console.log(e.loaded)
}

//Base64からBlobへ
export function toBlob(base64: string, type: string) {
	const bin = atob(base64.replace(/^.*,/, ''))
	const buffer = new Uint8Array(bin.length)
	for (let i = 0; i < bin.length; i++) buffer[i] = bin.charCodeAt(i)
	// Blobを作成
	try {
		const blob = new Blob([new Uint8Array(buffer)], {
			type: type,
		})
		return blob
	} catch (e) {
		return null
	}
}
//画像を貼り付けたら…
export function imgPasteInit() {
	const element = <HTMLInputElement>document.getElementById('textarea')
	element &&
		element.addEventListener('paste', function (e) {
			if (!e.clipboardData || !e.clipboardData.items) return true
			// DataTransferItemList に画像が含まれいない場合は終了する
			const imageItems = [...e.clipboardData.items].filter((i) => i.type.startsWith('image'))
			if (imageItems.length === 0) {
				return true
			}

			// ファイルとして得る
			// DataTransferItem の kind は file なので getAsString ではなく getAsFile を呼ぶ
			const imageFile = imageItems[0].getAsFile()
			const imageType = imageItems[0].type

			// FileReaderで読み込む
			const fr = new FileReader()
			fr.onload = function (e) {
				// onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
				const base64 = e.target?.result
				const mediav = $('#media').val()?.toString() || ''
				if (typeof base64 !== 'string') return
				const i = mediav.split(',').length
				// DataTransferItem の type に mime tipes があるのでそれを使う
				media(base64, imageType, i)
			}
			if (imageFile) fr.readAsDataURL(imageFile)

			// 画像以外がペーストされたときのために、元に戻しておく
		})
}
// PWA
export function pwaImgSelect() {
	const elem = <HTMLInputElement>document.getElementById('fileSelect')
	const files = elem.files
	if(files) pimg(files)
}
export async function deleteImage(key: string) {
	const result = await Swal.fire({
		title: lang.lang_postimg_delete,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		const media = $('#media').val()?.toString() || ''
		const arr = media.split(',')
		for (let i = 0; i < media.length; i++) {
			if (arr[i] === key) {
				arr.splice(i, 1)
				break
			}
		}
		$('#media').val(arr.join(','))
		$('#preview [data-media=' + key + ']').remove()
	}
}
export async function altImage(acctId: string, id: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/media/${id}`
	const json = await api<Media>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if ($(`[data-media=${id}]`).hasClass('unknown')) {
		$('[data-media=' + id + ']').removeClass('unknown')
		if (json.preview_url) $('[data-media=' + id + ']').attr('src', json.preview_url)
	} else {
		Swal.fire({
			title: lang.lang_postimg_desc,
			text: lang.lang_postimg_leadContext,
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
			},
			inputValue: json.description || '',
			showCancelButton: true,
			confirmButtonText: 'Post',
			showLoaderOnConfirm: true,
			preConfirm: async (data) => {
				Swal.showLoading(null)
				await api(start, {
					method: 'put',
					headers: {
						'content-type': 'application/json',
						Authorization: 'Bearer ' + at,
					},
					body: {
						description: data,
					}
				})
				$(`[data-media=${id}]`).attr('title', data)
			},
			allowOutsideClick: () => !Swal.isLoading(),
		})
	}
}
export function stamp() {
	if ($('#stamp').hasClass('stamp-avail')) {
		$('#stamp').html('Off')
		$('#stamp').removeClass('stamp-avail')
	} else {
		$('#stamp').html('On')
		$('#stamp').addClass('stamp-avail')
	}
}
//v2/media対応
async function v2MediaUpload(domain: string, at: string, fd) {
	try {
		const start = 'https://' + domain + '/api/v2/media'
		const json = await api(
			start,
			{
				method: 'post',
				headers: {
					Authorization: 'Bearer ' + at,
				},
				body: fd,
			},
			true
		)
		if (json.id) {
			return json.id
		} else {
			throw json
		}
	} catch (e: any) {
		console.error(`Fatal Error: ${e}`)
	}
}
export function alertProcessUnfinished() {
	Swal.fire({
		title: lang.lang_post_unfinishedMedia,
		icon: 'error',
		showCancelButton: true,
		confirmButtonText: lang.lang_post_retry,
		cancelButtonText: lang.lang_no,
	}).then((result) => {
		if (result.value) {
			post()
		}
	})
}
