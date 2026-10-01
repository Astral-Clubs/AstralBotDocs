import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import ts from 'typescript'

const IGNORED_DIRECTORIES = new Set(['node_modules', '.git', 'dist', 'cache', '.wrangler', '.idea', '.claude', '.vscode'])
const SCRIPT_EXTENSIONS = new Set(['.ts', '.mts'])
const STYLE_EXTENSIONS = new Set(['.css'])
const JSON_EXTENSIONS = new Set(['.json', '.jsonc'])
const HASH_EXTENSIONS = new Set(['.yml', '.yaml'])
const HASH_NAMES = new Set(['.gitignore', '.gitattributes', '.editorconfig', 'CODEOWNERS', '_headers'])

export function lineOf(source: string, index: number): number {
  let line = 1
  for (let position = 0; position < index; position += 1) {
    if (source[position] === '\n') {
      line += 1
    }
  }
  return line
}

export function scriptComments(source: string, fileName = 'file.ts'): number[] {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
  const lines = new Set<number>()
  const collect = (ranges: readonly ts.CommentRange[] | undefined): void => {
    for (const range of ranges ?? []) {
      lines.add(sourceFile.getLineAndCharacterOfPosition(range.pos).line + 1)
    }
  }
  const visit = (node: ts.Node): void => {
    if (node.getStart(sourceFile) > node.getFullStart()) {
      collect(ts.getLeadingCommentRanges(source, node.getFullStart()))
      collect(ts.getTrailingCommentRanges(source, node.getFullStart()))
    }
    for (const child of node.getChildren(sourceFile)) {
      visit(child)
    }
  }
  visit(sourceFile)
  collect(ts.getLeadingCommentRanges(source, sourceFile.endOfFileToken.getFullStart()))
  return [...lines].sort((left, right) => left - right)
}

export function styleComments(source: string): number[] {
  const lines = new Set<number>()
  let quote: string | null = null
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (quote !== null) {
      if (char === '\\') {
        index += 1
      } else if (char === quote) {
        quote = null
      }
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
    } else if (char === '/' && source[index + 1] === '*') {
      lines.add(lineOf(source, index))
    }
  }
  return [...lines].sort((left, right) => left - right)
}

export function vueComments(source: string): number[] {
  const lines = new Set<number>()
  const blockPattern = /<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/g
  let template = source
  for (const match of source.matchAll(blockPattern)) {
    const body = match[2] ?? ''
    const bodyStart = (match.index ?? 0) + match[0].indexOf(body)
    const offset = lineOf(source, bodyStart) - 1
    const found = match[1] === 'script' ? scriptComments(body) : styleComments(body)
    for (const line of found) {
      lines.add(line + offset)
    }
    template = template.replace(match[0], match[0].replace(/[^\n]/g, ' '))
  }
  for (const match of template.matchAll(/<!--/g)) {
    lines.add(lineOf(source, match.index ?? 0))
  }
  return [...lines].sort((left, right) => left - right)
}

export function hashComments(source: string): number[] {
  return source
    .split('\n')
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => line.trimStart().startsWith('#'))
    .map(({ number }) => number)
}

export function jsonComments(source: string): number[] {
  return source
    .split('\n')
    .map((line, index) => ({ line: line.trimStart(), number: index + 1 }))
    .filter(({ line }) => line.startsWith('//') || line.startsWith('/*'))
    .map(({ number }) => number)
}

export function commentsOf(fileName: string, source: string): number[] {
  const name = fileName.split(/[\\/]/).pop() ?? ''
  const extension = name.includes('.') ? name.slice(name.lastIndexOf('.')) : ''
  if (SCRIPT_EXTENSIONS.has(extension)) {
    return scriptComments(source, fileName)
  }
  if (STYLE_EXTENSIONS.has(extension)) {
    return styleComments(source)
  }
  if (extension === '.vue') {
    return vueComments(source)
  }
  if (JSON_EXTENSIONS.has(extension)) {
    return jsonComments(source)
  }
  if (HASH_EXTENSIONS.has(extension) || HASH_NAMES.has(name)) {
    return hashComments(source)
  }
  return []
}

export function listCodeFiles(root = '.'): string[] {
  const files: string[] = []
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) {
          walk(join(directory, entry.name))
        }
        continue
      }
      const extension = entry.name.includes('.') ? entry.name.slice(entry.name.lastIndexOf('.')) : ''
      const known =
        SCRIPT_EXTENSIONS.has(extension) ||
        STYLE_EXTENSIONS.has(extension) ||
        JSON_EXTENSIONS.has(extension) ||
        HASH_EXTENSIONS.has(extension) ||
        extension === '.vue' ||
        HASH_NAMES.has(entry.name)
      if (known) {
        files.push(relative(root, join(directory, entry.name)).split(sep).join('/'))
      }
    }
  }
  walk(root)
  return files.sort()
}

if (import.meta.main) {
  const files = listCodeFiles()
  let violations = 0
  for (const file of files) {
    for (const line of commentsOf(file, readFileSync(file, 'utf8'))) {
      violations += 1
      console.error(`${file}:${line}: комментарии в коде запрещены`)
    }
  }
  if (violations > 0) {
    console.error(`\nКомментариев: ${violations}`)
    process.exit(1)
  }
  console.log(`Комментариев в коде нет (файлов: ${files.length})`)
}
