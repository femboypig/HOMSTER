const express = require('express');
   const fs = require('fs');
   const path = require('path');

   const app = express();
   const PORT = process.env.PORT || 3000;
   const dbFilePath = path.join(__dirname, 'db.json');

   // Middleware для обработки JSON
   app.use(express.json());

   // Чтение базы данных
   function readDB() {
       try {
           const data = fs.readFileSync(dbFilePath, 'utf8');
           return JSON.parse(data);
       } catch (error) {
           return { users: {} };
       }
   }

   // Запись данных в базу данных
   function writeDB(data) {
       fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 4));
   }

   // Обработка POST запроса для увеличения кликов
   app.post('/api/increment', (req, res) => {
       const { user_id } = req.body;

       if (!user_id) {
           return res.status(400).json({ error: 'User ID is required' });
       }

       // Чтение данных из базы
       const db = readDB();

       // Проверка наличия пользователя в базе и увеличение количества кликов
       if (!db.users[user_id]) {
           db.users[user_id] = { clicks: 0 };
       }
       db.users[user_id].clicks += 1;

       // Запись данных в базу
       writeDB(db);

       // Отправка ответа с обновленным количеством кликов
       res.status(200).json({ clicks: db.users[user_id].clicks });
   });

   // Запуск сервера
   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });
