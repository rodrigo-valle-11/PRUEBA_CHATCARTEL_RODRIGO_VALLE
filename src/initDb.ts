import db from './db';

const createTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error creando la tabla:', err);
        } else {
            console.log('Tabla "users" creada o ya existe');
        }
    });
};

createTable();
