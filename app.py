from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Путь к файлу базы данных
db_file = 'clicker.db'

# Функция для создания базы данных (если она не существует)
def init_db():
    if not os.path.exists(db_file):
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE users (
                user_id TEXT PRIMARY KEY,
                clicks INTEGER NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

# Чтение количества кликов для пользователя
def get_clicks(user_id):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute('SELECT clicks FROM users WHERE user_id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else 0

# Обновление количества кликов для пользователя
def update_clicks(user_id, clicks):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (user_id, clicks)
        VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET clicks = ?
    ''', (user_id, clicks, clicks))
    conn.commit()
    conn.close()

# Главная страница, отдаём index.html
@app.route('/')
def home():
    return render_template('index.html')

# Обработка запроса для увеличения кликов
@app.route('/increment', methods=['POST'])
def increment():
    # Получаем user_id из запроса
    data = request.get_json()
    user_id = data.get('user_id')

    # Получаем текущее количество кликов
    current_clicks = get_clicks(user_id)

    # Увеличиваем количество кликов
    new_clicks = current_clicks + 1

    # Обновляем количество кликов в базе
    update_clicks(user_id, new_clicks)

    # Возвращаем обновленные данные
    return jsonify({"clicks": new_clicks})

if __name__ == '__main__':
    init_db()  # Инициализируем базу данных при старте
    app.run(debug=True)
