const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON
app.use(express.json());

// Статические файлы из директории public
app.use(express.static(path.join(__dirname, 'public')));

// Путь к файлу базы данных
const dbFilePath = path.join(__dirname, 'db.json');

// Чтение данных из базы данных
function readDb() {
    if (!fs.existsSync(dbFilePath)) {
        return { users: {} };
    }
    const data = fs.readFileSync(dbFilePath);
    return JSON.parse(data);
}

// Запись данных в базу данных
function writeDb(data) {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 4));
}

// Обработка запроса для увеличения кликов
app.post('/increment', (req, res) => {
    const { user_id } = req.body;

    const db = readDb();

    // Если пользователь не найден, создаем его запись
    if (!db.users[user_id]) {
        db.users[user_id] = { clicks: 0 };
    }

    // Увеличиваем количество кликов
    db.users[user_id].clicks += 1;

    // Записываем обновленные данные в базу
    writeDb(db);

    // Возвращаем обновленные данные
    res.json({ clicks: db.users[user_id].clicks });
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
