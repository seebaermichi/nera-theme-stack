// The fixture's search page (plugin-search as an optional peer): a page type
// of the site's own, the plugin's 2.4.0 template unedited, its script through
// the scripts-extra.pug seam on that page only (`include_script: false`), one
// index per language, a menu item and a language switch between the two
// pages.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { attr, elementByClass, page, tags } from './helpers/html.js'

const builds = inject('builds')
const PAGES = [
    { file: 'search.html', href: '/search.html', lang: 'en', index: '/search-index.json', menu: 'Search', other: '/de/suche.html' },
    { file: path.join('de', 'suche.html'), href: '/de/suche.html', lang: 'de', index: '/search-index.de.json', menu: 'Suche', other: '/search.html' },
]
// theme.css without comments; rule() joins the bodies of every rule whose
// selector list names the selector (as in starter-fit.test.js)
const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
const phone = css.slice(css.indexOf('@media (max-width: 900px)'))
const rule = (text, selector) => [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, prelude]) => prelude.split(',').map((x) => x.trim()).includes(selector))
    .map(([, , body]) => body).join('\n')
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
            // plugin-search 2.4.0: the client shows this text when a query
            // matches nothing; German through t(), English the fallback
            expect(attr(inputs[0], 'data-search-empty')).toBe(lang === 'de' ? 'Keine Treffer' : 'No results')
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
            const scripts = tags(html, 'script')
            expect(scripts.length).toBe(1)
            expect(attr(scripts[0], 'src')).toBe('/sub/js/search.js')
            expect(attr(tags(html, 'input').find((a) => /search__input/.test(a)), 'data-search-index')).toBe(`/sub${indexUrl}`)
        }
        expect(index(build, 'search-index.de.json').every((item) => item.href.startsWith('/sub/de/'))).toBe(true)
    })
})

describe('The search page looks like Stack', () => {
    it('sets the search block in the measure, left-aligned with the page header, like a page body', () => {
        expect(rule(css, '.site-main > .search')).toMatch(/padding-inline: var\(--gutter\)/)
        expect(rule(css, '.site-main > .search')).toMatch(/max-width: calc\(var\(--measure\) \+ 2 \* var\(--gutter\)\)/)
    })

    it('draws the input full width, from the tokens, with a visible focus', () => {
        const input = rule(css, '.search__input')
        expect(input).toMatch(/width: 100%/)
        expect(input).toMatch(/background: var\(--surface\)/)
        expect(input).toMatch(/border: 2px solid var\(--ink\)/)
        expect(input).toMatch(/border-radius: var\(--radius\)/)
        expect(input).not.toMatch(/outline: (none|0)/)
        expect(rule(css, '.search__input:focus-visible')).toMatch(/outline: 3px solid var\(--focus\)/)
    })

    it('renders no box while the results list is empty, before typing and without a match', () => {
        expect(rule(css, '.search__results:empty')).toMatch(/display: none/)
        // the list's rules and margin live only on the list, which the :empty
        // rule hides; the block around it draws nothing of its own
        expect(rule(css, '.search__results')).toMatch(/border-block: 2px solid var\(--ink\)/)
        for (const selector of ['.search', '.site-main > .search']) {
            expect(rule(css, selector), selector).not.toMatch(/border|background|padding-block|margin-block|(^|[^-])(padding|height):/)
        }
    })

    it('marks a match with the text colour on the highlight token, also inside the muted description', () => {
        const highlight = rule(css, '.search__highlight')
        expect(highlight).toMatch(/background: var\(--highlight\)/)
        expect(highlight).toMatch(/(^|[^-])color: var\(--text\)/)
        expect(rule(css, '.search__description')).toMatch(/color: var\(--muted\)/)
    })

    it('shrinks the result titles below 900 px like the archive rows', () => {
        expect(rule(phone, '.search__link')).toMatch(/font-size: 20px/)
    })
})
