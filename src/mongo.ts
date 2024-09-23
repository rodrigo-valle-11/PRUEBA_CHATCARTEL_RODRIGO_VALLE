import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);

export const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
    }
};

export const getDatabase = () => {
    return client.db(process.env.MONGODB_DB_NAME);
};
