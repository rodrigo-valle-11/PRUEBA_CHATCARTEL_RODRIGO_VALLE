"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("./mongo");
const createTasksCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, mongo_1.getDatabase)();
    const tasksCollection = db.collection('tasks');
    const exampleTask = {
        userId: 1,
        title: 'Tarea de ejemplo',
        description: 'Descripción de mi tarea de ejemplo',
        status: 'pending',
        dueDate: new Date(),
        role: 'user'
    };
    yield tasksCollection.insertOne(exampleTask);
    console.log('Colección "tasks" creada y tarea de ejemplo guardada');
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_1.connectToMongoDB)();
    yield createTasksCollection();
});
main().catch(console.error);
