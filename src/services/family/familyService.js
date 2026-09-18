const repo = require('../../repositories/repositorie');
const TABLE = 'families';

async function createFamilyGroup(data) {
    return await repo.save(TABLE, data);
}
async function returnALlFamilies() {
    return await repo.index(TABLE);
}
module.exports = {
    createFamilyGroup,
    returnALlFamilies
};