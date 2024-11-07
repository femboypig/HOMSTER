const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Разрешаем CORS
app.use(cors());

// Используем JSON для запросов
app.use(express.json());

// Путь к базе данных
const dbFilePath = path.join(__dirname, 'db.json');

// Чтение данных из базы данных
const readDb = () => {
    try {
        return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    } catch (err) {
        return { users: {} }; // Если файл не существует, возвращаем пустую структуру
    }
};

// Запись данных в базу данных
const writeDb = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 4));
};

// Обработка запросов для увеличения кликов
app.post('/increment', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    // Читаем текущие данные из базы данных
    let db = readDb();

    // Если пользователя нет в базе, добавляем его с начальным количеством кликов
    if (!db.users[user_id]) {
        db.users[user_id] = { clicks: 0 };
    }

    // Увеличиваем количество кликов
    db.users[user_id].clicks += 1;

    // Сохраняем обновленные данные
    writeDb(db);

    // Возвращаем обновленные данные
    res.json({ clicks: db.users[user_id].clicks });
});

// Отдаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
