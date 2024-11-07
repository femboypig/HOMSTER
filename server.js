const express = require('express');
const path = require('path');
const { incrementClicks } = require('./increment');
const app = express();
const port = 3000;

// Даем доступ к json body
app.use(express.json());

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Роут для увеличения кликов
app.post('/increment', (req, res) => {
    const { user_id } = req.body;

    // Генерация уникального ID, если user_id не передан
    const currentUserId = user_id || 'user_' + Math.random().toString(36).substr(2, 9);

    // Используем функцию для инкремента
    const clicks = incrementClicks(currentUserId);

    // Отправка ответа с обновленным количеством кликов
    res.status(200).json({ clicks });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
