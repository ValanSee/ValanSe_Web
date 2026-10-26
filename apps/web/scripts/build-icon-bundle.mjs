#!/usr/bin/env node
/**
 * src 에서 쓰는 Iconify 아이콘만 모아 src/constants/iconBundle.json 으로 저장한다.
 * 앱은 이 데이터를 시작 시 등록(addCollection)해 런타임에 api.iconify.design 을 부르지 않는다.
 *
 * 새 아이콘을 쓰면: pnpm icons:bundle
 */
/* global URL, fetch, console */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'src')
const OUT = join(SRC, 'constants', 'iconBundle.json')
// 'prefix:name' 형태의 문자열 리터럴 (따옴표 · 백틱)
const ICON_PATTERN =
  /['"`]([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)['"`]/g
// 아이콘이 아닌 'a:b' 문자열이 섞이지 않도록 Iconify 컬렉션만 허용
const KNOWN_PREFIX =
  /^(tabler|icon-park-solid|icon-park-outline|material-symbols|line-md|weui|mingcute|wpf|ri|noto|jam|ic|heroicons|mdi|lucide|ph|solar|fluent|bi|carbon)$/

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, files)
    else if (/\.(tsx?|jsx?)$/.test(name) && !/\.stories\./.test(name))
      files.push(path)
  }
  return files
}

const byPrefix = new Map()
for (const file of walk(SRC)) {
  for (const [, prefix, name] of readFileSync(file, 'utf8').matchAll(
    ICON_PATTERN,
  )) {
    if (!KNOWN_PREFIX.test(prefix)) continue
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, new Set())
    byPrefix.get(prefix).add(name)
  }
}

const collections = []
for (const [prefix, names] of [...byPrefix].sort()) {
  const url = `https://api.iconify.design/${prefix}.json?icons=${[...names].sort().join(',')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  const data = await res.json()
  const missing = data.not_found ?? []
  if (missing.length)
    throw new Error(`${prefix} 에 없는 아이콘: ${missing.join(', ')}`)
  delete data.lastModified
  collections.push(data)
}

writeFileSync(OUT, `${JSON.stringify(collections)}\n`)
const total = collections.reduce((n, c) => n + Object.keys(c.icons).length, 0)
console.log(
  `${relative(ROOT, OUT)}: ${collections.length}개 컬렉션 · ${total}개 아이콘`,
)
