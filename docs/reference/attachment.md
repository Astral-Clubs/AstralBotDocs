---
description: Тип Attachment — вложение сообщения Telegram (фото, видео, файл, стикер) в шаблонах Astral Moderation.
---

# Attachment

<p class="lead">Вложение сообщения: фото, видео, документ, голосовое, стикер. Список вложений — в <code>message.attachments</code>.</p>

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `type` | Строка | `photo`, `video`, `document`, `audio`, `voice`, `animation`, `sticker`, `video_note` |
| `fileId` | Строка | ID файла в Telegram |
| `fileUniqueId` | Строка | Постоянный уникальный ID файла |
| `fileName` | Строка | Имя файла (для документов) |
| `mimeType` | Строка | MIME-тип |
| `size` | Число | Размер в байтах |
| `width`, `height` | Число | Размеры изображения или видео |
| `duration` | Число | Длительность аудио или видео в секундах |
| `url` | — | Всегда пусто: у файлов Telegram нет публичной ссылки |

## Пример { #example }

```template
{% set files = message.attachments %}
{% if files %}
Во вложении {{ files | length }} {{ plural(files | length, 'ru', 'файл', 'файла', 'файлов', 'файла') }}:
{% for f in files %}
- {{ f.type }}{% if f.fileName %} — {{ f.fileName }}{% endif %}
{% endfor %}
{% endif %}
```
