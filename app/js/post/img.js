//ドラッグ・アンド・ドロップからアップロードまで。uiのimg.jsとは異なります。
var obj = $('body')
var system
//ドラッグスタート
obj.on('dragstart', function(e) {
	system = 'locked'
})
//何もなくファイルが通過
obj.on('dragend', function(e) {
	system = ''
})
//ドラッグファイルが画面上に
obj.on('dragenter', function(e) {
	if (system != 'locked') {
		$('#drag').css('display', 'flex')
	}
})
$('body').on('dragover', function(e) {
	e.stopPropagation()
	e.preventDefault()
})
//ドロップした
$('body').on('drop', function(e) {
	if (system != 'locked') {
		$('#drag').css('display', 'none')
		e.preventDefault()
		var files = e.originalEvent.dataTransfer.files
		pimg(files)
	}
})
//何もなくファイルが通過
$('#drag').on('dragleave', function(e) {
	$('#drag').css('display', 'none')
})

//複数アップ
function pimg(files) {
	console.table(files)
	for (i = 0; i < files.length; i++) {
		var dot = files[i].path.match(/\.(.+)$/)[1]
		if (dot == 'bmp' || dot == 'BMP') {
			postMessage(['bmpImage', [files[i].path, i]], '*')
			todo(lang.lang_progress)
		} else {
			handleFileUpload(files[i], obj, i)
		}
	}
}
//ドラッグ・アンド・ドロップを終了
function closedrop() {
	$('#drag').css('display', 'none')
}
//ファイル選択
function fileselect() {
	postMessage(['sendSinmpleIpc', 'file-select'], '*')
}

//ファイル読み込み
function handleFileUpload(files, obj, no) {
	var fr = new FileReader()
	fr.onload = function(evt) {
		var b64 = evt.target.result
		var resize = localStorage.getItem('uploadCrop') * 1
		if (resize > 0) {
			var element = new Image()
			var width
			element.onload = function() {
				var width = element.naturalWidth
				var height = element.naturalHeight
				if (width > resize || height > resize) {
					postMessage(['resizeImage', [b64, resize]], '*')
					return false
				} else {
					$('#b64-box').val(b64)
					var ret = media(b64, files['type'], no)
				}
			}
			element.src = b64
			return false
		}
		$('#b64-box').val(b64)
		var ret = media(b64, files['type'], no)
	}
	fr.readAsDataURL(files)
	$('#mec').append(files['name'] + '/')
}

//ファイルアップロード
function media(b64, type, no, stamped) {
	var acct_id = $('#post-acct-sel').val()
	var domain = localStorage.getItem('domain_' + acct_id)
	var user = localStorage.getItem('user_' + acct_id)
	if ($('#stamp').hasClass('stamp-avail') && !stamped) {
		postMessage(['stampImage', [b64, user + '@' + domain]], '*')
		return false
	}
	var l = 4
	var c = 'abcdefghijklmnopqrstuvwxyz0123456789'
	var cl = c.length
	var r = ''
	for (var i = 0; i < l; i++) {
		r += c[Math.floor(Math.random() * cl)]
	}
	if ($('#media').val()) {
		$('#media').val($('#media').val() + ',' + 'tmp_' + r)
	} else {
		$('#media').val('tmp_' + r)
	}
	$('.toot-btn-group').prop('disabled', true)
	$('#post-acct-sel').prop('disabled', true)
	localStorage.setItem('image', 'busy')
	todo('Image Upload...')
	var media = toBlob(b64, type)
	var fd = new FormData()
	fd.append('file', media)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var httpreq = new XMLHttpRequest()
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var start = 'https://' + domain + '/api/drive/files/create'
		httpreq.open('POST', start, true)
		httpreq.upload.addEventListener('progress', progshow, false)
		httpreq.responseType = 'json'
		if ($('#nsfw').hasClass('nsfw-avail')) {
			var nsfw = true
		} else {
			var nsfw = false
		}
		var previewer = 'url'
		fd.append('i', at)
		httpreq.send(fd)
	} else {
		var previewer = 'preview_url'
		var start = 'https://' + domain + '/api/v1/media'
		httpreq.open('POST', start, true)
		httpreq.upload.addEventListener('progress', progshow, false)
		httpreq.responseType = 'json'
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
		httpreq.send(fd)
	}
	httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, json)
				$('.toot-btn-group').prop('disabled', false)
				$('select').formSelect()
				$('#mec').text(lang.lang_there)
				M.toast({ html: this.status + ':' +json, displayLength: 2000 })
				$('#imgup').text('')
				$('#imgsel').show()
			}
			if (!json.id) {
				todc()
				$('#imgup').text('')
				$('.toot-btn-group').prop('disabled', false)
				$('#post-acct-sel').prop('disabled', false)
				$('select').formSelect()
				$('#imgsel').show()
				M.toast({ html: lang.lang_postimg_failupload, displayLength: 5000 })
				return false
			}
			var img = localStorage.getItem('img')
			if (json.type.indexOf('image') != -1) {
				var html = `<img src="${json[previewer]}" class="preview-img pointer" data-media="${json['id']}" oncontextmenu="deleteImage('${json['id']}')" onclick="altImage('${acct_id}','${json['id']}')" title="${lang.lang_postimg_delete}">`
				$('#preview').append(html)
			} else {
				$('#preview').append(lang.lang_postimg_previewdis)
			}
			if (!img) {
				var img = 'no-act'
			}
			if (img != 'inline') {
				var mediav = $('#media').val()
				var regExp = new RegExp('tmp_' + r, 'g')
				mediav = mediav.replace(regExp, json['id'])
				$('#media').val(mediav)
			}
			if (img == 'url' && json['text_url']) {
				$('#textarea').val($('#textarea').val() + ' ' + json['text_url'])
			}
			todc()
			if (localStorage.getItem('nsfw_' + acct_id)) {
				$('#nsfw').addClass('yellow-text')
				$('#nsfw').html('visibility')
				$('#nsfw').addClass('nsfw-avail')
			}
			$('.toot-btn-group').prop('disabled', false)
			$('select').formSelect()
			$('#mec').text(lang.lang_there)
			M.toast({ html: lang.lang_postimg_aftupload, displayLength: 1000 })
			$('#imgup').text('')
			$('#imgsel').show()
			localStorage.removeItem('image')
		}
	}
}

