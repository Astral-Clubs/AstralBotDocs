---
description: Тип MemberAttribute — значение, которое бот хранит для участника или чата. Свойства и методы update, increment, decrement, clear.
---

# MemberAttribute

<p class="lead">Атрибут — значение, которое бот хранит для участника или для чата. Получается методами <code>member.getAttribute(ключ)</code>, <code>bot.getAttribute(ключ)</code> и <code>chat.getAttribute(ключ)</code>. Руководство — в статье <a href="/templates/storage/attributes">Атрибуты</a>.</p>

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `value` | Число, строка, логическое, [Member](./member), [BotRole](./bot-role) или [Topic](./topic) | Значение. Пусто, если атрибут еще не записывали |
| `updatedAt` | [DateTime](./datetime) | Когда значение меняли последний раз |

## Методы { #methods }

| Метод | Возвращает | Описание |
|---|---|---|
| `update(значение)` | То же значение | Записать новое значение |
| `increment(n)` | Число | Прибавить `n`. Нечисловое значение считается нулем |
| `decrement(n)` | Число | Вычесть `n` |
| `clear()` | — | Удалить атрибут |

За одно выполнение можно обратиться не больше чем к 5 разным ключам атрибутов.

## Пример { #example }

```template
{% set uses = member.getAttribute('uses') %}
{% set last = uses.updatedAt %}
{% set n = uses.increment(1) %}
Ты вызвал эту команду {{ n }} {{ plural(n, 'ru', 'раз', 'раза', 'раз', 'раза') }}.
{% if last %}Прошлый раз: {{ date(last, "d MMMM 'в' HH:mm") }}{% endif %}
```
