const { render } = require('../../core/renderer');
const pool = require('../../config/db');
async function index(req, res, params) {
    try {
        const selectedAssociation = params;
        await render(res, 'associations/inscription', { selectedAssociation });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.status(500).send("Database connection error. Check your terminal for details.");
    }
}
module.exports = { index };