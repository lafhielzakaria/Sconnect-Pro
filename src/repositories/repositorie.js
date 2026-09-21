const db = require('../config/db');

async function index(tableName) {
    const query = `SELECT * FROM ${tableName}`;
    const { rows } = await db.query(query);
    return rows;
}

async function findById(tableName, id, idColumn = 'id') {
    const query = `SELECT * FROM ${tableName} WHERE ${idColumn} = $1`;
    const { rows } = await db.query(query,[id]);
    return rows[0] || null;
}
async function update(tableName, id, data, idColumn = 'id') {
    const keys = Object.keys(data);
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
    console.log("KEYS:", keys);
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
    console.log("QUERY:", query);
    console.log("VALUES:", values);
    const { rows } = await db.query(query, values);
    return rows[0];
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
};