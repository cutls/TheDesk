async function getApi(start, at) {
    let json = {}
    let response = null
    response = await fetch(start, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${at}`
        }
    })
    if (!response.ok) {
        response.text().then(function (text) {
            setLog(response.url, response.status, text)
        })
    }
    json = await response.json()
    return json
}
async function postApi(url, body, at, ideKey) {
    let json = {}
    let response = null
    response = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${at}`,
            'Idempotency-Key': ideKey
        },
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        response.text().then(function (text) {
            setLog(response.url, response.status, text)
        })
    }
    json = await response.json()
    return json
}