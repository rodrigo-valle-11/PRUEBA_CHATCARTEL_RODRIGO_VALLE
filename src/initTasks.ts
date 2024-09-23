import { connectToMongoDB, getDatabase } from './mongo';

const createTasksCollection = async () => {
    const db = getDatabase();
    const tasksCollection = db.collection('tasks');

    const exampleTask = {
        userId: 1,
        title: 'Tarea de ejemplo',
        description: 'Descripción de la tarea de ejemplo',
        status: 'pending',
        dueDate: new Date(),
        role: 'user'
    };

    await tasksCollection.insertOne(exampleTask);
    console.log('Colección "tasks" creada y tarea de ejemplo insertada');
};

const main = async () => {
    await connectToMongoDB();
    await createTasksCollection();
};

main().catch(console.error);
