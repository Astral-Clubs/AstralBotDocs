import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DOCS_ROOT = 'docs'
const NAVIGATION_FILES = ['docs/.vitepress/sidebar.ts', 'docs/.vitepress/config.mts']
const IGNORED_DIRECTORIES = new Set(['.vitepress', 'public', 'node_modules'])
const FILE_NAME = /^[a-z0-9-]+\.md$/
const ANCHOR = /^[a-z0-9-]+$/
const H2_WITH_ANCHOR = /^##\s+.+?\s+\{\s*#([^\s}]+)\s*\}\s*$/
const DESCRIPTION_MIN = 30
const DESCRIPTION_MAX = 320
const PLACEHOLDER_WORDS = /\b(TODO|FIXME|XXX)\b|заглушк/i

export type Page = Readonly<{ file: string; route: string; source: string }>

export function routeOf(file: string, root = DOCS_ROOT): string {
  const withoutRoot = relative(root, file).split(sep).join('/').replace(/\.md$/, '')
  const route = withoutRoot.replace(/(^|\/)index$/, '$1')
  return `/${route}`
}

export function listPages(root = DOCS_ROOT): Page[] {
  const pages: Page[] = []
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          walk(join(directory, entry.name))
        }
        continue
      }
      if (entry.name.endsWith('.md')) {
        const file = join(directory, entry.name)
        pages.push({ file, route: routeOf(file, root), source: readFileSync(file, 'utf8') })
      }
    }
  }
  walk(root)
  return pages.sort((left, right) => left.route.localeCompare(right.route))
}

export function parseFrontmatter(source: string): Record<string, string> | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (match === null) {
    return null
  }
  const fields: Record<string, string> = {}
  for (const line of (match[1] ?? '').split(/\r?\n/)) {
    const field = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
    if (field !== null) {
      fields[field[1] ?? ''] = (field[2] ?? '').trim().replace(/^["']|["']$/g, '')
    }
  }
  return fields
}

export function stripFrontmatter(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function proseOf(source: string): string {
  const lines = stripFrontmatter(source).split(/\r?\n/)
  const kept: string[] = []
  let fence: string | null = null
  let previewDepth = 0
  for (const line of lines) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line)
    if (fenceMatch !== null) {
      const marker = fenceMatch[1] ?? ''
      if (fence === null) {
        fence = marker
      } else if (marker.startsWith(fence[0] ?? '') && marker.length >= fence.length) {
        fence = null
      }
      continue
    }
    if (fence !== null) {
      continue
    }
    previewDepth += (line.match(/<TgPreview\b/g) ?? []).length
    const insidePreview = previewDepth > 0
    previewDepth -= (line.match(/<\/TgPreview>/g) ?? []).length
    if (!insidePreview) {
      kept.push(line)
    }
  }
  return kept.join('\n')
}

export function collectLinks(source: string): string[] {
  return [...source.matchAll(/link:\s*'(\/[^']*)'/g)].map((match) => match[1] ?? '')
}

export function checkPage(page: Page): string[] {
  const problems: string[] = []
  const fail = (message: string): void => {
    problems.push(`${page.file}: ${message}`)
  }

  const fileName = page.file.split(/[\\/]/).pop() ?? ''
  if (!FILE_NAME.test(fileName)) {
    fail('имя файла должно состоять из латинских строчных букв, цифр и дефисов')
  }

  const frontmatter = parseFrontmatter(page.source)
  const description = frontmatter?.['description'] ?? ''
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    fail(`нужен description во frontmatter длиной ${DESCRIPTION_MIN}–${DESCRIPTION_MAX} символов (сейчас ${description.length})`)
  }

  const prose = proseOf(page.source)
  const isHome = frontmatter?.['layout'] === 'home'
  if (!isHome) {
    const headings = prose.split('\n').filter((line) => /^#\s+\S/.test(line))
    if (headings.length !== 1) {
      fail(`на странице должен быть ровно один заголовок «# », найдено ${headings.length}`)
    }
  }

  const anchors = new Set<string>()
  for (const line of prose.split('\n')) {
    if (!/^##\s/.test(line) || /^###/.test(line)) {
      continue
    }
    const match = H2_WITH_ANCHOR.exec(line)
    const anchor = match?.[1]
    if (anchor === undefined || !ANCHOR.test(anchor)) {
      fail(`у заголовка «${line.trim()}» нет латинского якоря вида { #anchor }`)
      continue
    }
    if (anchors.has(anchor)) {
      fail(`якорь #${anchor} повторяется`)
    }
    anchors.add(anchor)
  }

  if (/\]\((?!https?:)[^)#\s]*\.md(#[^)]*)?\)/.test(prose)) {
    fail('внутренние ссылки пишутся без расширения .md')
  }

  if (PLACEHOLDER_WORDS.test(prose)) {
    fail('в тексте остались пометки вроде TODO или заглушек')
  }

  const opened = (page.source.match(/<TgPreview\b/g) ?? []).length
  const closed = (page.source.match(/<\/TgPreview>/g) ?? []).length
  if (opened !== closed) {
    fail(`теги <TgPreview> не парные: открывающих ${opened}, закрывающих ${closed}`)
  }

  return problems
}

export function checkNavigation(pages: readonly Page[], links: readonly string[]): string[] {
  const problems: string[] = []
  const routes = new Set(pages.map((page) => page.route))
  const linked = new Set(links)
  for (const link of linked) {
    if (!routes.has(link)) {
      problems.push(`меню или шапка ссылается на несуществующую страницу ${link}`)
    }
  }
  for (const page of pages) {
    if (!linked.has(page.route) && page.route !== '/') {
      problems.push(`${page.file}: страницы нет в меню (docs/.vitepress/sidebar.ts) и в шапке`)
    }
  }
  return problems
}

export function run(): string[] {
  const pages = listPages()
  const links = NAVIGATION_FILES.flatMap((file) => collectLinks(readFileSync(file, 'utf8')))
  return [...pages.flatMap((page) => checkPage(page)), ...checkNavigation(pages, links)]
}

if (import.meta.main) {
  const problems = run()
  if (problems.length > 0) {
    console.error(problems.map((problem) => `✖ ${problem}`).join('\n'))
    console.error(`\nПроблем: ${problems.length}`)
    process.exit(1)
  }
  console.log(`Страницы в порядке: ${listPages().length}`)
}
