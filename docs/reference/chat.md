---
description: Тип Chat — текущий Telegram-чат в шаблонах Astral Moderation. Свойства и методы.
---

# Chat

<p class="lead">Текущий чат Telegram. Доступен в любом шаблоне как <code>chat</code>.</p>

При выводе `{{ chat }}` печатается название чата.

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `id` | Число | ID чата в Telegram |
| `title` | Строка | Название. Псевдоним — `name` |
| `username` | Строка | Публичный username чата, если есть |
| `type` | Строка | Тип чата Telegram |
| `isForum` | Логический | Включены ли топики |
| `memberCount` | Число | Количество участников |
| `inviteLink` | Строка | Ссылка-приглашение, если она есть и у бота есть право приглашать участников |
| `owner` | [Member](./member) | Создатель чата |
| `selfMember` | [Member](./member) | Сам бот как участник чата |
| `indexes` | Индексы | Доступ к индексам по имени: `chat.indexes.balances` — см. [ChatIndex](./chat-index) |
| `astral.tier` | Строка | Уровень доступа к данным Astral: `public` или `family` |
| `astral.club` | Клуб Astral | Первый клуб, привязанный к чату, или `null` — см. [astral](/templates/astral#clubs) |
| `astral.clubs` | Список | Все клубы, привязанные к чату |
| `createdAt`, `iconUrl` | — | Всегда пусто: Telegram не отдает эти данные |

## Методы { #methods }

| Метод | Возвращает | Описание |
|---|---|---|
| `getMember(id)` | [Member](./member) | Участник по ID из данных бота. Не больше 5 вызовов за выполнение |
| `getTopic(id)` | [Topic](./topic) | Топик по ID |
| `getRole(id)` | [BotRole](./bot-role) | Роль бота по ID |
| `getRoles()` | Список [BotRole](./bot-role) | Все роли бота в чате |
| `getIndex(имя)` | [ChatIndex](./chat-index) | Индекс по имени |
| `getAttribute(ключ)` | [MemberAttribute](./member-attribute) | Атрибут чата. То же, что `bot.getAttribute(ключ)` |
| `clearAttributes(ключ)` | — | Удалить атрибут с этим ключом у всех участников |
| `clearAllAttributes()` | — | Удалить все атрибуты в чате |
| `sendMessage(текст)` | — | Отправить сообщение в чат. Не больше 3 отправок за выполнение |
| `createMessage()` | [MessageBuilder](./message-builder) | Собрать rich-сообщение из блоков |

## Пример { #example }

```template
Добро пожаловать в «{{ chat.title }}»! Нас уже {{ chat.memberCount | number_format }}.
{% if chat.inviteLink %}Позови друзей: {{ chat.inviteLink }}{% endif %}
```
