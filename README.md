# Astral Moderation — документация

[![ci](https://github.com/Astral-Clubs/AstralBotDocs/actions/workflows/ci.yml/badge.svg)](https://github.com/Astral-Clubs/AstralBotDocs/actions/workflows/ci.yml)
[![deploy](https://github.com/Astral-Clubs/AstralBotDocs/actions/workflows/deploy.yml/badge.svg)](https://github.com/Astral-Clubs/AstralBotDocs/actions/workflows/deploy.yml)
[![Текст: CC BY 4.0](https://img.shields.io/badge/текст-CC%20BY%204.0-blue)](LICENSE-CONTENT.txt)
[![Код: MIT](https://img.shields.io/badge/код-MIT-green)](LICENSE)

Открытая документация Telegram-бота [Astral Moderation](https://t.me/astralbsmodbot): шаблоны сообщений, пользовательские команды и справочник языка шаблонов. Написана для людей без опыта программирования.

**Сайт: [docs.astralbs.xyz](https://docs.astralbs.xyz)**

Документация открыта, и вы можете ее улучшить: на каждой странице сайта есть ссылка «Предложить правку этой страницы». Подробнее в [CONTRIBUTING.md](CONTRIBUTING.md).

## Содержание репозитория

```text
docs/
├─ index.md                  главная
├─ templates/                шаблоны сообщений
│  ├─ beginners/             раздел «Новичкам»
│  ├─ advanced/              расширенное руководство: синтаксис, теги, функции, rich, квоты, ошибки
│  ├─ storage/               атрибуты, индексы, параметры
│  └─ astral.md, shared.md, examples.md …
├─ commands/                 пользовательские команды
│  └─ actions/               типы действий
├─ reference/                справочник типов: Member, Chat, …
├─ glossary.md               словарик
├─ public/                   логотип, favicon, robots.txt и заголовки ответов (_headers)
└─ .vitepress/
   ├─ config.mts             настройки сайта, поиск, markdown
   ├─ sidebar.ts             боковое меню
   ├─ shiki/                 подсветка языка шаблонов и цветовая тема кода
   └─ theme/                 стили и компоненты
scripts/
├─ check-docs.ts             проверка страниц по правилам руководства
└─ check-comments.ts         проверка, что в коде нет комментариев
.github/                     CI, деплой, шаблоны задач и PR, Dependabot
wrangler.jsonc               настройки публикации на Cloudflare Workers
```

## Быстрый старт

Нужен [Bun](https://bun.sh) 1.4 или новее.

```bash
bun install
bun run dev
```

Сайт откроется на `http://localhost:5173`.

## Команды

| Команда | Что делает |
|---|---|
| `bun run dev` | Запускает сайт для разработки |
| `bun run build` | Собирает сайт в `docs/.vitepress/dist`. Падает на битой внутренней ссылке |
| `bun run preview` | Показывает собранный сайт |
| `bun run check` | Проверяет страницы по правилам [руководства по написанию](WRITING_GUIDE.md) |
| `bun run check:comments` | Проверяет, что в коде сайта нет комментариев |
| `bun run test` | Запускает тесты проверок |
| `bun run verify` | Все сразу: проверки, тесты и сборка. Это же делает CI |
| `bun run deploy:dry` | Собирает сайт и проверяет настройки Cloudflare без публикации |
| `bun run deploy` | Проверяет и публикует на Cloudflare (нужны права, см. ниже) |

## Как писать страницы

Правила тона, структуры страницы, оформления кода, подсказок, превью сообщений Telegram и добавления новых страниц собраны в [WRITING_GUIDE.md](WRITING_GUIDE.md). Коротко:

- Новая страница — `.md`-файл в нужной папке и строка в `docs/.vitepress/sidebar.ts`.
- В начале файла — `description` во frontmatter: он попадает в поиск, `llms.txt` и превью ссылок.
- Заголовкам `##` нужны латинские якоря: `## Кнопки { #buttons }`.
- Код шаблонов — в блоках ` ```template `.
- Каждый пример проверяется на боте.

## Публикация

Сайт собирается как статический и публикуется на [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) как Worker `astral-bot-docs` на домене `docs.astralbs.xyz`. Настройки лежат в [wrangler.jsonc](wrangler.jsonc), заголовки безопасности и кэширования в [docs/public/_headers](docs/public/_headers).

Публикация автоматическая: каждое слияние в `main` запускает workflow [deploy](.github/workflows/deploy.yml), который повторяет проверки и выполняет `wrangler deploy`. Для этого в репозитории нужны секреты `CLOUDFLARE_API_TOKEN` и `CLOUDFLARE_ACCOUNT_ID`.

Ручная публикация (для мейнтейнеров):

```bash
bunx wrangler login
bun run deploy
```

## Возможности сайта

Для каждой страницы при сборке создается `.md`-копия, а также `llms.txt` и `llms-full.txt` ([vitepress-plugin-llms](https://github.com/okineadev/vitepress-plugin-llms)). На них работают кнопки внизу страниц: «Скопировать страницу», «Открыть как Markdown», «Открыть в ChatGPT» и «Открыть в Claude». Для Gemini запрос копируется в буфер, потому что Gemini не принимает запрос из ссылки. Чтобы ИИ-сервисы могли прочитать страницу, сайт должен быть опубликован в интернете.

Также на сайте есть поиск по документации, карта сайта (`/sitemap.xml`) и ссылка «Предложить правку этой страницы» на каждой странице.

## Источник правды

Документация описывает поведение бота и движка шаблонов. Если оно меняется, в первую очередь правятся страницы `docs/templates/advanced/*` и `docs/reference/*`: на них опираются остальные. Не уверены в поведении — проверьте на боте или откройте задачу.

## Лицензии

- **Тексты документации** (все в `docs/`, кроме `docs/.vitepress/` и `docs/public/`) — [Creative Commons Attribution 4.0](LICENSE-CONTENT.txt). Можно копировать, переиспользовать и адаптировать, указывая авторство и ссылку на источник.
- **Код сайта** (конфиги, тема, компоненты, скрипты, автоматизация) — [MIT](LICENSE).

## Связь

- Ошибки и предложения: [задачи](https://github.com/Astral-Clubs/AstralBotDocs/issues/new/choose).
- Уязвимости: [SECURITY.md](SECURITY.md).
- Вопросы по работе бота: [@astralbsmodbot](https://t.me/astralbsmodbot).
