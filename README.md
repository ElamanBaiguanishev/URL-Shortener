# URL Shortener API

Проект написан на фреймворке express js, mongoose

## Запуск проекта

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/ElamanBaiguanishev/URL-Shortener
   ```
2. Перейдите в директорию проекта:
   ```bash
   cd URL-Shortener
   ```
3. Запустите проект с помощью Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Доступные маршруты

- UI доступен по адресу: [http://localhost:3000/](http://localhost:3000/)
- API доступен по адресу: [http://localhost:3000/api](http://localhost:3000/api)

### Список маршрутов API

- `POST /shorten` - Создание короткой ссылки.
- `GET /analytics/:shortUrl` - Получение аналитики для короткой ссылки.
- `GET /info/:shortUrl` - Получение информации о сокращённой ссылке.
- `DELETE /delete/:shortUrl` - Удаление короткой ссылки.
- `GET /links` - Получение всех сокращённых ссылок.
- `GET /:shortUrl` - Переадресация на оригинальный URL.
