# Villa Guelfi — сайт

Сайт [villaguelfi.com](https://villaguelfi.com). Собирается сборщиком Eleventy и публикуется на GitHub Pages сам — при каждом изменении в ветке `main`.

## Где что лежит

| Что поменять | Файл |
|---|---|
| Тексты страниц (английский и итальянский) | `src/_data/texts.json` |
| Апартаменты: цены, ссылки на бронирование, описание, число фото | `src/_data/apartments.json` |
| Почта, WhatsApp, Telegram, Instagram, счётчик, владелец данных для страницы приватности | `src/_data/site.json` |
| Фото | `src/assets/img/<название>/01.jpg`, `01-thumb.jpg` (маленькая копия) |
| Страница приватности | `src/privacy.md` и `src/it/privacy.md` |
| Внешний вид | `src/assets/css/style.css` |
| Устройство страницы | `src/_includes/home.njk`, `src/_includes/base.njk` |

## Посмотреть у себя на компьютере

```bash
npm install
```

```bash
npm start
```

Сайт откроется на http://localhost:8090.

## Как добавить фото в апартамент

1. Положить в папку апартамента два файла со следующим номером: большой (`20.jpg`, до 1600 px по длинной стороне) и маленький (`20-thumb.jpg`, 480 px).
2. Увеличить число `photos` у этого апартамента в `src/_data/apartments.json`.
