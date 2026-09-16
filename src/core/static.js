const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};
function serveStatic(req, res) {
    const ext = path.extname(req.url).toLowerCase();

    if (MIME_TYPES[ext]) {
        const filePath = path.join(__dirname, '../../', req.url);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Asset Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] });
                res.end(content);
            }
        });
        return true;
    }
    return false;
}
module.exports = { serveStatic };