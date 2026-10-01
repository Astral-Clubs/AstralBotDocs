---
description: Тип Parameters — параметры действий пользовательских команд, которые передаются кнопкам и следующим действиям.
---

# Parameters

<p class="lead">Параметры действия — временные данные, которые передаются от команды к кнопкам ее сообщения и между действиями цепочки <code>run</code>. Доступны как <code>parameters</code> в действиях пользовательских команд. Руководство — в статье <a href="/templates/storage/parameters">Параметры</a>.</p>

## Свойства { #properties }

Свойства динамические: каждое сохраненное значение доступно по своему ключу — `parameters.page`, `parameters.memberId`.

## Методы { #methods }

| Метод | Возвращает | Описание |
|---|---|---|
| `get(ключ)` | Значение | Прочитать параметр |
| `store(ключ, значение)` | — | Сохранить параметр. Значение — число, строка, [Member](./member), [BotRole](./bot-role) или [Topic](./topic) |

Параметры живут 15 минут с последнего обращения.

## Пример { #example }

```template
{% do parameters.store('target', arguments.targetMember) %}
{% do button('DANGER', 'kick', 'Исключить', null, 'f3a1c2b4-5d6e-4f70-8a9b-0c1d2e3f4a5b') %}
```

В действии кнопки:

```template
{{ parameters.target }} исключен.
```
