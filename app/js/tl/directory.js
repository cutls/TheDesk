//ディレクトリ
//ディレクトリトグル
function dirMenu() {
    $('#dir-contents').html('')
    directory('directory')
    $('#left-menu a').removeClass('active')
    $('#dirMenu').addClass('active')
    $('.menu-content').addClass('hide')
    $('#dir-box').removeClass('hide')
}

function dirselCk() {
    var acct = $('#dir-acct-sel').val()
    if (acct == 'noauth') {
        $('#dirNoAuth').removeClass('hide')
    } else {
        $('#dirNoAuth').addClass('hide')
        directory('check')
    }
}

function dirChange(mode) {
    if (mode === 'directory') $('#directoryConfig').removeClass('hide')
    if (mode === 'suggest') $('#directoryConfig').addClass('hide')
    directory(mode)
}

function directory(modeRaw, isMore) {
    const mode = modeRaw === 'check' ? $('[name=dirsug]:checked').val() : modeRaw
    var order = $('[name=sort]:checked').val()
    if (!order) {
        order = 'active'
    }
    var local_only = $('#local_only:checked').val()
    if (local_only) {
        local_only = 'true'
    } else {
        local_only = 'false'
    }
    var acct_id = $('#dir-acct-sel').val()
    if (acct_id == 'noauth') {
        var domain = $('#dirNoAuth-url').val()
        var at = ''
    } else {
        var domain = localStorage.getItem('domain_' + acct_id)
        var at = localStorage.getItem('acct_' + acct_id + '_at')
    }
    if (isMore) {
        var addOffset = $('#dir-contents .cvo').length
        $('#dir-contents').append(`<div class="progress transparent"><div class="indeterminate"></div></div>`)
    } else {
        var addOffset = 0
        $('#dir-contents').html(`<div class="progress transparent"><div class="indeterminate"></div></div>`)
    }
    let start = `https://${domain}/api/v1/directory?order=${order}&local=${local_only}&offset=${addOffset}`
    if (mode === 'suggest') start = `https://${domain}/api/v2/suggestions`
    console.log(start)
    fetch(start, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: 'Bearer ' + at,
            },
        })
        .then(function(response) {
            $('#dir-contents .progress').remove()
            if (!response.ok) {
                $('#dir-contents').html(`v2 follow suggestion is supported by Mastodon 3.4.0 or above.`)
                response.text().then(function(text) {
                    setLog(response.url, response.status, text)
                })
            }
            return response.json()
        })
        .catch(function(error) {
            setLog(start, 'JSON', error)
            console.error(error)
        })
        .then(function(json) {
            if (json) {
                $('#moreDir').removeClass('disabled')
                let obj = []
                if (mode === 'suggest') {
                    $('#moreDir').addClass('disabled')
                    for (const suggest of json) obj.push(suggest.account)
                } else {
                    obj = json
                }
                var html = userparse(obj, null, acct_id, 'dir', null)
                $('#dir-contents').append(html)
                jQuery('time.timeago').timeago()
            } else {
                $('#moreDir').addClass('disabled')
            }
        })
}