const { render } = require('../../core/renderer');
const service = require('../../services/facility/facilityService');
const associationService = require('../../services/association/associationService');
const { remove } = require('../../services/globalService');
async function index(req, res, params) {
    try {
        const facilities = await service.getAllObjects('facilities');
        if (!facilities) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end("no associations created until the moment.");
        }
        await render(res, 'facilities/facilities', { facilities });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.end("Database error: Could not save family group.");
    }
}
async function findById(req, res, params) {
    try {
        console.log(req.headers.referer);
        const { id } = params;
        const selectedAssociation = await service.getAssociationById(id);
        if (!selectedAssociation) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end("Association not found.");
        }
        await render(res, 'associations/detalis&membership', { selectedAssociation });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database connection error. Check your terminal for details.");
    }
}
async function create(req, res) {
    try {
        console.log("render");
        const associations = await associationService.getAllObjects('associations');
        await render(res, 'facilities/create', {associations});
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
        await service.store("facilities",reqBody);
        res.writeHead(302, { Location: '/facilities' });
        res.end();
    } catch (error) {
        console.error("Failed to save family group:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database error: Could not save family group.");
    }
}
async function destroy(req, res, params) {
    try {
        await remove('facilities', params.id);
        res.writeHead(302, { Location: '/facilities' });
        res.end();
    } catch (error) {
        console.error('Failed to delete facility:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error.');
    }
}
module.exports = { findById, index, create, store, destroy };