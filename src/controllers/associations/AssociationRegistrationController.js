const { render } = require('../../core/renderer');
const pool = require('../../config/db');
const service = require('../../services/association/associationService');
async function index(req, res, params) {
    try {
       
        const selectedAssociationId = params;
        const selectedAssociation = service.getAssociationById(selectedAssociationId);
        await render(res, 'associations/inscription', { selectedAssociation });
    } catch (error) {
      console.error("Failed to save family group:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database error: Could not save family group.");
    }
}
async function priceCalculatore(req, res) {


    return finalPrice;

}
async function register(req, res) {
    try {
        let rawBody = '';
        for await (const chunk of req) {
            rawBody += chunk;
        }

        const reqBody = Object.fromEntries(new URLSearchParams(rawBody));
        console.log(reqBody);
        // await service.store(reqBody);
        // res.writeHead(302, { Location: '/' });
        res.end();
    } catch (error) {
        console.error("Failed to save family group:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("Database error: Could not save family group.");
    }
}
module.exports = { index, register };