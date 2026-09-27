const { render } = require('../core/renderer');
const service = require('../services/association/associationService');
async function index(req, res) {
    try {
        const allAssociations = await service.getAllObjects('associations');
        const associations = allAssociations.slice(0, 3);
        await render(res, 'dashboard', { associations });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database connection error. Check your terminal for details.");
    }
}
module.exports = { index };