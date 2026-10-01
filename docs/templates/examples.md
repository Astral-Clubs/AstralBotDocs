---
description: Готовые шаблоны и пользовательские команды — приветствие, кубик, магический шар, экономика, топ с листанием, выбор роли, профиль, проверка по ЧС.
---

# Полезные примеры

<p class="lead">Готовые шаблоны, которые можно скопировать и поменять под себя. У каждого примера написано, куда его вставить и какие настройки выбрать.</p>

::: tip Как пользоваться
Наведите курсор на блок кода — справа появится кнопка копирования. UUID действий в примерах вымышленные: замените их на UUID своих действий из меню «⋯».
:::

## Приветствие с правилами { #welcome }

**Где:** «Приветствия» → «Приветствие при входе». Режим Rich, синтаксис Markdown.

```template
# Добро пожаловать, {{ member.name }}!
Ты **{{ chat.memberCount | number_format }}**-й участник **{{ chat.title }}**.

<details><summary>📜 Правила чата</summary>

1. Без рекламы и ссылок на другие чаты
2. Без оскорблений
3. Флуд и спам — мьют на час

</details>

{% do url_button('Полные правила', 'https://telegra.ph/pravila-chata') %}
```

<TgPreview :buttons="[['Полные правила|link']]">

# Добро пожаловать, Анна!

Ты **1 248**-й участник **Клуб Astral**.

<details><summary>📜 Правила чата</summary>

1. Без рекламы и ссылок на другие чаты
2. Без оскорблений
3. Флуд и спам — мьют на час

</details>

</TgPreview>

## Случайное число { #random }

**Где:** пользовательская команда `!ранд`, действие «Отправка сообщения».

```template
{% set minimum = arguments.get(1) %}
{% set maximum = arguments.get(2) %}
{% require minimum returning 'Пожалуйста, укажите минимальное значение!' %}
{% require minimum is number returning 'Минимальное значение должно быть числом!' %}
{% require maximum returning 'Пожалуйста, укажите максимальное значение!' %}
{% require maximum is number returning 'Максимальное значение должно быть числом!' %}
{% if (minimum > maximum) %}
  {% return 'Максимальное значение должно быть больше минимального!' %}
{% endif %}
{{ member }}, вам выпало **{{ random(minimum, maximum) }}**
```

<TgPreview user="!ранд 1 100" user-name="Анна">

