---
description: Расширенное руководство по шаблонному движку Astral Moderation — синтаксис, выражения, типы, теги, функции, разметка, квоты и ошибки.
---

# Расширенное руководство

<p class="lead">Здесь язык шаблонов описан целиком: как устроены выражения, какие есть теги и функции, как движок приводит типы и какие у него ограничения. Раздел пригодится, когда простых переменных и условий уже мало.</p>

::: tip Сначала — основы
Если вы только начинаете, пройдите раздел [Новичкам](../beginners/). Там те же вещи объяснены проще и медленнее.
:::

## Как движок выполняет шаблон { #pipeline }

1. **Проверка.** При сохранении движок разбирает шаблон и сообщает об ошибках со строкой и столбцом. Разобранный шаблон бот держит готовым, чтобы не разбирать его при каждом вызове.
2. **Выполнение.** Когда нужно отправить сообщение, движок идет по шаблону сверху вниз: текст копирует как есть, выражения в `{{ }}` вычисляет и подставляет, теги в `{% %}` выполняет.
3. **Разметка.** Получается строка в Markdown или HTML. Значения из данных при подстановке экранируются, чтобы символы разметки из имени участника не сломали сообщение.
4. **Отправка.** В режиме Rich Telegram сам разбирает разметку. В режиме Text бот переводит ее в классический формат и упрощает блоки.

Движок выполняет шаблоны в изолированной «песочнице»: шаблон видит только данные своего чата, не может обратиться к интернету (кроме [данных Astral](../astral)) и ограничен [квотами](./limits), чтобы один шаблон не мог замедлить бота.

## Разделы { #sections }

<div class="cards">
  <a class="card" href="/templates/advanced/syntax">
    <span class="card-title">Островки кода</span>
    <span class="card-text">Вывод, теги, комментарии, контроль пробелов, литералы.</span>
  </a>
  <a class="card" href="/templates/advanced/expressions">
    <span class="card-title">Выражения и операторы</span>
    <span class="card-text">Арифметика, сравнения, логика, Элвис, тернарный оператор, тесты, приоритеты.</span>
  </a>
  <a class="card" href="/templates/advanced/types">
    <span class="card-title">Типы и конвертация</span>
    <span class="card-text">Строки, числа, списки, карты, даты, Undefined и строгий режим.</span>
  </a>
  <a class="card" href="/templates/advanced/tags">
    <span class="card-title">Теги</span>
    <span class="card-text"><code>set</code>, <code>if</code>, <code>for</code>, <code>macro</code>, <code>include</code>, <code>run</code> и другие.</span>
  </a>
  <a class="card" href="/templates/advanced/functions">
    <span class="card-title">Функции</span>
    <span class="card-text">Строки, числа, списки, даты, кнопки, разметка и медиа.</span>
  </a>
  <a class="card" href="/templates/advanced/rich">
    <span class="card-title">Rich-сообщения</span>
    <span class="card-text">Весь каталог разметки Telegram, режимы Rich и Text, экранирование.</span>
  </a>
  <a class="card" href="/templates/advanced/limits">
    <span class="card-title">Квоты и ограничения</span>
    <span class="card-text">Сколько шагов, циклов, обращений к хранилищам и отправок можно сделать.</span>
  </a>
  <a class="card" href="/templates/advanced/errors">
    <span class="card-title">Ошибки</span>
    <span class="card-text">Все коды ошибок и предупреждений и что с ними делать.</span>
  </a>
</div>
