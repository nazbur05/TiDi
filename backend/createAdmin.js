// import bcrypt from 'bcryptjs';
// import db from './config/database.js';

// const createAdminUser = async () => {
//     const name = 'Admin';
//     const usrname = 'adminuser';
//     const email = 'admin@example.com';
//     const password = 'adminpassword';
//     const isAdmin = true;

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert the user into the database
//         const query = 'INSERT INTO users (name, usrname, email, password, is_admin) VALUES (?, ?, ?, ?, ?)';
//         await db.query(query, [name, usrname, email, hashedPassword, isAdmin]);

//         console.log('Admin user created successfully');
//     } catch (error) {
//         console.error('Error creating admin user:', error);
//     } finally {
//         db.end(); // Close the database connection
//     }
// };

// createAdminUser();