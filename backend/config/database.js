import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysqlfortidi',
    database: 'tididb'
});

console.log('Database pool created successfully');

export default db;