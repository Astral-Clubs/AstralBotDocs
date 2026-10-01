---
description: Тип Topic — топик форума Telegram в шаблонах Astral Moderation.
---

# Topic

<p class="lead">Топик чата-форума. Встречается как <code>topic</code> (куда отправится ответ) и <code>sourceTopic</code> (где вызвали команду).</p>

При выводе `{{ topic }}` печатается название топика.

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `id` | Число | ID топика. У основного топика General — 0; в чатах без топиков — пусто |
| `name` | Строка | Название |
| `mention` | Строка | Ссылка на топик |
| `isGeneral` | Логический | Это основной топик General |
| `closed` | Логический | Топик закрыт |
| `chat` | [Chat](./chat) | Чат топика |

## Методы { #methods }

| Метод | Возвращает | Описание |
|---|---|---|
| `sendMessage(текст)` | — | Отправить сообщение в топик. Не больше 3 отправок за выполнение |
| `sendMessageAndGet(текст)` | [Message](./message) | Отправить и получить отправленное сообщение |
| `createMessage()` | [MessageBuilder](./message-builder) | Собрать rich-сообщение из блоков |

`getMessageById` недоступен: Telegram не дает ботам читать историю чата.

## Пример { #example }

```template
{% set log = chat.getTopic(42) %}
{% do log.sendMessage('Новая заявка от ' ~ member.name) %}
Заявка отправлена в топик «{{ log }}».
```
