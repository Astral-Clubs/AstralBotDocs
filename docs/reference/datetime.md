---
description: Тип DateTime — дата и время в шаблонах Astral Moderation. Свойства и методы для вычислений с датами.
---

# DateTime

<p class="lead">Дата и время с часовым поясом. Получается функциями <code>now()</code> и <code>calendar(…)</code>, а также из данных: <code>member.joinedAt</code>, <code>message.createdAt</code>. Часовой пояс по умолчанию — пояс чата из раздела «Общие».</p>

При выводе `{{ дата }}` печатается дата в формате `сб, 11 апр. 2026 15:27:38 MSK`, а по нажатию Telegram покажет ее в поясе зрителя. Свой формат — функция [`date`](/templates/advanced/functions#date), время в поясе зрителя — [`datetime`](/templates/advanced/functions#datetime).

## Свойства { #properties }

| Свойство | Описание |
|---|---|
| `millis` | Unix-время в миллисекундах |
| `year`, `monthOfYear`, `dayOfMonth` | Год, месяц (1–12), день месяца |
| `hourOfDay`, `minuteOfHour`, `secondOfMinute` | Часы, минуты, секунды |
| `dayOfWeek` | День недели: 1 — понедельник, 7 — воскресенье |
| `dayOfYear`, `weekOfWeekyear`, `weekyear` | День года, неделя года, год недели |
| `millisOfDay`, `millisOfSecond`, `secondOfDay`, `minuteOfDay` | Время от начала суток или секунды |
| `yearOfCentury`, `yearOfEra`, `centuryOfEra`, `era` | Части года |
| `zoneOffset` | Смещение часового пояса |
| `isAfterNow`, `isBeforeNow` | В будущем ли, в прошлом ли дата |

## Методы { #methods }

Методы не меняют дату, а возвращают новую.

| Метод | Описание |
|---|---|
| `plusMillis(n)`, `plusSeconds(n)`, `plusMinutes(n)`, `plusHours(n)` | Прибавить время |
| `plusDays(n)`, `plusWeeks(n)`, `plusMonths(n)`, `plusYears(n)` | Прибавить дни, недели, месяцы, годы |
| `minusMillis(n)` … `minusYears(n)` | То же, но вычесть |
| `isAfter(дата)`, `isBefore(дата)` | Позже или раньше другой даты |

## Пример { #example }

```template
{% set days = round((now().millis - member.joinedAt.millis) / 86400000, 'FLOOR') %}
Ты с нами {{ days }} {{ plural(days, 'ru', 'день', 'дня', 'дней', 'дня') }}.
Годовщина: {{ date(member.joinedAt.plusYears(1), 'd MMMM yyyy') }}
```
