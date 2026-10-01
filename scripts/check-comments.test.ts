import { describe, expect, test } from 'bun:test'
import { commentsOf, hashComments, jsonComments, scriptComments, styleComments, vueComments } from './check-comments.ts'

describe('scriptComments', () => {
  test('finds line, block and trailing comments', () => {
    const source = ['const a = 1', '// line', 'const b = 2 // trailing', '/* block */', 'const c = 3'].join('\n')
    expect(scriptComments(source)).toEqual([2, 3, 4])
  })

  test('ignores slashes inside strings, urls, regular expressions and templates', () => {
    const source = [
      "const url = 'https://example.com//path'",
      'const pattern = /a\\/\\/b/',
      'const text = `// not a comment ${1}`',
      "const glob = '/* not a comment */'",
    ].join('\n')
    expect(scriptComments(source)).toEqual([])
  })

  test('finds a comment at the end of the file', () => {
    expect(scriptComments('const a = 1\n// tail\n')).toEqual([2])
  })
})

describe('styleComments', () => {
  test('finds comments but not selectors or quoted text', () => {
    const source = ['/* title */', '*, *::before { margin: 0 }', '.a::after { content: "/* x */" }', '.b { color: red } /* tail */'].join('\n')
    expect(styleComments(source)).toEqual([1, 4])
  })
})

describe('vueComments', () => {
  test('finds comments in the template, script and style blocks with correct line numbers', () => {
    const source = [
      '<script setup lang="ts">',
      'const a = 1 // note',
      '</script>',
      '',
      '<template>',
      '  <!-- hint -->',
      '  <p>text</p>',
      '</template>',
      '',
      '<style scoped>',
      '/* style note */',
      'p { color: red }',
      '</style>',
    ].join('\n')
    expect(vueComments(source)).toEqual([2, 6, 11])
  })

  test('accepts a clean component', () => {
    expect(vueComments('<script setup lang="ts">\nconst a = 1\n</script>\n<template><p>a</p></template>\n')).toEqual([])
  })
})

describe('hashComments and jsonComments', () => {
  test('find full line comments only', () => {
    expect(hashComments('key: value\n# note\n  # indented\nurl: https://a.b/#anchor\n')).toEqual([2, 3])
    expect(jsonComments('{\n  // note\n  "a": "https://x.y"\n}\n')).toEqual([2])
  })
})

describe('commentsOf', () => {
  test('chooses the checker by file name', () => {
    expect(commentsOf('a.ts', '// x')).toEqual([1])
    expect(commentsOf('docs/a.css', '/* x */')).toEqual([1])
    expect(commentsOf('.github/ci.yml', '# x')).toEqual([1])
    expect(commentsOf('.gitignore', '# x')).toEqual([1])
    expect(commentsOf('page.md', '<!-- x -->')).toEqual([])
  })
})
