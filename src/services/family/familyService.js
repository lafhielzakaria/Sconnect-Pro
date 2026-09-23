const repo = require('../../repositories/repositorie');
const TABLE = 'families';

async function store(data) {
    return await repo.save(TABLE, data);
}
async function returnALlFamilies() {
    return await repo.index(TABLE);
}
async function findById(req, res, id) {
    return await repo.findById(TABLE, id);
}
module.exports = {
    store,
    returnALlFamilies,
    findById
};