[Анна](#), вам выпало **42**

</TgPreview>

## Магический шар { #8ball }

**Где:** команда `!шар`, «Отправка сообщения». Ответы выпадают с разной вероятностью.

```template
{% require arguments.value returning 'Задай вопрос: !шар выиграем ли мы турнир?' %}
🎱 {{ random(
  ['Бесспорно', 'Скорее да', 'Спроси позже', 'Даже не думай', 'Звезды говорят — да'],
  [25, 25, 20, 20, 10]
) }}
```

<TgPreview user="!шар выиграем ли мы турнир?" user-name="Анна">

🎱 Звезды говорят — да

</TgPreview>

## Монетка с реакцией { #coin }

**Где:** команда `!монетка`, «Отправка сообщения».

```template
{% set side = random(['Орел', 'Решка']) %}
🪙 {{ member.name }} подбрасывает монетку… **{{ side }}**!
{% do reaction(side == 'Орел' ? '🔥' : '👍') %}
```

## Профиль участника { #profile }

**Где:** команда `!профиль`, «Отправка сообщения». Можно вызвать для себя или ответом на чужое сообщение.

```template
{% set m = arguments.targetMember ?: member %}
## {{ m.name }}
{{ table([
  ['Уровень', m.rank.level],
  ['Опыт', m.rank.totalExp | number_format],
  ['Место в чате', m.rank.rank],
  ['До следующего уровня', m.rank.remainingExp | number_format],
  ['Предупреждения', m.warnCount],
  ['В чате с', date(m.joinedAt, 'd MMMM yyyy')]
], { bordered: true, compact: true }) }}
```

<TgPreview user="!профиль" user-name="Анна">

## Анна Смирнова

| | |
|---|---|
| Уровень | 12 |
| Опыт | 18 430 |
| Место в чате | 7 |
| До следующего уровня | 880 |
| Предупреждения | 0 |
| В чате с | 11 апреля 2026 |

</TgPreview>

## Экономика: бонус, баланс, перевод { #economy }

Три команды, которые работают вместе. Монеты хранятся в [атрибуте](./storage/attributes) `coins` и дублируются в [индекс](./storage/indexes) `balances` для топа.

**`!бонус`** — раз в сутки +100 монет. «Отправка сообщения»:

```template
{% set last = member.getAttribute('bonus_at') %}
{% require now().millis - (last.value ?: 0) >= 86400000 returning '⏳ Бонус уже получен. Приходи завтра!' %}
{% set coins = member.getAttribute('coins').increment(100) %}
{% do last.update(now().millis) %}
{% do chat.getIndex('balances').get(member.id).update(coins) %}
💰 {{ member }}, +100 монет! Теперь у тебя **{{ coins | number_format }}** 🪙
```

**`!баланс`** — показать монеты. «Отправка сообщения», режим ответа — эфемерно:

```template
{% set m = arguments.targetMember ?: member %}
У {{ m.name }} **{{ (m.getAttribute('coins').value ?: 0) | number_format }}** 🪙
```

**`!перевод @кому сумма`** — «Отправка сообщения»:

```template
{% set target = arguments.targetMember %}
{% set amount = arguments.get(2) %}
{% require target returning 'Кому переводим? !перевод @anna 50' %}
{% require target.id != member.id returning 'Нельзя перевести самому себе' %}
{% require (amount is number) and amount > 0 returning 'Сумма должна быть положительным числом' %}
{% set mine = member.getAttribute('coins') %}
{% require (mine.value ?: 0) >= amount returning 'Недостаточно монет' %}
{% set left = mine.decrement(amount) %}
{% set theirs = target.getAttribute('coins').increment(amount) %}
{% set balances = chat.getIndex('balances') %}
{% do balances.get(member.id).update(left) %}
{% do balances.get(target.id).update(theirs) %}
💸 {{ member }} → {{ target }}: **{{ amount }}** 🪙
```

Команда пишет две записи индекса — это максимум за одно выполнение, см. [квоты](./advanced/limits#quotas).

## Топ с листанием { #top }

**Где:** команда `!топ`, «Отправка сообщения», флажок «Заменять сообщение с нажатой кнопкой» включен. Использует индекс `balances` из примера выше.

```template
{% set pageNum = (parameters.get('page')) ?: 0 %}
{% if component.id == 'next' and not (parameters.get('isLast')) %}{% set pageNum += 1 %}{% elseif component.id == 'prev' and pageNum > 0 %}{% set pageNum -= 1 %}{% endif %}
{% set page = chat.indexes.balances.getPageOf(pageNum, 10, 'DESC') %}
{% do parameters.store('page', page.number) %}
{% do parameters.store('isLast', page.isLast) %}
## 💰 Самые богатые · {{ page.number + 1 }}/{{ page.totalPages ?: 1 }}
{% for entry in page %}
{{ loop.index + page.number * page.size }}. {{ mention(entry.key) }} — {{ entry.value | number_format }} 🪙
{% else %}
Пока никто ничего не заработал.
{% endfor %}
{% do button('PRIMARY', 'prev', null, '⬅️', 'self', page.isFirst) %}
{% do button('PRIMARY', 'next', null, '➡️', 'self', page.isLast) %}
```

<TgPreview :buttons="[['⬅️|disabled', '➡️|primary']]">

## 💰 Самые богатые · 1/4

1. [Анна](#) — 12 480 🪙
2. [Иван](#) — 9 150 🪙
3. [Олег](#) — 7 900 🪙

</TgPreview>

## Выбор роли из меню { #role-menu }

Участник выбирает роль бота — например, любимый режим игры.

**Действие 1 — «Меню»** (по умолчанию), «Отправка сообщения»:

```template
Выбери свой любимый режим — получишь роль и доступ к топику:
{% do select_menu('STRING', 'mode', 'Режим', 'a7c3e1f0-5b2d-4c8e-9f1a-2d3e4f5a6b7c')
      .addOption('Броулбол', 'r_brawlball', '⚽')
      .addOption('Захват кристаллов', 'r_gemgrab', '💎')
      .addOption('Одиночное ШД', 'r_showdown', '🌵') %}
```

**Действие 2 — «Выдать»**, «Отправка сообщения», куда — эфемерно:

```template
{% set roleId = component.selectedOptions | first %}
{% transform r in ['r_brawlball', 'r_gemgrab', 'r_showdown'] as others %}
  {% if r != roleId %}{% return r %}{% endif %}
{% endtransform %}
{% do member.modifyRoles([roleId], others) %}
Готово! Теперь у тебя роль {{ chat.getRole(roleId) }}.
```

`transform` собирает список «остальных» ролей, а `modifyRoles` одним вызовом выдает выбранную и снимает остальные. ID ролей (`r_brawlball` и другие) замените на ID своих ролей из раздела «Роли бота».

## Счетчик вызовов { #counter }

**Где:** любой шаблон. Считает, сколько раз его выполнили, в атрибуте чата.

```template
{% set n = bot.getAttribute('hello_count').increment(1) %}
Привет! Со мной поздоровались уже {{ n }} {{ plural(n, 'ru', 'раз', 'раза', 'раз', 'раза') }}.
```

## Проверка игрока по ЧС { #blacklist }

**Где:** команда `!чс`, «Отправка сообщения». Работает только в чате, привязанном к клубу Astral.

```template
{% set tag = arguments.get(1) | upper | replace('#', '') %}
{% require tag returning 'Укажи тег игрока: !чс ABCD1234' %}
{% set r = astral.blacklist.check(tag) %}
{% if r.blacklisted -%}
⛔ #{{ tag }} в черном списке ({{ r.type == 'project' ? 'проектный' : 'клубный' }}). Причина: {{ r.reason }}
{%- else -%}
✅ #{{ tag }} не найден в черном списке.
{%- endif %}
```

Больше примеров с данными Astral — в статье [Пространство astral](./astral#examples).

## Подтверждение бана кнопками { #ban-confirm }

Разобран подробно в статье [Кнопки и меню выбора](/commands/components#confirm).
