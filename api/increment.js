const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../db.json');

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

// Функция для обработки запроса
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { user_id } = req.body;

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
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
