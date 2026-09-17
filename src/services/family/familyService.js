const repo = require('../../repositories/repositorie');
const TABLE = 'families';

async function createFamilyGroup(data) {
    return await repo.save(TABLE, data);
}

module.exports = {
    createFamilyGroup
};