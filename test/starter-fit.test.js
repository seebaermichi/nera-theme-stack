// §S15 "Starter fit", with the page contents of Revision R4: the home lists
// the newest post as post-card--featured plus the next `blog.home_posts`; the
// archive groups by year with a count; a tag page has one <h1>; a post shows
// its tags, its series with the current part marked, its facts and the
// prev/next of plugin-page-pagination; a post without a picture renders no
// empty media element; a code block uses the --nera-code-* mapping and a card
// without a picture shows a cover.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { CODE_MAPPING } from './helpers/contract.js'
import { attr, countTags, elementByClass, page, pages, stripTags, tags } from './helpers/html.js'

const builds = inject('builds')
const pub = builds.default.public
const datetimes = (html) => tags(html, 'time').map((a) => attr(a, 'datetime'))
const isDescending = (list) => list.every((value, i) => i === 0 || list[i - 1] >= value)
const sections = (html, className) => html.split(`<section class="${className}">`).slice(1).map((s) => s.split('</section>')[0])
// theme.css without comments; rule() joins the bodies of every rule whose
// selector list names the selector, rules nested in @media included
const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
const phone = css.slice(css.indexOf('@media (max-width: 900px)'))
const rule = (text, selector) => [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, prelude]) => prelude.split(',').map((x) => x.trim()).includes(selector))
    .map(([, , body]) => body).join('\n')

describe('Starter fit: home', () => {
    it('shows the hero: title as the one <h1>, lead, a button to archive_href, the body on the right', () => {
        const hero = elementByClass(page(pub, 'index.html'), 'section', 'home-hero')
        expect(hero).toMatch(/<h1 class="home-hero__title">Laravel, AI, and the bugs in between\.<\/h1>/)
        expect(hero).toMatch(/<p class="home-hero__lead">Field notes/)
        expect(hero).toMatch(/<a class="button button--primary" href="\/archive\.html">All posts<\/a>/)
        expect(hero).toMatch(/<div class="home-hero__aside nera-code-scope">\s*<div class="nera-code nera-code--shell">/)
    })

    for (const [lang, home, first, rest] of [
        ['en', 'index.html', ['2026-11-19'], ['2026-11-05', '2026-10-22', '2026-10-08', '2026-09-24', '2026-09-10', '2026-08-27']],
        ['de', 'de/index.html', ['2026-11-19'], ['2026-11-05', '2026-10-22', '2026-10-08', '2026-09-24', '2026-08-27', '2026-08-13']],
    ]) {
        it(`${lang}: lists the latest post (post-card--featured) plus six under "Recent posts"`, () => {
            const [latest, recent] = sections(page(pub, home), 'post-list')
            expect(datetimes(latest)).toEqual(first)
            expect(latest).toMatch(/<article class="post-card post-card--featured">/)
            expect(datetimes(recent)).toEqual(rest)
            expect(countTags(recent, 'article')).toBe(6)
            expect(recent).not.toContain('post-card--featured')
            expect(isDescending([...first, ...rest])).toBe(true)
            const hrefs = tags(latest + recent, 'a').filter((a) => /post-card__link/.test(a)).map((a) => attr(a, 'href'))
            expect(hrefs.every((href) => href.startsWith(lang === 'de' ? '/de/posts/' : '/posts/'))).toBe(true)
        })
    }

    it('headings are t() keys: Latest post, Recent posts; the more link is All posts', () => {
        const [latest, recent] = sections(page(pub, 'index.html'), 'post-list')
        expect(latest).toContain('<h2 class="post-list__title">Latest post</h2>')
        expect(recent).toContain('<h2 class="post-list__title">Recent posts</h2>')
        expect(recent).toMatch(/<a class="post-list__more" href="\/archive\.html">All posts<\/a>/)
    })

    it('shows a type cover with the first tag on every card without a picture, colours following the position', () => {
        const [latest, recent] = sections(page(pub, 'index.html'), 'post-list')
        const covers = [...(latest + recent).matchAll(/<div class="post-card__cover post-card__cover--(\w+)" aria-hidden="true"><span>([^<]*)<\/span>/g)]
            .map((m) => [m[1], m[2]])
        expect(covers).toEqual([
            ['night', 'AI &amp; LLMs'],
            ['lime', 'Testing'],
            ['red', 'Queues'],
            ['blue', 'Postgres'],
            ['paper', 'Laravel'],
            ['night', 'Opinion'],
            ['mint', 'Ops'],
        ])
        // neighbours differ
        covers.forEach(([tone], i) => i && expect(tone).not.toBe(covers[i - 1][0]))
        expect(latest + recent).not.toContain('post-card__media')
    })

    it('shows the card picture through card-media when the post has an image, and then no cover', () => {
        // the picture post is older than the home list: a build with a longer one
        const home = page(builds.allposts.public, 'index.html')
        const card = home.split('<li class="post-list__item">').find((li) => li.includes('/posts/horizon-dashboards.html'))
        expect(card).toMatch(/<div class="post-card__media">\s*<picture>/)
        expect(card).toMatch(/<img class="post-card__image" [^>]*alt="Four bar charts/)
        expect(card).not.toContain('post-card__cover')
    })

    it('shows the featured series: label, name, Read more to part one, the parts in order', () => {
        const series = elementByClass(page(pub, 'index.html'), 'section', 'home-series')
        expect(series).toMatch(/<p>Series<\/p>\s*<h2>RAG from scratch in Laravel<\/h2>\s*<a class="button" href="\/posts\/chunking\.html">Read more<\/a>/)
        expect(tags(series, 'a').slice(1).map((a) => attr(a, 'href'))).toEqual([
            '/posts/chunking.html',
            '/posts/pgvector-embeddings.html',
            '/posts/reranking.html',
            '/posts/measuring-rag.html',
        ])
    })

    it('shows the about block: initials, label, name, bio, Read more to author.href', () => {
        const about = elementByClass(page(pub, 'index.html'), 'section', 'home-about')
        expect(about).toMatch(/<span class="home-about__mark" aria-hidden="true">JB<\/span>/)
        expect(about).toMatch(/<p>About the author<\/p>\s*<h2>Jonas Brandt<\/h2>\s*<p>Backend developer in Leipzig/)
        expect(about).toMatch(/<a class="button" href="\/about\.html">Read more<\/a>/)
        expect(elementByClass(page(pub, 'de/index.html'), 'section', 'home-about')).toMatch(/href="\/de\/ueber-mich\.html">Weiterlesen</)
    })

    it('renders the topics band through the tag-cloud seam, without counts', () => {
        const cloud = elementByClass(page(pub, 'index.html'), 'section', 'tag-cloud')
        expect(tags(cloud, 'a').length).toBeGreaterThanOrEqual(7)
        expect(stripTags(cloud)).not.toMatch(/\d/)
    })

    it('keeps the topics band on one line, scrolling sideways when the tags do not fit', () => {
        expect(rule(css, '.tag-cloud')).toMatch(/flex-wrap: nowrap/)
        expect(rule(css, '.tag-cloud')).toMatch(/overflow-x: auto/)
        expect(rule(css, '.tag-cloud__item')).toMatch(/white-space: nowrap/)
        expect(css).not.toMatch(/\.tag-cloud\s*\{[^}]*flex-wrap: wrap/)
    })

    it('leaves out the series and about blocks without featured_series and author.name', () => {
        const html = page(builds.overrides.public, 'index.html')
        expect(html).not.toContain('home-series')
        expect(html).not.toContain('home-about')
        // home_posts: 2 counts the posts after the "Latest post" card
        expect(datetimes(html)).toEqual(['2026-11-19', '2026-11-05', '2026-10-22'])
    })
})

describe('Starter fit: post', () => {
    const html = page(pub, 'posts/streaming-reverb.html')

    it('shows the series line, title, lead and the author line with published and updated', () => {
        const header = elementByClass(html, 'header', 'post__header')
        expect(header).toContain('<p class="post__series">Series: Chat that feels instant · Part 2</p>')
        expect(header).toMatch(/<h1 class="post__title">Streaming LLM responses with Laravel Reverb<\/h1>/)
        expect(header).toMatch(/<p class="post__lead">Polling made/)
        expect(header).toMatch(/<span class="post-author__mark" aria-hidden="true">JB<\/span><span class="post__author post-author__name">Jonas Brandt<\/span>/)
        expect(header).toMatch(/Published <time class="post__date" datetime="2026-11-19">November 19, 2026<\/time>/)
        expect(header).toMatch(/Updated <time class="post__updated" datetime="2026-11-21">November 21, 2026<\/time>/)
    })

    it('shows its facts as a definition list', () => {
        const facts = elementByClass(html, 'dl', 'post-facts')
        expect(tags(facts, 'dt').length).toBe(3)
        expect(stripTags(facts)).toBe('Laravel 12.4 Reverb 1.5 PHP 8.4')
    })

    it('shows its tags through the post-tags seam', () => {
        const postTags = elementByClass(html, 'div', 'post__tags')
        expect(postTags).toMatch(/<section class="tag-links">/)
        expect(tags(postTags, 'a').map((a) => attr(a, 'href'))).toEqual(['/tags/ai-llms.html', '/tags/reverb.html', '/tags/queues.html', '/tags/websockets.html'])
    })

    it('lists the parts of its series in the page language, the current one marked', () => {
        const series = elementByClass(html, 'nav', 'post-series')
        expect(html).toMatch(/<nav class="post-series" aria-label="Series">/)
        expect(series).toContain('<h2 class="post-series__title">Chat that feels instant</h2>')
        const items = series.split('<li ').slice(1)
        expect(items.length).toBe(3)
        expect(items[1]).toMatch(/^class="post-series__item post-series__item--current"><span>02<\/span><a href="\/posts\/streaming-reverb\.html" aria-current="page">/)
        expect(items[0]).toMatch(/^class="post-series__item"><span>01<\/span><a href="\/posts\/chat-feels-slow\.html">/)
        expect(items[2]).toContain('/posts/optimistic-ui.html')
        expect(page(pub, 'de/posts/streaming-reverb.html')).toContain('<h2 class="post-series__title">Chat, der sich sofort anfühlt</h2>')
    })

    it('shows previous / next from plugin-page-pagination, with the older post first', () => {
        const pagination = elementByClass(page(pub, 'posts/queue-rate-limiter.html'), 'div', 'post__pagination')
        expect(pagination).toMatch(/<nav class="page-pagination" aria-label="Pagination">/)
        expect(pagination).toMatch(/page-pagination__link--previous" href="\/posts\/pgvector-embeddings\.html">/)
        expect(pagination).toMatch(/page-pagination__link--next" href="\/posts\/evals-in-pest\.html">/)
    })

    it('renders a picture through post-media, and no media element for a post without one', () => {
        const media = elementByClass(page(pub, 'posts/horizon-dashboards.html'), 'div', 'post__media')
        expect(media).toMatch(/<img class="post__image" [^>]*alt="Four bar charts[^>]*loading="eager"/)
        for (const { file, html: built } of pages(pub).filter(({ file }) => /posts\//.test(file) && !/horizon/.test(file))) {
            expect(built, file).not.toContain('post__media')
        }
        expect(html).not.toContain('post-facts__note')
    })

    it('sizes the post picture by one rule: the img at full width, no height on the media or the picture', () => {
        // the matcher sees the phone block, or a phone-only height rule would slip through
        expect(rule(phone, '.post-archive__item')).toMatch(/grid-template-columns/)
        expect(rule(css, '.post__image')).toMatch(/width: 100%/)
        expect(rule(css, '.post__image')).not.toMatch(/(^|[^-]|min-)height|aspect-ratio|object-fit/)
        for (const selector of ['.post__media', '.post__media picture', '.post__media > picture', '.post__media img']) {
            expect(rule(css, selector), selector).not.toMatch(/(^|[^-]|min-)height|aspect-ratio/)
        }
    })

    it('renders no series block or line for a post outside a series, and no facts without facts', () => {
        const plain = page(pub, 'posts/queue-rate-limiter.html')
        expect(plain).not.toContain('post__series')
        expect(plain).not.toContain('post-series')
        expect(plain).not.toContain('post-facts')
    })

    it('opens external links in a new tab (plugin-link-attributes, social links), internal ones not', () => {
        const body = elementByClass(html, 'div', 'post__body')
        const links = tags(body, 'a')
        const external = links.filter((a) => /^https?:/.test(attr(a, 'href')))
        expect(external.length).toBeGreaterThan(0)
        for (const a of external) {
            expect(attr(a, 'target')).toBe('_blank')
            expect(attr(a, 'rel')).toBe('noopener noreferrer')
        }
        for (const a of tags(html, 'a').filter((a) => /^\//.test(attr(a, 'href')))) expect(attr(a, 'target')).toBeUndefined()
        const footer = elementByClass(html, 'footer', 'site-footer')
        const social = tags(footer, 'a').filter((a) => /social-media-links__link/.test(a))
        expect(social.length).toBe(2)
        for (const a of social) expect(attr(a, 'target')).toBe('_blank')
        // and nothing opens a new tab without the plugins
        for (const { file, html: built } of pages(builds.noplugins.public)) expect(built, file).not.toContain('target="_blank"')
    })

    it('marks every link that opens a new tab with an arrow, in CSS only', () => {
        const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8')
        expect(css).toMatch(/a\[target='_blank'\]::after\s*\{[^}]*content: '\\00a0\\2197'/)
    })

    it('puts code blocks of plugin-code-blocks inside .nera-code-scope; diff lines carry hljs-addition / -deletion', () => {
        const body = elementByClass(html, 'div', 'post__body')
        expect(html).toContain('<div class="post__body nera-code-scope">')
        expect(body).toMatch(/<div class="nera-code">\s*<div class="nera-code__bar"[^>]*><span class="nera-code__title"><b>app\/Events\/TokenReceived\.php<\/b>/)
        expect(body).toMatch(/<span class="hljs-addition">/)
        expect(body).toMatch(/<span class="hljs-deletion">/)
        // blockquote = the note box, table = the benchmark table
        expect(body).toMatch(/<blockquote>\s*<p><strong>Use ShouldBroadcastNow<\/strong>/)
        expect(body).toMatch(/<table>/)
    })

    it('maps the --nera-code-* properties onto the theme\'s tokens on .nera-code', () => {
        const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8')
        const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, prelude, body]) =>
            prelude.split(',').map((x) => x.trim()).includes('.nera-code') && /--nera-code-bg/.test(body))
        expect(rule).toBeDefined()
        for (const [property, value] of Object.entries(CODE_MAPPING)) {
            expect(rule[2]).toContain(`${property}: ${value}`)
        }
    })

    it('links the code-blocks stylesheet through extra_css, after theme.css', () => {
        const links = tags(html, 'link').filter((a) => attr(a, 'rel') === 'stylesheet').map((a) => attr(a, 'href'))
        expect(links).toEqual(['/css/theme.css', '/_nera/code-blocks.css'])
        expect(fs.existsSync(path.join(pub, '_nera', 'code-blocks.css'))).toBe(true)
    })

    it('links the feed through the feed-link seam', () => {
        expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/feed\.xml"/)
        expect(page(pub, 'de/index.html')).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/de\/feed\.xml"/)
    })
})

describe('Starter fit: archive, tag page, default page', () => {
    for (const [lang, archive, counts] of [['en', 'archive.html', [10, 4]], ['de', 'de/archiv.html', [7, 2]]]) {
        it(`${lang}: the archive groups the posts by year, newest first, with <n> posts`, () => {
            const html = page(pub, archive)
            const years = sections(html, 'post-archive__year')
            expect(years.map((s) => Number(/<h2>(\d{4})/.exec(s)[1]))).toEqual([2026, 2025])
            years.forEach((section, i) => {
                const dates = datetimes(section)
                expect(dates.length).toBe(counts[i])
                for (const date of dates) expect(date.startsWith(String([2026, 2025][i]))).toBe(true)
                expect(section).toMatch(new RegExp(`<span class="post-archive__count">${counts[i]} ${lang === 'de' ? 'Beiträge' : 'posts'}</span>`))
            })
            expect(isDescending(datetimes(html))).toBe(true)
            expect(html).toMatch(/<section class="tag-cloud">/)
        })
    }

    it('renders each archive row as a date and a title only: no picture column, one grid track per child', () => {
        for (const archive of ['archive.html', 'de/archiv.html']) {
            const items = page(pub, archive).split('<li class="post-archive__item">').slice(1).map((li) => li.split('</li>')[0])
            expect(items.length, archive).toBeGreaterThan(0)
            for (const item of items) {
                expect(item, archive).toMatch(/^\s*<time datetime="\d{4}-\d{2}-\d{2}">[^<]+<\/time>\s*<a href="[^"]+">[^<]+<\/a>\s*$/)
            }
        }
        // the picture post is in the archive too, still without a picture
        expect(page(pub, 'archive.html')).toContain('href="/posts/horizon-dashboards.html"')
        const desktop = /grid-template-columns: ([^;]+);/.exec(rule(css.slice(0, css.indexOf('@media')), '.post-archive__item'))[1]
        expect(desktop.trim().split(/\s+(?![^(]*\))/)).toHaveLength(2)
        expect(rule(phone, '.post-archive__item')).toMatch(/grid-template-columns: minmax\(0, 1fr\);/)
    })

    it('renders every generated tag page with exactly one <h1>, through pages/tag.pug', () => {
        const tagPages = pages(pub).filter(({ file }) => /^(de\/)?tags\//.test(file))
        expect(tagPages.length).toBeGreaterThanOrEqual(15)
        for (const { file, html } of tagPages) {
            expect(countTags(html, 'h1'), file).toBe(1)
            expect(html, file).toMatch(/<section class="tag-page">\s*<section class="tag-overview">/)
        }
        const queues = page(pub, 'tags/queues.html')
        expect(countTags(queues, 'article')).toBe(5)
        expect(queues).toMatch(/<time class="tag-overview__item-date" datetime="2026-10-22">October 22, 2026<\/time>/)
        expect(page(pub, 'de/tags/queues.html')).toMatch(/<html lang="de">/)
    })

    it('renders a default page as header and body, nothing beside them', () => {
        const html = page(pub, 'about.html')
        const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)[1]
        expect(main).toMatch(/^\s*<header class="page__header">\s*<h1 class="page__title">About<\/h1>\s*<p class="page__lead">Who writes tinker\.log/)
        expect(main.replace(/<header class="page__header">[\s\S]*?<\/header>/, '')).toMatch(/^\s*<div class="page__body">[\s\S]*<\/div>\s*$/)
        expect(main).not.toMatch(/<aside/)
    })
})
