const { render } = require('../../core/renderer');
const familyService = require('../../services/family/familyService');
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
        await familyService.createFamilyGroup(req.body);

        res.writeHead(302, { Location: '/' });
        res.end();
    } catch (error) {
        console.error("Failed to save family group:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database error: Could not save family group.");
    }
}
module.exports = { create ,store};