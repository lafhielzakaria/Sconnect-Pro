const { store, findById, getAllObjects } = require('../globalService');

const TABLE = 'families';

const returnALlFamilies = () => getAllObjects(TABLE);
const storeFamiliy = (data) => store(TABLE, data);
const findFamilyById = (id) => findById(TABLE, id);

module.exports = { store: storeFamiliy, returnALlFamilies, findById: findFamilyById };
