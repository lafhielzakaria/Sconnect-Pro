const { getSpecificColumns } = require('../controllers/debriefeController');
const repo = require('../repositories/repositorie');

async function getAllObjects(table, joins = [], conditions = {}) {
    if (joins.length > 0) {
        return await repo.getJoinedData(table, joins, conditions);
    }
    const [column, conditionValue] = Object.entries(conditions)[0] ?? [];
    return column ? await repo.index(table, column, conditionValue) : await repo.index(table);
}

async function store(table, data) {
    return await repo.save(table, data);
}

async function updateObject(table, id, data) {
    return await repo.update(table, id, data);
}

async function findById(table, id) {
    return await repo.findById(table, id);
}

async function remove(table, id) {
    return await repo.remove(table, id);
}
async function getSpecificColumns(table,columns){
return await repo.getSpecificColumns(table,columns);
}
module.exports = { getAllObjects, store, updateObject, findById, remove,getSpecificColumns };
