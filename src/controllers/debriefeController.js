const { render } = require("../core/renderer");
const service = require("../services/globalService");
async function getByID(req, res, params) {
    console.log("dd");
    const { id } = params;
    const activite = await service.findById("activities", id);
    if (!activite) {
        console.error('Failed to join activity:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error.');
    }
    return JSON.stringify(activite);
}
async function getSpecificColumns() {
    let columns = ["title", "max_capacity", "current_participants_number"];
    const activites = await service.getSpecificColumns("activities", columns);
   return JSON.stringify( activites);
}
module.exports = { getByID, getSpecificColumns };