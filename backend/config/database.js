import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ekiminbes_05',
    database: 'tididb'
});

console.log('Database pool created successfully');

export default db;