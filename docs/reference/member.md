---
description: Тип Member — участник Telegram-чата в шаблонах Astral Moderation. Свойства, роли, права, атрибуты и данные Astral.
---

# Member

<p class="lead">Участник чата. Встречается как <code>member</code> (о ком речь), <code>bot</code> (сам бот), <code>arguments.targetMember</code> (к кому обращена команда), <code>chat.owner</code> и в других местах.</p>

При выводе `{{ member }}` печатается упоминание — имя-ссылка на профиль.

## Свойства { #properties }

| Свойство | Тип | Описание |
|---|---|---|
| `id` | Число | ID пользователя в Telegram |
| `mention` | Строка | Упоминание |
| `name` | Строка | Имя и фамилия |
| `firstName`, `lastName` | Строка | Имя и фамилия по отдельности <Badge type="tip" text="новое" /> |
| `username` | Строка | Username без `@` <Badge type="tip" text="новое" /> |
| `displayName` | Строка | Должность администратора в чате, а если ее нет — имя. Псевдоним — `nickname` |
| `tag` | Строка | `@username`, а если его нет — имя |
| `chatTag` | Строка | Тег участника в Telegram — подпись рядом с именем, или `null` <Badge type="tip" text="новое" /> |
| `bot` | Логический | Это бот |
| `isPremium` | Логический | Есть Telegram Premium <Badge type="tip" text="новое" /> |
| `language` | Строка | Язык Telegram участника <Badge type="tip" text="новое" /> |
| `status` | Строка | Статус в чате: `creator`, `administrator`, `member`, `restricted`, `left`, `kicked`. Псевдоним — `chatStatus` |
| `isOwner` | Логический | Создатель чата <Badge type="tip" text="новое" /> |
| `isAdmin` | Логический | Администратор чата <Badge type="tip" text="новое" /> |
| `moderator` | Логический | Может модерировать: администратор с правом ограничивать участников или роль бота «модератор» |
| `joinedAt` | [DateTime](./datetime) | Когда вступил в чат |
| `avatarUrl` | Строка | Ссылка на аватар |
| `rank` | [Rank](./rank) | Уровень и опыт |
| `roles` | Список [BotRole](./bot-role) | Роли бота |
| `warnCount` | Число | Активные предупреждения <Badge type="tip" text="новое" /> |
| `attributes` | Атрибуты | Доступ к атрибутам по ключу: `member.attributes.coins` |
| `astral.playerTag` | Строка | Тег привязанного игрока Brawl Stars или `null` |
| `astral.player` | Игрок Astral | Профиль привязанного игрока или `null` — см. [astral](/templates/astral#players) |
| `chat` | [Chat](./chat) | Чат участника |
| `createdAt`, `bannerUrl`, `accentColor`, `activities`, `voiceState`, `flags`, `bio` | — | Всегда пусто: в Telegram этих данных нет |

## Методы { #methods }

### Роли { #roles }

| Метод | Описание |
|---|---|
| `hasRole(роль)` | Есть ли роль бота. Роль — ID или объект |
| `hasRoles([роли])` | Есть ли все роли из списка |
| `hasAnyRole([роли])` | Есть ли хотя бы одна роль из списка |
| `addRole(роль)`, `addRoles([роли])` | Выдать роли |
| `removeRole(роль)`, `removeRoles([роли])` | Снять роли |
| `modifyRoles([выдать], [снять])` | Выдать и снять одним вызовом |
| `addTempRole(роль, срок)`, `addTempRoles([роли], срок)` | Выдать на время. Срок — миллисекунды или [DateTime](./datetime), не меньше 15 секунд |

Изменений ролей — не больше 10 за выполнение.

### Права { #permissions }

| Метод | Описание |
|---|---|
| `hasPermission(право)` | Есть ли у администратора право Telegram: `can_delete_messages`, `can_restrict_members`, `can_pin_messages` и другие |
| `hasPermissions([права])` | Есть ли все права из списка |

### Атрибуты { #attributes }

| Метод | Описание |
|---|---|
| `getAttribute(ключ)` | [MemberAttribute](./member-attribute) — значение, которое бот хранит для участника |

### Недоступно { #unsupported }

`modifyNickname(имя)` — в Telegram нельзя менять ники, редактор покажет ошибку `unsupported_in_telegram`.

## Пример { #example }

```template
{% if member.isAdmin %}🛡{% elseif member.hasRole('r_vip') %}⭐{% endif %} {{ member }}
Уровень {{ member.rank.level }}, предупреждений: {{ member.warnCount }}
```
