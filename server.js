/*workflow : 
client->server.js->router.js->controller->rendrer.js
*/
const { serveStatic } = require('./src/core/static');
const http = require('http');
const { lookup } = require('./src/core/router');
const server = http.createServer((req, res) => {
    const isStatic = serveStatic(req, res);
    if (!isStatic) {
        lookup(req, res);
    }

});
server.listen(3100, () => console.log('Server active on port 3100'));