const { Pool } = require('pg');
require('dotenv').config();

class DatabasePool {
    constructor() {
        if (DatabasePool.instance) {
            return DatabasePool.instance;
        }

        this.pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            max: 20, 
            idleTimeoutMillis: 30000,
        });

        this.pool.on('error', (err) => {
            console.error('[Database Error] Unexpected error on idle client:', err);
            process.exit(-1);
        });

        DatabasePool.instance = this;
    }

    /**
     * @returns {Pool}
     */
    getConnection() {
        return this.pool;
    }
}

const dbInstance = new DatabasePool();

const pool = dbInstance.getConnection();
Object.freeze(dbInstance);
module.exports = pool;