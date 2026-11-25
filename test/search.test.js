// The fixture's search page (plugin-search as an optional peer): a page type
// of the site's own, the plugin's script through the scripts-extra.pug seam
// on that page only, one index per language, a menu item and a language
// switch between the two pages.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { attr, elementByClass, page, tags } from './helpers/html.js'

const builds = inject('builds')
const PAGES = [
    { file: 'search.html', href: '/search.html', lang: 'en', index: '/search-index.json', menu: 'Search', other: '/de/suche.html' },
    { file: path.join('de', 'suche.html'), href: '/de/suche.html', lang: 'de', index: '/search-index.de.json', menu: 'Suche', other: '/search.html' },
]
const index = (build, file) => JSON.parse(fs.readFileSync(path.join(build.public, file), 'utf-8'))

describe('The search page', () => {
    for (const { file, href, lang, index: indexUrl, menu, other } of PAGES) {
        it(`${lang}: loads /js/search.js once, at the end of <body>, outside <main>`, () => {
            const html = page(builds.default.public, file)
            const scripts = tags(html, 'script')
            expect(scripts.length).toBe(1)
            expect(attr(scripts[0], 'src')).toBe('/js/search.js')
            expect(html).toMatch(/<\/footer>\s*<script src="\/js\/search\.js"><\/script>\s*<\/body>/)
            expect(html.slice(html.indexOf('<main'), html.indexOf('</main>'))).not.toContain('<script')
        })

        it(`${lang}: renders the page header and the input with its language's index`, () => {
            const html = page(builds.default.public, file)
            expect(html).toMatch(/<h1 class="page__title">/)
            expect(html).not.toContain('search__title')
            const inputs = tags(html, 'input').filter((a) => /search__input/.test(a))
            expect(inputs.length).toBe(1)
            expect(attr(inputs[0], 'data-search-index')).toBe(indexUrl)
            expect(attr(inputs[0], 'aria-label')).toBe(lang === 'de' ? 'Suche' : 'Search')
            expect(elementByClass(html, 'ul', 'search__results').trim()).toBe('')
        })

        it(`${lang}: is in the header menu of its language and switches to the other language's search page`, () => {
            const html = page(builds.default.public, file)
            const nav = elementByClass(html, 'nav', 'site-header__nav')
            expect(nav).toContain(`href="${href}">${menu}</a>`)
            expect(elementByClass(page(builds.default.public, lang === 'de' ? path.join('de', 'index.html') : 'index.html'), 'nav', 'site-header__nav')).toContain(`href="${href}">${menu}</a>`)
            const links = tags(html, 'a').filter((a) => /lang-switch__link/.test(a))
            expect(links.map((a) => attr(a, 'href'))).toEqual([other])
        })
    }

    it('writes one index per language: German pages only in the German one', () => {
        const en = index(builds.default, 'search-index.json')
        const de = index(builds.default, 'search-index.de.json')
        expect(en.length).toBeGreaterThan(10)
        expect(de.length).toBeGreaterThan(10)
        expect(en.every((item) => item.lang === 'en' && !item.href.startsWith('/de/'))).toBe(true)
        expect(de.every((item) => item.lang === 'de' && item.href.startsWith('/de/'))).toBe(true)
        // plugin-search runs last (config/plugin-order.yaml), so tag pages are in
        expect(en.some((item) => item.href.startsWith('/tags/'))).toBe(true)
        expect(de.some((item) => item.href.startsWith('/de/tags/'))).toBe(true)
    })

    it('prefixes the script, the index URL and the index hrefs with base_path', () => {
        const build = builds.sub
        for (const { file, index: indexUrl } of PAGES) {
            const html = page(build.public, file)
            expect(attr(tags(html, 'script')[0], 'src')).toBe('/sub/js/search.js')
            expect(attr(tags(html, 'input').find((a) => /search__input/.test(a)), 'data-search-index')).toBe(`/sub${indexUrl}`)
        }
        expect(index(build, 'search-index.de.json').every((item) => item.href.startsWith('/sub/de/'))).toBe(true)
    })
})
