---
description: Тип Component — нажатая кнопка или выбранный пункт меню в действиях пользовательских команд.
---

# Component

<p class="lead">Нажатая кнопка или выбранный пункт меню. Доступен как <code>component</code> (или <code>button</code>) в действии, которое запустила кнопка или меню. Руководство — в статье <a href="/commands/components">Кнопки и меню выбора</a>.</p>

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `id` | Строка | ID кнопки или меню — тот, что указан при создании. Если действие запущено командой, а не кнопкой, — пусто |
| `type` | Строка | `BUTTON` — кнопка, `SELECTION_MENU` — меню выбора |
| `selectedOptions` | Список | Выбранные значения меню. Для меню типа `ROLE` — роли бота |

## Пример { #example }

```template
{% if component.type == 'SELECTION_MENU' %}
  Выбрано: {{ component.selectedOptions | first }}
{% elseif component.id == 'refresh' %}
  Обновлено!
{% else %}
  Вызвано командой.
{% endif %}
```
