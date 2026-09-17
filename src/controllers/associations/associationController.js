const { render } = require('../../core/renderer');
const service = require('../../services/association/associationService');

async function index(req, res, params) {
    try {
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

module.exports = { index };