import http from 'http'

const server = http.createServer();

server.listen(8080, () => {
    console.log('Hola, COMO VA, todo bien?')
})