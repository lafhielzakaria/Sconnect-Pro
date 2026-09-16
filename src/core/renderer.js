// src/core/renderer.js
const ejs = require('ejs');
const path = require('path');

const viewsPath = path.join(__dirname, '../../views/pages');

async function render(res, viewName, data = {}) {
    try {
        const filePath = path.join(viewsPath, `${viewName}.ejs`);
        const fileRendering = await ejs.renderFile(filePath, data);
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fileRendering);
    } catch (err) {
        console.error(`[Renderer Error] Cannot render view '${viewName}':`, err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error (Template Rendering Failed)');
    }
}

module.exports = { render };