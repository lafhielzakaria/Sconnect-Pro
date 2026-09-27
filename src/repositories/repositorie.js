const db = require('../config/db');

async function index(tableName, column = null, conditionValue = null) {
    let query = `SELECT * FROM ${tableName}`;
    if (column) {
        query = `SELECT * FROM ${tableName} where  ${column} = '${conditionValue}'`;
    }
    const { rows } = await db.query(query);
    return rows;
}

async function findById(tableName, id, idColumn = 'id') {
    const query = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
}
async function update(tableName, id, data, idColumn = 'id') {
    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new Error("No data provided for update");
    }
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    values.push(id);
    const idParamIndex = values.length;
    const query = `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE ${idColumn} = $${idParamIndex}
        RETURNING *
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
}
async function save(tableName, data) {
    const tableInfo = await db.query(`SELECT * FROM ${tableName} LIMIT 0`);
    const validColumns = tableInfo.fields.map(field => field.name);
    const keys = Object.keys(data).filter(key =>
        validColumns.includes(key)
    );
    const values = keys.map(key => data[key]);
    const placeholders = keys
        .map((_, i) => `$${i + 1}`)
        .join(', ');
    const columns = keys.join(', ');
    const query = `
        INSERT INTO ${tableName} (${columns})
        VALUES (${placeholders})
        RETURNING *
    `;
    const { rows } = await db.query(query, values);
    return rows[0];
}
async function getJoinedData(baseTable, joins = [], conditions = {}) {
    const joinedNames = joins
        .map(join => {
            const alias = join.alias || `${join.table}_name`;
            return `${join.table}.name AS ${alias}`;
        })
        .join(', ');

    let query = `
        SELECT
            ${baseTable}.*${joinedNames ? `, ${joinedNames}` : ''}
        FROM ${baseTable}
    `;

    const values = [];
    let paramIndex = 1;

    joins.forEach(join => {
        query += ` JOIN ${join.table} ON ${join.on}`;
    });

    const conditionKeys = Object.keys(conditions);

    if (conditionKeys.length > 0) {
        const whereClauses = conditionKeys.map(key => {
            values.push(conditions[key]);
            return `${key} = $${paramIndex++}`;
        });

        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const { rows } = await db.query(query, values);

    return rows;
}


async function remove(tableName, id, idColumn = 'id') {
    const query = `DELETE FROM ${tableName} WHERE ${idColumn} = $1 RETURNING *`;
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
}

module.exports = {
    index,
    findById,
    update,
    save,
    remove,
    getJoinedData
};