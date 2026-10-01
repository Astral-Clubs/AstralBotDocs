---
description: Тип Message — сообщение Telegram в шаблонах Astral Moderation. Текст, автор, упоминания, вложения, ответ.
---

# Message

<p class="lead">Сообщение Telegram. Встречается как <code>message</code> — сообщение с вызовом команды или сообщение, нарушившее правила, — а также как <code>message.referencedMessage</code> (на что ответили).</p>

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `id` | Число | ID сообщения в чате |
| `text` | Строка | Исходный текст. Псевдоним — `contentRaw` |
| `contentDisplay` | Строка | Текст, в котором упоминания заменены именами |
| `contentStripped` | Строка | Текст без форматирования |
| `jumpUrl` | Строка | Ссылка на сообщение (в супергруппах) |
| `author` | [Member](./member) | Автор |
| `topic` | [Topic](./topic) | Топик |
| `chat` | [Chat](./chat) | Чат |
| `createdAt` | [DateTime](./datetime) | Когда отправлено |
| `mentionedMembers` | Список [Member](./member) | Упомянутые участники: ссылками на профиль и через `@username`, если бот знает этого участника |
| `attachments` | Список [Attachment](./attachment) | Вложения: фото, видео, файлы, стикеры |
| `referencedMessage` | Message | Сообщение, на которое ответили |
| `isForward` | Логический | Сообщение переслано <Badge type="tip" text="новое" /> |
| `mentionedRoles`, `mentionedChannels` | Список | Всегда пустые: в Telegram нет ролей и каналов |

## Методы { #methods }

| Метод | Описание |
|---|---|
| `delete()` | Удалить сообщение (нужно право бота удалять сообщения) |
| `pin()`, `unpin()` | Закрепить или открепить |
| `react(эмодзи)` | Поставить реакцию <Badge type="tip" text="новое" /> |

## Пример { #example }

```template
{% set quoted = message.referencedMessage %}
{% require quoted returning 'Ответь командой на сообщение, которое нужно сохранить' %}
Сохранено сообщение {{ quoted.author }}:
{{ quote(quoted.contentStripped, quoted.author.name) }}
```
