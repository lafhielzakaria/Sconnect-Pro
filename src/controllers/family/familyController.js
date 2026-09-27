const { render } = require('../../core/renderer');
const service = require('../../services/family/familyService');
const { remove } = require('../../services/globalService');
async function index(req, res) {
    try {
        const families = await service.returnALlFamilies();
        if (!families) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end("no families created until the moment.");
        }
        await render(res, 'family/allFamilies', { families });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database connection error. Check your terminal for details.");
    }
}
async function create(req, res) {
    try {
        await render(res, 'family/create', {});
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database connection error. Check your terminal for details.");
    }
}
async function store(req, res) {
    try {
        let rawBody = '';
        for await (const chunk of req) {
            rawBody += chunk;
        }

        const reqBody = Object.fromEntries(new URLSearchParams(rawBody));
        console.log("controller req.body:", reqBody);
        await service.store(reqBody);
        res.writeHead(302, { Location: '/' });
        res.end();
    } catch (error) {
        console.error("Failed to save family group:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database error: Could not save family group.");
    }
}
async function findObject(req, res, params) {
    try {
        const { id } = params;
        const family = await service.findById(id);
        if (!family) {
            return res.end(JSON.stringify({ exists: false }));
        }
        return res.end(JSON.stringify({ exists: true, family: family }));
    } catch (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Database connection error. Check your terminal for details.");
    }
}
async function destroy(req, res, params) {
    try {
        await remove('families', params.id);
        res.writeHead(302, { Location: '/families' });
        res.end();
    } catch (error) {
        console.error('Failed to delete family:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error.');
    }
}
module.exports = { create, store, index, findObject, destroy };