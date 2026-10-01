import { describe, expect, test } from 'bun:test'
import { checkNavigation, checkPage, collectLinks, parseFrontmatter, proseOf, routeOf, type Page } from './check-docs.ts'

const DESCRIPTION = 'Подробное описание страницы для поиска, превью ссылок и файла llms.txt.'

function page(source: string, file = 'docs/templates/example.md'): Page {
  return { file, route: routeOf(file), source }
}

const VALID = `---\ndescription: ${DESCRIPTION}\n---\n\n# Заголовок\n\n## Раздел { #section }\n\nТекст.\n`

describe('routeOf', () => {
  test('maps files to clean urls', () => {
    expect(routeOf('docs/glossary.md')).toBe('/glossary')
    expect(routeOf('docs/templates/index.md')).toBe('/templates/')
    expect(routeOf('docs/index.md')).toBe('/')
  })
})

describe('parseFrontmatter', () => {
  test('reads simple fields and reports a missing block', () => {
    expect(parseFrontmatter(VALID)?.['description']).toBe(DESCRIPTION)
    expect(parseFrontmatter('# Без frontmatter')).toBeNull()
  })
})

describe('proseOf', () => {
  test('drops code blocks and telegram previews', () => {
    const source = `# Заголовок\n\n\`\`\`template\n# в коде\n\`\`\`\n\n<TgPreview>\n\n# в превью\n\n</TgPreview>\n\nТекст\n`
    const prose = proseOf(source)
    expect(prose).toContain('# Заголовок')
    expect(prose).not.toContain('в коде')
    expect(prose).not.toContain('в превью')
    expect(prose).toContain('Текст')
  })
})

describe('collectLinks', () => {
  test('finds navigation links', () => {
    expect(collectLinks("{ text: 'A', link: '/a/' }, { text: 'B', link: '/b' }, link: 'https://x.y'")).toEqual(['/a/', '/b'])
  })
})

describe('checkPage', () => {
  test('accepts a well formed page', () => {
    expect(checkPage(page(VALID))).toEqual([])
  })

  test('requires a description of reasonable length', () => {
    expect(checkPage(page('---\ntitle: x\n---\n\n# Заголовок\n'))).toHaveLength(1)
  })

  test('requires exactly one top level heading outside code', () => {
    const twice = VALID.replace('# Заголовок', '# Заголовок\n\n# Еще один')
    expect(checkPage(page(twice)).join()).toContain('ровно один заголовок')
  })

  test('requires latin anchors on second level headings and rejects duplicates', () => {
    const withoutAnchor = VALID.replace(' { #section }', '')
    expect(checkPage(page(withoutAnchor)).join()).toContain('нет латинского якоря')
    const duplicated = `${VALID}\n## Другой { #section }\n`
    expect(checkPage(page(duplicated)).join()).toContain('повторяется')
  })

  test('rejects internal links that end with the md extension', () => {
    expect(checkPage(page(`${VALID}\n[далее](./other.md)\n`)).join()).toContain('без расширения')
    expect(checkPage(page(`${VALID}\n[сайт](https://example.com/file.md)\n`))).toEqual([])
  })

  test('rejects leftover markers and unbalanced previews', () => {
    expect(checkPage(page(`${VALID}\nTODO дописать\n`)).join()).toContain('TODO')
    expect(checkPage(page(`${VALID}\n<TgPreview>\n\nтекст\n`)).join()).toContain('не парные')
  })

  test('rejects file names with capitals or underscores', () => {
    expect(checkPage(page(VALID, 'docs/templates/My_Page.md')).join()).toContain('имя файла')
  })
})

describe('checkNavigation', () => {
  const pages = [page(VALID, 'docs/a.md'), page(VALID, 'docs/b.md')]

  test('accepts pages that are all linked', () => {
    expect(checkNavigation(pages, ['/a', '/b'])).toEqual([])
  })

  test('reports orphan pages and dead links', () => {
    const problems = checkNavigation(pages, ['/a', '/missing']).join('\n')
    expect(problems).toContain('docs/b.md')
    expect(problems).toContain('/missing')
  })
})
