import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import type { Plugin } from 'vite'
import type { LanguageRegistration, ThemeRegistration } from 'shiki'
import llmstxt from 'vitepress-plugin-llms'
import templateGrammar from './shiki/template.tmLanguage.json'
import astralDark from './shiki/astral-dark.json'
import { sidebar } from './sidebar'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function markdownSourceInDev(): Plugin {
  return {
    name: 'astral:markdown-source-in-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname, query] = (req.url ?? '').split('?')
        if (query !== undefined || !pathname.endsWith('.md')) return next()
        const url = decodeURIComponent(pathname)
        const page = url.slice(1, -'.md'.length)
        const candidates = [path.join(docsRoot, `${page}.md`), path.join(docsRoot, page, 'index.md')]
        const file = candidates.find((candidate) => candidate.startsWith(docsRoot) && fs.existsSync(candidate))
        if (!file) return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(fs.readFileSync(file, 'utf8'))
      })
    }
  }
}

const title = 'Astral Moderation'
const description =
  'Документация Astral Moderation: шаблоны сообщений, пользовательские команды и шаблонный движок Telegram-бота'
const siteUrl = 'https://docs.astralbs.xyz'
const repositoryUrl = 'https://github.com/Astral-Clubs/AstralBotDocs'

function canonicalPath(relativePath: string): string {
  const withoutExtension = relativePath.replace(/\.md$/, '')
  return withoutExtension.replace(/(^|\/)index$/, '$1')
}

export default defineConfig({
  lang: 'ru-RU',
  title,
  titleTemplate: `:title — ${title}`,
  description,
  appearance: 'force-dark',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: siteUrl },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#181920' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: title }],
    ['meta', { property: 'og:locale', content: 'ru_RU' }],
    ['meta', { property: 'og:title', content: `${title} — документация` }],
    ['meta', { property: 'og:description', content: description }]
  ],

  transformPageData(pageData) {
    const url = `${siteUrl}/${canonicalPath(pageData.relativePath)}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }]
    )
  },

  markdown: {
    theme: astralDark as unknown as ThemeRegistration,
    languages: [templateGrammar as unknown as LanguageRegistration],
    container: {
      tipLabel: 'Совет',
      infoLabel: 'Информация',
      warningLabel: 'Внимание',
      dangerLabel: 'Осторожно',
      detailsLabel: 'Подробнее'
    },
    config(md) {
      const renderInlineCode = md.renderer.rules.code_inline!
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        tokens[idx].attrSet('v-pre', '')
        return renderInlineCode(tokens, idx, options, env, self)
      }
      md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n'
      md.renderer.rules.table_close = () => '</table></div>\n'
      md.core.ruler.push('astral_preview_headings', (state) => {
        let depth = 0
        state.tokens.forEach((token, index) => {
          if (token.type === 'html_block') {
            depth += (token.content.match(/<TgPreview\b/g) ?? []).length
            depth -= (token.content.match(/<\/TgPreview>/g) ?? []).length
          }
          if (depth <= 0 || token.type !== 'heading_open') return
          token.attrs = (token.attrs ?? []).filter(([name]) => name !== 'id' && name !== 'tabindex')
          token.attrJoin('class', 'ignore-header')
          const children = state.tokens[index + 1]?.children
          if (!children) return
          const start = children.findIndex(
            (child) => child.type === 'link_open' && (child.attrGet('class') ?? '').includes('header-anchor')
          )
          if (start === -1) return
          const end = children.findIndex((child, i) => i > start && child.type === 'link_close')
          children.splice(start, end - start + 1)
        })
      })
    }
  },

  vite: {
    plugins: [
      llmstxt({
        title,
        description:
          'Шаблоны сообщений и пользовательские команды Telegram-бота Astral Moderation.',
        stripHTML: false
      }),
      markdownSourceInDev()
    ]
  },

  themeConfig: {
    logo: { src: '/logo.svg', alt: '' },
    siteTitle: title,

    socialLinks: [{ icon: 'github', link: repositoryUrl, ariaLabel: 'Репозиторий документации на GitHub' }],
    editLink: {
      pattern: `${repositoryUrl}/edit/main/docs/:path`,
      text: 'Предложить правку этой страницы'
    },

    nav: [
      { text: 'Шаблоны', link: '/templates/', activeMatch: '^/templates/(?!examples)' },
      { text: 'Команды', link: '/commands/', activeMatch: '^/commands/' },
      {
        text: 'Справочник',
        activeMatch: '^/reference/',
        items: [
          {
            text: 'Язык шаблонов',
            items: [
              { text: 'Теги', link: '/templates/advanced/tags' },
              { text: 'Функции', link: '/templates/advanced/functions' },
              { text: 'Выражения и операторы', link: '/templates/advanced/expressions' },
              { text: 'Rich-сообщения', link: '/templates/advanced/rich' }
            ]
          },
          {
            text: 'Данные',
            items: [
              { text: 'Типы: Member, Chat…', link: '/reference/member' },
              { text: 'Пространство astral', link: '/templates/astral' },
              { text: 'Квоты и ограничения', link: '/templates/advanced/limits' },
              { text: 'Ошибки', link: '/templates/advanced/errors' }
            ]
          }
        ]
      },
      { text: 'Примеры', link: '/templates/examples' }
    ],

    sidebar,

    outline: { level: [2, 3], label: 'На этой странице' },
    docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
    lastUpdated: {
      text: 'Обновлено',
      formatOptions: { dateStyle: 'long' }
    },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    skipToContentLabel: 'Перейти к содержанию',
    externalLinkIcon: true,

    notFound: {
      title: 'Страница не найдена',
      quote: 'Возможно, ее переименовали или она еще не написана. Попробуйте поиск — он в шапке.',
      linkLabel: 'На главную',
      linkText: 'На главную'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск по документации' },
          modal: {
            displayDetails: 'Показать подробности',
            resetButtonTitle: 'Очистить',
            backButtonTitle: 'Закрыть поиск',
            noResultsText: 'Ничего не найдено по запросу',
            footer: {
              selectText: 'открыть',
              selectKeyAriaLabel: 'Enter',
              navigateText: 'выбор',
              navigateUpKeyAriaLabel: 'стрелка вверх',
              navigateDownKeyAriaLabel: 'стрелка вниз',
              closeText: 'закрыть',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },

    footer: {
      message: 'Astral Moderation — Telegram-бот для модерации с шаблонами и пользовательскими командами',
    }
  }
})
