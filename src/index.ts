import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { connectToMongoDB, getDatabase } from './mongo';
import { RowDataPacket } from 'mysql2';
import { authMiddleware } from './authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
connectToMongoDB();

// Definición del tipo de usuario
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Registro de usuario
app.post('/auth/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await db.query(sql, [name, email, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
});

// Inicio de sesión
app.post('/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query<RowDataPacket[]>(sql, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales no válidas.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales no válidas.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'tu_secreto', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error en el proceso de inicio de sesión.' });
    }
});

// Crear tarea en el mongodb
app.post('/users/:id/tasks', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    try {
        const db = getDatabase();
        const tasksCollection = db.collection('tasks');

        const newTask = {
            userId: parseInt(id),
            title,
            description,
            status,
            dueDate: new Date(dueDate),
        };

        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json({ message: 'Tarea creada', taskId: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
});

// Obtener todas las tareas de x usuario
app.get('/users/:id/tasks', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const db = getDatabase();
        const tasksCollection = db.collection('tasks');
        const tasks = await tasksCollection.find({ userId: parseInt(id) }).toArray();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

// Obtener una tarea específica
app.get('/users/:id/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
    const { id, taskId } = req.params;

    try {
        const db = getDatabase();
        const tasksCollection = db.collection('tasks');
        const task = await tasksCollection.findOne({ _id: new ObjectId(taskId), userId: parseInt(id) });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la tarea' });
    }
});

// Actualiza una tarea
app.put('/users/:id/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
    const { id, taskId } = req.params;
    const { title, description, status, dueDate } = req.body;

    try {
        const db = getDatabase();
        const tasksCollection = db.collection('tasks');

        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(taskId), userId: parseInt(id) },
            { $set: { title, description, status, dueDate: new Date(dueDate) } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea actualizada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea
app.delete('/users/:id/tasks/:taskId', authMiddleware, async (req: Request, res: Response) => {
    const { id, taskId } = req.params;

    try {
        const db = getDatabase();
        const tasksCollection = db.collection('tasks');

        const result = await tasksCollection.deleteOne({ _id: new ObjectId(taskId), userId: parseInt(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});

// Iniciar el servidor 
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
