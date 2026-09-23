const { render } = require('../../core/renderer');
const service = require('../../services/family/familyService');
async function index(req, res) {
    try {
        const families = await service.returnALlFamilies();
        if (!families) {
            return res.status(404).send("no families created until the moment.");
        }
        await render(res, 'family/allFamilies', { families });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).send("Database connection error. Check your terminal for details.");
    }
}
async function create(req, res) {
    try {
        await render(res, 'family/create', {});
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).send("Database connection error. Check your terminal for details.");
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
        const family = await service.findById(req, res, id);
        if (!family) {
            return res.end(JSON.stringify({ exists: false }));
        }
        return res.end(JSON.stringify({ exists: true, family: family }));
    } catch (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Database connection error. Check your terminal for details.");
    }
}
module.exports = { create, store, index, findObject };