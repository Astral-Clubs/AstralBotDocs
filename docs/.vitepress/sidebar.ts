import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Введение',
    items: [
      { text: 'Шаблоны сообщений', link: '/templates/' },
      { text: 'Редактор шаблона', link: '/templates/editor' },
      { text: 'Где используются шаблоны', link: '/templates/places' }
    ]
  },
  {
    text: 'Новичкам',
    items: [
      { text: 'Первые шаги', link: '/templates/beginners/' },
      { text: 'Простые переменные', link: '/templates/beginners/variables' },
      { text: 'Оформление текста', link: '/templates/beginners/formatting' },
      { text: 'Условия «если… то…»', link: '/templates/beginners/conditions' },
      { text: 'Кнопки под сообщением', link: '/templates/beginners/buttons' },
      { text: 'Частые ошибки', link: '/templates/beginners/mistakes' }
    ]
  },
  {
    text: 'Пользовательские команды',
    items: [
      { text: 'Что это такое', link: '/commands/' },
      { text: 'Первая команда за 5 минут', link: '/commands/first-command' },
      { text: 'Настройки команды', link: '/commands/settings' },
      {
        text: 'Действия',
        link: '/commands/actions/',
        collapsed: false,
        items: [
          { text: 'Отправка сообщения', link: '/commands/actions/message' },
          { text: 'Форма', link: '/commands/actions/form' },
          { text: 'Изменение ролей', link: '/commands/actions/change-roles' },
          { text: 'Встроенная команда', link: '/commands/actions/internal' },
          { text: 'Выполнение кода', link: '/commands/actions/code' }
        ]
      },
      { text: 'Аргументы команды', link: '/commands/arguments' },
      { text: 'Кнопки и меню выбора', link: '/commands/components' },
      { text: 'Цепочки действий', link: '/commands/run' },
      { text: 'Тест и диагностика', link: '/commands/testing' }
    ]
  },
  {
    text: 'Автоматизация',
    items: [
      { text: 'Что это такое', link: '/automation/' },
      { text: 'События, условия и действия', link: '/automation/reference' },
      { text: 'Переменная event', link: '/automation/event' },
      { text: 'События клуба', link: '/automation/clubs' }
    ]
  },
  {
    text: 'Продвинутым',
    items: [
      { text: 'Расширенное руководство', link: '/templates/advanced/' },
      { text: 'Островки кода', link: '/templates/advanced/syntax' },
      { text: 'Выражения и операторы', link: '/templates/advanced/expressions' },
      { text: 'Типы и конвертация', link: '/templates/advanced/types' },
      { text: 'Теги', link: '/templates/advanced/tags' },
      { text: 'Функции', link: '/templates/advanced/functions' },
      { text: 'Rich-сообщения и разметка', link: '/templates/advanced/rich' },
      { text: 'Квоты и ограничения', link: '/templates/advanced/limits' },
      { text: 'Ошибки', link: '/templates/advanced/errors' }
    ]
  },
  {
    text: 'Хранение данных',
    items: [
      { text: 'Атрибуты', link: '/templates/storage/attributes' },
      { text: 'Индексы чата', link: '/templates/storage/indexes' },
      { text: 'Параметры', link: '/templates/storage/parameters' },
      { text: 'Общие шаблоны', link: '/templates/shared' }
    ]
  },
  {
    text: 'Данные Astral',
    items: [{ text: 'Пространство astral', link: '/templates/astral' }]
  },
  {
    text: 'Прочее',
    items: [
      { text: 'Полезные примеры', link: '/templates/examples' },
      { text: 'Словарик', link: '/glossary' }
    ]
  },
  {
    text: 'Справочник типов',
    collapsed: true,
    items: [
      { text: 'Chat', link: '/reference/chat' },
      { text: 'Member', link: '/reference/member' },
      { text: 'Rank', link: '/reference/rank' },
      { text: 'BotRole', link: '/reference/bot-role' },
      { text: 'Topic', link: '/reference/topic' },
      { text: 'Message', link: '/reference/message' },
      { text: 'Attachment', link: '/reference/attachment' },
      { text: 'Arguments', link: '/reference/arguments' },
      { text: 'Parameters', link: '/reference/parameters' },
      { text: 'Component', link: '/reference/component' },
      { text: 'Form', link: '/reference/form' },
      { text: 'Event', link: '/reference/event' },
      { text: 'DateTime', link: '/reference/datetime' },
      { text: 'List, Map, Range', link: '/reference/collections' },
      { text: 'MemberAttribute', link: '/reference/member-attribute' },
      { text: 'ChatIndex и Page', link: '/reference/chat-index' },
      { text: 'MessageBuilder', link: '/reference/message-builder' },
      { text: 'MenuBuilder', link: '/reference/menu-builder' }
    ]
  }
]
