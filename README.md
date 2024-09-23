# PRUEBA_CHATCARTEL_RODRIGO_VALLE
Crud de Usuarios y Tareas con nodejs

Este proyecto es una API que nos ayuda a gestionar usuarios y tareas utilizando MYSQL para los usuarios y MongoDB para las tareas, tiene autenticación JWT, validaciones, manejo de errores, y roles.

Las tecnologías utlizadas son:
1.Node.Js
2.TypeScript
3.Express
4.MySql
5.MongoDB
6.JWT
7.bcrypt

PASOS PARA LA INSTALACIÓN DEL PROGRAMA

ESTRUCTURA DEL PROYECTO:

PRUEBA_CHATCARTEL_RODRIGO_VALLE/
-.env
-package.json
-package-lock.json
-tsconfig.json
dist/ -authMiddleware.js -db.js -index.js -initDb.js -initTasks.js -mongo.js
node_modules/...
src/ -authMiddleware.ts -db.ts -.global.d.ts -index.js -indes.ts -initDb.ts -initTasks.ts - mongo.ts

1. Clonar el repositorio
2. instalas las dependencias con el comando "npm install"
3. Configurar las variables de entorno del archivo .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rodva
DB_NAME=CrudUs
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=Crudtasks
JWT_SECRET=1234
4.  Iniciar la base de datos en Mysql con "npm run init-db
5.  ejecutar comando para la colección de las tareas en mongodb: "npm run init-tasks"
6.  para poder iniciar el servidor utlizar: "npm start" (La api estará corriendo en el servidor http://localhost:3000

RUTAS DE LA API

USUARIOS: 
POST auth/register
POST /auth/login

TAREAS: 
post /users/:id/tasks
GET /users/:id/tasks
GET /users/:id/tasks/:taskId
PUT /users/:id/tasks/:taskId
DELETE /users/:id/tasks/:taskId

IMPORTANTE!

-Debe estar en ejecución la base de datos de Mysql y de MongoDB
-Las contraseñas está en encriptadas
-La autenticación se realiza mediante tokens JWT que deben ser enviados en el header Authorization con el formato Bearer token, para las pruebas se utilizó Postman
