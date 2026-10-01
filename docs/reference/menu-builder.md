---
description: MenuBuilder — меню выбора в пользовательских командах Telegram, собранное из кнопок-вариантов.
---

# MenuBuilder

<p class="lead">Построитель меню выбора. Создается функцией <code>select_menu(тип, id, подсказка, действие, неактивное?)</code>. В Telegram нет выпадающих списков, поэтому бот рисует меню кнопками-вариантами под сообщением. Руководство — в статье <a href="/commands/components#select-menu">Кнопки и меню выбора</a>.</p>

```template
{% do select_menu('STRING', 'mode', 'Выбери режим', 'self')
      .addOption('Броулбол', 'brawlball', '⚽')
      .addOption('Нокаут', 'knockout', '🎯')
      .withDefaultOption('brawlball') %}
```

Когда участник нажимает вариант, запускается действие меню: `component.type` равен `SELECTION_MENU`, а `component.selectedOptions` — список с выбранным значением.

## Типы меню { #types }

| Тип | Варианты |
|---|---|
| `STRING` | Ваши варианты из `addOption` |
| `ROLE` | Роли бота |
| `USER`, `CHANNEL`, `MENTIONABLE` | Не поддерживаются в Telegram — ошибка `unsupported_in_telegram` |

## Методы { #methods }

| Метод | Описание |
|---|---|
| `addOption(надпись, значение, эмодзи?, описание?)` | Добавить вариант. Описание в Telegram не показывается. До 25 вариантов |
| `withDefaultOption(значение)` | Отметить вариант галочкой ✓ |
| `endMenu()` | Завершить меню и вернуться к построителю сообщения — нужно, если меню строится внутри `createMessage()` |
| `withMinValues(n)`, `withMaxValues(n)`, `withRequiredRange(мин, макс)` | Выбор нескольких вариантов с кнопкой «Готово» <Badge type="warning" text="скоро" /> |
| `withChannelTypes(…)` | Не поддерживается — в Telegram нет каналов |
