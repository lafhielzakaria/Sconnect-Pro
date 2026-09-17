const { render } = require('../core/renderer');
const service = require('../services/association/associationService');
async function index(req, res) {
    try {
        const allAssociations = await service.getAllAssociations();
        const associations = allAssociations.slice(0, 3);
        await render(res, 'dashboard', { associations });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).send("Database connection error. Check your terminal for details.");
    }
}
module.exports = { index };