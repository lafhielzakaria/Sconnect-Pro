const repo = require('../../repositories/repositorie');
const TABLE = 'associations';

async function getAllAssociations() {
    return await repo.index(TABLE);
}

async function getAssociationById(id) {
    return await repo.findById(TABLE, id);
}

module.exports = {
    getAllAssociations,
    getAssociationById
};