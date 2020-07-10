async function getJson(start) {
    let json = {}
    let response = null
    response = await fetch(start, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
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