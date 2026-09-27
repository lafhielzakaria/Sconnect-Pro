const { getAllObjects, store, updateObject, findById } = require('../globalService');

const TABLE = 'facilities';

const getFacilityById = (id) => findById(TABLE, id);

module.exports = { getAllObjects, store, updateObject, getFacilityById };
