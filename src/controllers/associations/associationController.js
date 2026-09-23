const { render } = require('../../core/renderer');
const service = require('../../services/association/associationService');
async function index(req, res, params) {
    try {
        const { id } = params;
        const associations = await service.getAllAssociations();
        if (!associations) {
            return res.status(404).send("no associations created until the moment.");
        }
        await render(res, 'associations/allAssociations', { associations });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).send("Database connection error. Check your terminal for details.");
    }
}
async function findById(req, res, params) {
    try {
        console.log(req.headers.referer);
        const { id } = params;
        const selectedAssociation = await service.getAssociationById(id);
        if (!selectedAssociation) {
            return res.status(404).send("Association not found.");
        }
        await render(res, 'associations/detalis&membership', { selectedAssociation });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).send("Database connection error. Check your terminal for details.");
    }
}
async function create(req, res) {
    try {
        await render(res, 'associations/create', {});
    } catch (error) {
        console.error("file rendering failed:", error.message);
    }
}
async function store(req, res) {
    try {
        let rawBody = '';
        for await (const part of req) {
            rawBody += part;

        }
        const reqBody = Object.fromEntries(new URLSearchParams(rawBody));
        await service.store(reqBody);
        res.writeHead(302, { Location: '/associations' });
        res.end();
    } catch (error) {
        console.error("Failed to save family group:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database error: Could not save family group.");
    }
}
module.exports = { findById, index, create, store };