//Base64からBlobへ
function toBlob(base64, type) {
	var bin = atob(base64.replace(/^.*,/, ''))
	var buffer = new Uint8Array(bin.length)
	for (var i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i)
	}
	// Blobを作成
	try {
		var blob = new Blob([new Uint8Array(buffer)], {
			type: type
		})
	} catch (e) {
		return false
	}

	return blob
}
//画像を貼り付けたら…
var element = document.querySelector('#textarea')
element.addEventListener('paste', function(e) {
	if (!e.clipboardData || !e.clipboardData.items) {
		return true
	}
	// DataTransferItemList に画像が含まれいない場合は終了する
	var imageItems = [...e.clipboardData.items].filter(i => i.type.startsWith('image'))
	if (imageItems.length == 0) {
		console.warn('it is not image')
		return true
	}

	// ファイルとして得る
	// DataTransferItem の kind は file なので getAsString ではなく getAsFile を呼ぶ
	var imageFile = imageItems[0].getAsFile()
	var imageType = imageItems[0].type

	// FileReaderで読み込む
	var fr = new FileReader()
	fr.onload = function(e) {
		// onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
		var base64 = e.target.result
		var mediav = $('#media').val()
		if (mediav) {
			var i = mediav.split(',').length
		}
		// DataTransferItem の type に mime tipes があるのでそれを使う
		media(base64, imageType, i)
	}
	fr.readAsDataURL(imageFile)

	// 画像以外がペーストされたときのために、元に戻しておく
})
function deleteImage(key) {
	Swal.fire({
		title: lang.lang_postimg_delete,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then(result => {
		if (result.value) {
			var media = $('#media').val()
			var arr = media.split(',')
			for (var i = 0; i < media.length; i++) {
				if (arr[i] == key) {
					arr.splice(i, 1)
					break
				}
			}
			$('#media').val(arr.join(','))
			$('#preview [data-media=' + key + ']').remove()
		}
	})
}
function altImage(acct_id, id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/media/' + id

	Swal.fire({
		title: lang.lang_postimg_desc,
		text: lang.lang_postimg_leadContext,
		input: 'text',
		inputAttributes: {
			autocapitalize: 'off'
		},
		showCancelButton: true,
		confirmButtonText: 'Post',
		showLoaderOnConfirm: true,
		preConfirm: data => {
			return fetch(start, {
				method: 'PUT',
				headers: {
					'content-type': 'application/json',
					Authorization: 'Bearer ' + at
				},
				body: JSON.stringify({
					description: data
				})
			})
				.then(function(response) {
					if (!response.ok) {
						response.text().then(function(text) {
							setLog(response.url, response.status, text)
						})
					}
					return response.json()
				})
				.catch(function(error) {
					todo(error)
					setLog(start, 'JSON', error)
					console.error(error)
				})
				.then(function(json) {
					console.log(json)
					$('[data-media=' + id + ']').attr('title', data)
				})
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then(result => {
		if (result.value) {
			Swal.fire({
				title: 'Complete'
			})
		}
	})
}
function stamp() {
	if ($('#stamp').hasClass('stamp-avail')) {
		$('#stamp').html('Off')
		$('#stamp').removeClass('stamp-avail')
	} else {
		$('#stamp').html('On')
		$('#stamp').addClass('stamp-avail')
	}
}