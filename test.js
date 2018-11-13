const request = require('request')

request.post('http://localhost/api/cpfs/11411411422/notas', {
    json: {
        nota: 1
    }
}, (error, res, body) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
});