const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Мидлвар для обработки JSON
app.use(express.json());

// Путь к файлу базы данных
const dbFile = path.join(__dirname, 'db.json');

// Чтение данных из базы данных
const readDb = () => {
    try {
        return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    } catch (error) {
        return { users: {} };
    }
};

// Запись данных в базу данных
const writeDb = (data) => {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 4));
};

// Роут для увеличения кликов
app.post('api/increment', (req, res) => {
    const { user_id } = req.body;

    // Чтение данных из базы
    const db = readDb();

    // Если пользователь не найден, создаем его запись
    if (!db.users[user_id]) {
        db.users[user_id] = { clicks: 0 };
    }

    // Увеличиваем количество кликов
    db.users[user_id].clicks++;

    // Записываем обновленные данные в базу
    writeDb(db);

    // Отправляем обновленные данные
    res.json({ clicks: db.users[user_id].clicks });
});

// Порт, на котором будет работать сервер
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
