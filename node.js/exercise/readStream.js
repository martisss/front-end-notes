const fs = require('fs')
const stream = fs.createReadStream('./resource/users.json')
stream.on('data', (chunk) => console.log(chunk))
stream.on('end', () => console.log('finished!!!'))
