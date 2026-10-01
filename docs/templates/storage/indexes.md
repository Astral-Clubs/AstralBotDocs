---
description: Индексы чата — отсортированные таблицы «ключ → число» для топов, рейтингов и экономики, с постраничным выводом.
---

# Индексы чата

<p class="lead">Индекс — это таблица «ключ → число», которую бот держит отсортированной. На нем строятся топы: самые богатые участники, лучшие игроки турнира, самые активные в неделю. Из атрибутов такой топ не собрать, а из индекса — одной строкой.</p>

## Как устроен индекс { #structure }

| Индекс `balances` | |
|---|---|
| **Ключ** | Любая строка до 255 символов. Обычно — ID участника |
| **Значение** | Число, по которому сортируется индекс |
| **Метаданные** | Необязательная строка до 500 символов — например, имя на момент записи |

Индекс создается сам при первой записи. Имя индекса вы придумываете: `balances`, `wins`, `tournament_2026`.

## Получить индекс { #get }

```template
{% set balances = chat.getIndex('balances') %}
```

Короче: `chat.indexes.balances`.

## Записать и прочитать { #write }

| Метод | Что делает |
|---|---|
| `index.get(ключ)` | Получить запись [ChatIndexEntry](/reference/chat-index#entry) |
| `index.update({ ключ1: значение1, ключ2: значение2 })` | Записать до двух значений сразу |
| `entry.update(значение, метаданные?)` | Записать значение одной записи |
| `entry.increment(n)`, `entry.decrement(n)` | Прибавить или вычесть |
| `entry.clear()` | Удалить запись |
| `index.clearAll()` | Удалить все записи индекса |

```template
{% set entry = chat.getIndex('wins').get(member.id) %}
{% do entry.increment(1) %}
{{ member }}, победа засчитана! Всего побед: {{ entry.value }}
```

У записи есть свойства `key`, `value`, `metadata`, `indexName` и `updatedAt`.

## Постраничный вывод { #page }

`index.getPageOf(номер, размер, порядок)` возвращает страницу записей, отсортированных по значению:

| Аргумент | Что писать |
|---|---|
| Номер | С нуля: `0` — первая страница |
| Размер | Сколько записей на странице, до 25 |
| Порядок | `'DESC'` — от большего к меньшему, `'ASC'` — наоборот |

Страницу можно перебрать в `for`. У нее есть свойства, полезные для кнопок листания:

| Свойство | Что в нем |
|---|---|
| `page.number` | Номер страницы с нуля |
| `page.size` | Размер страницы |
| `page.totalElements` | Сколько всего записей в индексе |
| `page.totalPages` | Сколько всего страниц |
| `page.isFirst`, `page.isLast` | Первая ли, последняя ли |
| `page.hasContent` | Есть ли записи на странице |

## Пример: топ балансов с листанием { #top }

```template
{% set pageNum = (parameters.get('page')) ?: 0 %}
{% if component.id == 'next' and not (parameters.get('isLast')) %}{% set pageNum += 1 %}{% elseif component.id == 'prev' and pageNum > 0 %}{% set pageNum -= 1 %}{% endif %}
{% set page = chat.indexes.balances.getPageOf(pageNum, 10, 'DESC') %}
{% do parameters.store('page', page.number) %}
{% do parameters.store('isLast', page.isLast) %}
## 💰 Самые богатые
{% for entry in page %}
{{ loop.index + page.number * page.size }}. {{ mention(entry.key) }} — {{ entry.value | number_format }} 🪙
{% else %}
Пока никто ничего не заработал.
{% endfor %}
{% do button('PRIMARY', 'prev', null, '⬅️', 'self', page.isFirst) %}
{% do button('PRIMARY', 'next', null, '➡️', 'self', page.isLast) %}
```

Включите у действия флажок **«Заменять сообщение с нажатой кнопкой»**, чтобы страницы листались в том же сообщении.

<TgPreview :buttons="[['⬅️|disabled', '➡️|primary']]">

## 💰 Самые богатые

1. [Анна](#) — 12 480 🪙
2. [Иван](#) — 9 150 🪙
3. [Олег](#) — 7 900 🪙

</TgPreview>

::: tip Как наполнить индекс
Чтобы в топе были балансы, при каждом изменении монет записывайте новое значение и в атрибут, и в индекс:

```template
{% set coins = member.getAttribute('coins').increment(100) %}
{% do chat.getIndex('balances').get(member.id).update(coins) %}
```
:::

## Ограничения { #limits }

- За одно выполнение — не больше 2 разных индексов, 2 записей и 1 страницы.
- Страница — до 25 записей.
- В чате — до 50 индексов, в индексе — до 100 000 записей.
