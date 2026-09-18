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

module.exports = { findById , index};