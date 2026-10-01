---
description: Пространство astral в шаблонах — клубы семьи Astral, профили игроков Brawl Stars, рейтинги, статистика и проверка по черному списку.
---

# Пространство astral

<p class="lead">Через объект <code>astral</code> шаблоны получают данные проекта Astral: клубы семьи, профили игроков Brawl Stars, рейтинги, статистику клубов и черный список. Данные доступны только для чтения — шаблон ничего не может в них изменить.</p>

## Уровни доступа { #tiers }

Что доступно чату, зависит от его уровня. Уровень определяет сервер Astral — бот и шаблон не могут его изменить.

| Уровень | Какие чаты | Что доступно |
|---|---|---|
| <Badge type="info" text="public" /> | Любой чат | Клубы семьи, рейтинги, публичные профили игроков, статистика клубов |
| <Badge type="tip" text="family" /> | Чат, привязанный к клубу Astral | Все из `public` + история вступлений и выходов клуба, снимок состава, **проверка и просмотр черного списка** |

Узнать уровень чата: `{{ astral.tier }}` → `public` или `family`.

## Клубы { #clubs }

| Вызов | Уровень | Что вернет |
|---|---|---|
| `astral.clubs()` | public | Список клубов семьи |
| `astral.club('#TAG')` | public | Клуб по тегу или `null` |
| `club.members` | public | Состав клуба |
| `club.stats('week')` | public | Статистика за период: `'today'`, `'24h'`, `'week'`, `'month'` |
| `club.history(24)` | family | События вступления и выхода за N часов (до 168) |
| `club.snapshot()` | family | Снимок состава |
| `chat.astral.club` | — | Первый клуб, привязанный к этому чату, или `null` |
| `chat.astral.clubs` | — | Все клубы, привязанные к чату |

### Свойства клуба { #club }

| Свойство | Что в нем |
|---|---|
| `tag`, `name`, `description`, `type` | Тег, название, описание, тип клуба |
| `trophies`, `requiredTrophies` | Кубки клуба и порог вступления |
| `membersCount` | Число участников |
| `globalRank`, `localRank` | Место в мировом и локальном рейтинге |
| `president` | Имя президента или `null` |
| `badgeId` | ID значка клуба |

Участник клуба (`club.members`): `tag`, `name`, `trophies`, `role`.

Статистика (`club.stats(…)`): `period`, `currentMembers`, `joins`, `leaves`, `trophiesChange`, `netChange`.

Событие истории (`club.history(…)`): `event` (`join` или `leave`), `playerTag`, `playerName`, `trophies`, `role`, `ts`.

## Игроки { #players }

| Вызов | Уровень | Что вернет |
|---|---|---|
| `astral.player('#TAG')` | public | Профиль игрока или `null` |
| `member.astral.playerTag` | public | Тег игрока, привязанного к участнику Telegram, или `null` |
| `member.astral.player` | public | Профиль привязанного игрока или `null` |

| Свойство игрока | Что в нем |
|---|---|
| `tag`, `name` | Тег и имя |
| `trophies`, `highestTrophies` | Кубки сейчас и рекорд |
| `expLevel` | Уровень опыта |
| `club` | Клуб: `club.tag`, `club.name`, или `null` |
| `victories.trio`, `victories.duo`, `victories.solo` | Победы 3×3, в дуо и соло |
| `brawlersCount` | Число бойцов |
| `ranked.current`, `ranked.seasonBest`, `ranked.allTimeBest` | Рейтинговый режим |
| `iconId` | ID иконки профиля |

`member.astral` работает только для участников этого чата.

## Рейтинги { #rankings }

| Вызов | Что вернет |
|---|---|
| `astral.rankings.clubs(страна, сколько?)` | Топ клубов, до 25 |
| `astral.rankings.players(страна, сколько?)` | Топ игроков, до 25 |

Страна — `'global'` или код страны: `'ru'`, `'kz'`, `'by'`. Запись рейтинга: `rank`, `tag`, `name`, `trophies`, `membersCount`, `club`.

## Черный список { #blacklist }

Только для чатов уровня <Badge type="tip" text="family" />.

