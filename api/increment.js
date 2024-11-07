// increment.js
const fs = require('fs');
const path = require('path');

// Путь к базе данных
const dbFilePath = path.join(__dirname, 'db.json');

// Чтение данных из базы
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

// Функция для увеличения кликов
function incrementClicks(userId) {
    const db = readDB();

    // Если user_id нет в базе, создаем его
    if (!db.users[userId]) {
        db.users[userId] = { clicks: 0 };
    }

    // Увеличиваем количество кликов
    db.users[userId].clicks += 1;

    // Сохраняем обновленную информацию в db.json
    writeDB(db);

    return db.users[userId].clicks; // Возвращаем количество кликов
}

module.exports = { incrementClicks };