| Вызов | Что вернет |
|---|---|
| `astral.blacklist.check('#TAG')` | Результат проверки: `blacklisted` (да/нет), `type` (`project` — проектный или `club` — клубный), `clubTag`, `reason` |
| `astral.blacklist.page(вид, страница)` | Страница списка до 25 записей. Вид: `'project'` или `'club'` |

Запись списка: `playerTag`, `playerName`, `type`, `clubTag`, `reason`, `createdAt`.

## Примеры { #examples }

### Проверка игрока по ЧС { #example-blacklist }

Команда `!чс ABCD1234`, работает в чате, привязанном к клубу:

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

<TgPreview user="!чс abcd1234" user-name="Анна">

✅ #ABCD1234 не найден в черном списке.

</TgPreview>

### Приветствие с профилем Brawl Stars { #example-welcome }

```template
{%- set p = member.astral.player -%}
# Привет, {{ member.name }}!
Ты {{ chat.memberCount | number_format }}-й участник **{{ chat.title }}**.

{% if p %}
{{ table([['Игрок', p.name], ['Кубки', p.trophies | number_format], ['Клуб', p.club.name ?: '—']], { bordered: true, compact: true }) }}
{% endif %}
{% do url_button('Правила', 'https://telegra.ph/pravila-chata') %}
```

<TgPreview :buttons="[['Правила|link']]">

# Привет, Анна!

Ты 1 248-й участник **Клуб Astral**.

| | |
|---|---|
| Игрок | Anna_BS |
| Кубки | 24 510 |
| Клуб | Astral Family |

</TgPreview>

### Топ клуба с листанием { #example-top }

```template
{% set club = chat.astral.club %}
{% require club returning 'Этот чат не привязан к клубу Astral' %}
{% set page = (parameters.get('page')) ?: 0 %}
{% if component.id == 'next' %}{% set page += 1 %}{% elseif component.id == 'prev' and page > 0 %}{% set page -= 1 %}{% endif %}
{% do parameters.store('page', page) %}
{% set members = club.members | sort_by('trophies', 'DESC') | slice(page * 10, 10) %}
**{{ club.name }}** · страница {{ page + 1 }}
{% for m in members %}
{{ page * 10 + loop.index }}. {{ m.name }} — {{ m.trophies | number_format }}
{% endfor %}
{% do button('SECONDARY', 'prev', null, '⬅️', 'self', page == 0) %}
{% do button('SECONDARY', 'next', null, '➡️', 'self', (members | length) < 10) %}
```

### Таблица лучших игроков клуба { #example-table }

```template
{% set club = chat.astral.club %}
{% require club returning 'Этот чат не привязан к клубу Astral' %}
## {{ club.name }}
{{ table_of(club.members | sort_by('trophies', 'DESC') | slice(0, 15), { name: 'Игрок', trophies: 'Кубки' }, { header: true, index: '#', striped: true }) }}
{{ footer('Обновлено ' ~ datetime(now(), 'r')) }}
```

## Ошибки { #errors }

| Ситуация | Что происходит |
|---|---|
| Функция уровня `family` в чате уровня `public` | Ошибка: «Доступно только в чатах, привязанных к клубу Astral» (`tier_forbidden`) |
| Клуб или игрок не найден | Возвращается `null` — проверяйте через `require` или `?:` |
| Сервис Astral или Brawl Stars недоступен | Ошибка «Данные Astral временно недоступны» (`astral_unavailable`) |
| Больше 5 обращений за выполнение | Ошибка `quota_astral` |
| Неверный тег, период или страна | Ошибка `bad_arguments` |

## Кэш и квота { #cache }

Бот ненадолго запоминает ответы, поэтому данные обновляются с задержкой:

| Данные | Обновляются раз в |
|---|---|
| Уровень чата, привязки, черный список, история клуба, игрок | 60 секунд |
| Клубы, состав, статистика, снимок, привязка игрока к Telegram | 5 минут |
| Рейтинги | 15 минут |

За одно выполнение — не больше 5 обращений к `astral`, включая ленивые свойства вроде `club.members`. Обращение считается, даже если ответ взят из кэша. Сохраняйте результат в переменную: `{% set club = chat.astral.club %}`.

::: info Приватность
Данные приходят очищенными: в них нет имен сотрудников Astral, внутренних идентификаторов и чужих привязок Telegram.
:::
