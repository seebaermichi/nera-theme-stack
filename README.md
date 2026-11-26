# @nera-static/theme-stack

[![Test](https://github.com/seebaermichi/nera-theme-stack/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-theme-stack/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/theme-stack)](https://www.npmjs.com/package/@nera-static/theme-stack)

A blog theme for the [Nera](https://github.com/seebaermichi/nera) static site generator, made for people who write about code: code-first posts, series and type-only covers. It is presentation only — Pug views, one stylesheet, three self-hosted webfonts and a `config/theme.yaml` of design tokens.

📖 **Documentation:** [nera.js.org](https://nera.js.org)

- **"Stack"**: a light grey page, white cards with a 2 px ink border and a hard offset shadow, one red, one lime, dark panels for code. Headings in Bricolage Grotesque, text in Inter, labels, dates and code in JetBrains Mono.
- **Type as picture**: a post without an `image` gets a coloured cover with its first tag in large type, the colour following its place in the list.
- **No JavaScript** and **no third-party request**: the fonts are served from your own site, every URL the theme emits is a path on your site, and it works under a `base_path`.
- **Accessible by default**: skip link, one `<main id="main">`, one `<h1>` per page, labelled navigation, visible focus, a language switch with `hreflang` and `lang`, contrast of at least 4.5:1 for every default colour pair, no motion for visitors who asked for less.
- **Plugins are optional**: plugin output reaches a page only through *seams* you fill; without a plugin the seam renders nothing.
- **Interchangeable with the other Nera blog themes**: the same page types, frontmatter and `config/theme.yaml` keys as `@nera-static/theme-blog`, so a blog switches by changing `theme:`.

## Installation

```bash
npm install @nera-static/theme-stack
```

In your site's `config/app.yaml`:

```yaml
theme: stack
```

The theme needs Nera's engine, `@nera-static/core`, **4.15.0 or later** (`"nera": { "generator": ">=4.15.0" }`); an older one fails the build with a message naming the range. Keep a `theme/views/` folder in your site (it holds your vendor copies and seam overrides anyway), and remove the `nera new` starter files `theme/views/layouts/layout.pug` and `theme/views/pages/default.pug` if they still carry the `nera:scaffold-default` line, or they hide the theme's files (`nera validate` warns with `theme-shadowed`).

## Page types

Set a page's `layout` to one of these:

| `layout:` | for | renders |
|---|---|---|
| `pages/home.pug` | the front page | the hero (`title`, `lead`, a button to `archive_href`, the page's Markdown body on the right), the `tag-cloud` seam as a dark band, the newest post as a wide card ("Latest post"), the next `blog.home_posts` posts as cards ("Recent posts"), the featured series, the about block |
| `pages/post.pug` | one post | header (series line, title, lead, author line with published and updated date), the `post-media` seam when the post has an `image`, its `facts` beside the text, the body, then the `post-tags` seam, the parts of its series and the `post-pagination` seam |
| `pages/archive.pug` | all posts | page header, body, the posts grouped by year (newest first, with the number of posts), the `tag-cloud` seam as a band |
| `pages/tag.pug` | the tag pages of `@nera-static/plugin-tags` | the `tag-overview` seam, which owns the page's `<h1>` |
| `pages/default.pug` | about, legal pages, anything else | page header, body |

The page header is the page's only `<h1>` (from `title`), so **start a page's Markdown at `##`**.

**The home's body** sits beside the title. The theme is built for one `bash` fence there, which `@nera-static/plugin-code-blocks` renders as a terminal card on a red offset block:

````markdown
---
layout: pages/home.pug
title: Laravel, AI, and the bugs in between.
lead: Field notes on shipping LLM features with PHP.
archive_href: /archive.html
---

```bash:terminal
composer require laravel/reverb
php artisan reverb:start
```
````

Without a body the hero is the title column alone.

**Posts** are the pages whose `layout` is listed in `blog.post_layouts` (default `['pages/post.pug']`) and whose language is the current page's, newest first by date, ties broken by URL. Give every post a `date`. Prev/next comes from `@nera-static/plugin-page-pagination`, which pairs pages of the same folder (the older post is "previous"), so keep the posts of one language in a folder of their own (`pages/posts/`, `pages/de/posts/`).

Frontmatter the views read:

| key | type | read by |
|---|---|---|
| `title` | string | every page (`<title>`, the `<h1>`, card and archive titles) |
| `description` | string | every page (`<meta name="description">`); the text on a card |
| `lead` | string | home hero, page and post header |
| `robots` | string | `<meta name="robots">` (else `robots` in `config/app.yaml`) |
| `lang` | string | `<html lang>`, the post selection, dates, `t()` (else `lang` in `config/app.yaml`) |
| `slug` | string | the language switch: translations of one page share a `slug` |
| `date` | date | post, cards, archive (becomes `meta.createdAt`) |
| `updated` | date | post |
| `author` | string | post: the author line (else `author.name` of `config/theme.yaml`) |
| `archive_href` | site path | home: the "All posts" button and link |
| `image`, `image_alt` | path, string | a post with `image` shows its picture through the `post-media` and `card-media` seams instead of a type cover |
| `tags` | list of strings | the type cover shows the first tag; plugin-tags reads the list for the tag links and pages |
| `series`, `series_part` | string, integer | above the title: "Series: `<name>` · Part `<n>`"; under the post: the parts of the series in the page's language, ordered by `series_part`, the current one marked |
| `facts` | list of `{ label, value }`, at most four | a small box beside the text (`Laravel 12.4`, `PHP 8.4`) |

Dates are printed with `toLocaleDateString(<page language>, { year: 'numeric', month: 'long', day: 'numeric' })` in UTC; archive rows print day and month only, under their year.

## Seams: where plugin output goes

A seam is a partial the theme ships empty (or with a plugin-free default). You fill it by putting a file with the same path into your site's `theme/views/`. The theme never reads plugin data itself, so a theme update cannot break on a plugin's data shape. Publish each plugin's templates into your site first (`npx nera-<plugin>`, for example `npx nera-tags`); they land in `theme/views/vendor/plugin-<name>/`.

| seam (`theme/views/…`) | where | in scope | typical override |
|---|---|---|---|
| `partials/head-extra.pug` | end of `<head>` | `app`, `meta` | canonical and alternate links |
| `partials/feed-link.pug` | end of `<head>`, before `head-extra.pug` | `app`, `meta` | plugin-feed |
| `partials/nav-main.pug` | inside the header's `<nav>` | `app`, `meta` | plugin-navigation (a "Feed" entry goes into its menu) |
| `partials/footer-extra.pug` | footer, before the legal links | `app`, `meta` | plugin-social-media-links |
| `partials/scripts-extra.pug` | end of `<body>` | `app`, `meta` | your own `<script type="module">` |
| `partials/post-media.pug` | `div.post__media` of a post with `image` | `meta` | plugin-images |
| `partials/card-media.pug` | `div.post-card__media` of a card with `image` | `item` (the post) | plugin-images |
| `partials/post-tags.pug` | `div.post__tags` of a post | `meta` | plugin-tags |
| `partials/post-pagination.pug` | `div.post__pagination` of a post | `meta` | plugin-page-pagination |
| `partials/tag-overview.pug` | `section.tag-page` | `meta`, `app` | plugin-tags. Default without the plugin: `h1.page__title` and the body |
| `partials/tag-cloud.pug` | home (after the hero) and archive (at the end) | `app`, `meta` | plugin-tags |

The overrides, ready to copy:

```pug
//- theme/views/partials/feed-link.pug — npx nera-feed (needs `origin` in config/app.yaml)
include /vendor/plugin-feed/feed-link
```

```pug
//- theme/views/partials/nav-main.pug — npx nera-navigation
//- One menu per language (elements.main_en, elements.main_de in config/navigation.yaml).
include /vendor/plugin-navigation/partials/link-list-navigation
+linkListNav(((app.nav || {})[`main_${meta.lang || app.lang}`] || { elements: [] }).elements, '', (meta.lang || app.lang) === app.lang ? '/' : `/${meta.lang}`)
```

```pug
//- theme/views/partials/footer-extra.pug — npx nera-social-media-links
//- Never include fontawesome-cdn-link.pug: it loads icons from a CDN.
include /vendor/plugin-social-media-links/social-media-links
```

```pug
//- theme/views/partials/post-media.pug — npx nera-images
include /vendor/plugin-images/picture
+picture(meta.images && meta.images.image, { alt: meta.image_alt, class: 'post__image', loading: 'eager' })
```

```pug
//- theme/views/partials/card-media.pug
include /vendor/plugin-images/picture
+picture(item.meta.images && item.meta.images.image, { alt: item.meta.image_alt, class: 'post-card__image' })
```

```pug
//- theme/views/partials/post-tags.pug — npx nera-tags
include /vendor/plugin-tags/partials/tag-links
```

```pug
//- theme/views/partials/tag-overview.pug
include /vendor/plugin-tags/pages/tag-overview
```

```pug
//- theme/views/partials/tag-cloud.pug
include /vendor/plugin-tags/partials/tag-cloud
```

```pug
//- theme/views/partials/post-pagination.pug — npx nera-page-pagination
include /vendor/plugin-page-pagination/page-pagination
```

## What a post may contain

Pictures and code inside a post come from the plugins' output, which the theme only styles. No raw HTML and no special classes are needed:

- a fenced code block → plugin-code-blocks' dark panel with the file name (```` ```php:app/Events/TokenReceived.php ````); a `diff` fence marks added and removed lines; a `bash` fence gets `$` prompts;
- a blockquote → the lime note box; a leading `**bold**` reads as its title;
- a Markdown table → the benchmark table (mono header, figures right-aligned);
- `![alt](src "Caption")` → plugin-images' `figure.nera-image` with its caption;
- a bulleted list → red square bullets.

## External links in a new tab

The theme sets no `target` itself, but it marks every link that opens a new tab with an arrow (`↗`), so the change of context is visible. To open external links in a new tab:

```bash
npm install @nera-static/plugin-link-attributes
npx nera-link-attributes     # writes config/link-attributes.yaml
```

```yaml
# config/link-attributes.yaml — every link in page content whose href starts with http or www
attributes:
    - target="_blank"
    - rel="noopener noreferrer"
```

```yaml
# config/social-media-links.yaml — the footer's social links too
open_in_new_tab: true
```

`nera check`'s opt-in rule `a11y-target-blank` reports every `target="_blank"`; a site that opens new tabs on purpose leaves it off (its default) or sets `a11y-target-blank: off` in `config/validate.yaml`. Links of the theme itself (header, footer, legal links) are internal and never open a new tab.

## Search

The theme has no search page of its own and ships no JavaScript, but it styles `@nera-static/plugin-search`'s markup: the input full width of the text column, the results as rows like the archive's, matches in lime, the "no results" message in muted text. The list draws nothing while it is empty, and the message nothing while there are hits. Your site adds the page, loads the plugin's script on that page only, and links it from the menu:

```bash
npm install @nera-static/plugin-search
npx nera-search     # publishes theme/views/vendor/plugin-search/search.pug and theme/assets/js/search.js
```

```yaml
# config/search.yaml
group_by_lang: true    # one index per language: the German page finds German pages only
show_title: false      # the page brings its own <h1>
include_script: false  # the script comes through the scripts-extra.pug seam
```

```yaml
# config/plugin-order.yaml — search last, so the tag pages plugin-tags adds are in the index
plugin-order:
    - end:
          - plugin-search
```

```pug
//- theme/views/pages/search.pug — your site's own page type: the theme's page header, then the plugin's input and list
extends ../layouts/layout.pug

block main
    include ../partials/page-header.pug
    include /vendor/plugin-search/search.pug
```

`include_script: false` keeps the published template from loading the script itself, inside `<main>`. Load it from the `scripts-extra.pug` seam instead, on the search page only, so every other page stays without JavaScript:

```pug
//- theme/views/partials/scripts-extra.pug
if meta.layout === 'pages/search.pug'
    script(src='/js/search.js')
```

```markdown
---
layout: pages/search.pug
slug: search
title: Search
lead: Every post, page and topic, by title and text.
---
```

Save that as `pages/search.md` (and `pages/de/suche.md` with `lang: de` and German texts), then add `/search.html` (and `/de/suche.html`) to each language's menu in `config/navigation.yaml`. The input's label, placeholder and the "no results" message are the plugin's `t()` keys `search_label`, `search_placeholder` and `search_no_results`; translate them under `translations` in `config/app.yaml`.

## Configuration: `config/theme.yaml`

The theme's `config/theme.yaml` holds every key with a default. Your site's `config/theme.yaml` is deep-merged over it: set only what you change. Arrays are replaced as a whole.

```yaml
label: Stack
tokens:
    color:
        bg: '#f4f5f7'            # page background
        surface: '#ffffff'       # cards, boxes, buttons
        text: '#101319'          # body text, the 2px ink borders
        muted: '#555d6b'         # dates, captions, meta lines, the footer
        accent: '#d02408'        # links, the primary button, bullets, active navigation
        accent_text: '#ffffff'   # text on accent
        border: '#d9dde4'        # hairlines, the shadow of code panels
        focus: '#1d4fe0'         # the :focus-visible outline
        night: '#12151c'         # code panels, the series blocks
        night_text: '#e7eaf0'    # text on night
        night_muted: '#98a2b3'   # muted text on night
        highlight: '#d8f24a'     # lime: the note box, series numbers, the author mark
    font:
        body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        heading: "'Bricolage Grotesque', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        mono: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    size:
        base: '1.0625rem'        # body text size
        measure: '46rem'         # width of the reading column
        width: '73rem'           # width of header, lists and footer
        radius: '0'              # corners
        space: '1.5rem'          # vertical rhythm
extra_css: []
footer_links: []
blog:
    post_layouts: ['pages/post.pug']
    home_posts: 6
    featured_series: ''
    highlight_tag: ''
author:
    name: ''
    bio: ''
    href: ''
```

| key | meaning |
|---|---|
| `tokens.<group>.<name>` | each token becomes the CSS custom property `--theme-<group>-<name>` (`_` → `-`) in an inline `<style>`; a value containing `<`, `>`, `{`, `}` or `;` is dropped. `theme.css` repeats every default, so the page is styled even if the `<style>` is blocked. |
| `extra_css` | stylesheets linked after `theme.css`. Only root-absolute paths (`/css/custom.css`) are linked. |
| `footer_links` | the footer's legal links: `{ label, href }`; `label` goes through `t()`, `href` is a path or a `{ <lang>: path }` map. |
| `blog.post_layouts` | the layouts that make a page a post |
| `blog.home_posts` | how many posts "Recent posts" lists after the "Latest post" card (default 6: two rows of three). The card is always the newest post and is not counted; `0` shows the card alone. Since 2.0.0: in 1.x the card was counted (default 7). |
| `blog.featured_series` | a `series` name: the home shows its parts as a numbered list on a dark block, with a "Read more" link to part one. Nothing when no post of the page's language belongs to it. |
| `blog.highlight_tag` | read by the other Nera blog themes; Stack renders nothing for it |
| `author.name`, `author.bio`, `author.href` | the about block on the home (the initials of the name in a lime mark, "About the author", the name, the bio, a "Read more" link to `href`) and the author line of a post. `href` is a path or a `{ <lang>: path }` map. Without `name` neither is rendered; a post's own `author` wins on that post. |

A blog with code blocks, an author and legal pages in English and German:

```yaml
# your site's config/theme.yaml
extra_css: ['/_nera/code-blocks.css']
footer_links:
    - label: Imprint
      href: { en: /imprint.html, de: /de/impressum.html }
    - label: Privacy
      href: { en: /privacy.html, de: /de/datenschutz.html }
blog:
    featured_series: RAG from scratch in Laravel
author:
    name: Jonas Brandt
    bio: Backend developer in Leipzig.
    href: { en: /about.html, de: /de/ueber-mich.html }
```

**Code blocks.** `theme.css` sets `@nera-static/plugin-code-blocks`' custom properties on `.nera-code` and `.nera-code-scope`: `--nera-code-bg`, `-ink` and `-muted` from the `night` tokens, `-font` and `-radius` from `font.mono` and `size.radius`, and fixed colours for keywords, strings and names. Link the plugin's stylesheet with `extra_css: ['/_nera/code-blocks.css']`; the theme never links `/_nera/…` itself. The theme ships no JavaScript, so set `copy_button: false` in `config/code-blocks.yaml`, or load `/_nera/code-blocks.js` from `scripts-extra.pug`.

**Fonts.** The theme ships its three families as `.woff2` under `assets/fonts/stack/` (in your output: `/fonts/stack/`), Latin and Latin Extended subsets each, with `font-display: swap` and relative URLs, so they work under a `base_path`. To use another family, self-host it and name it in `tokens.font.*`; the theme's own files are only downloaded where their family is used.

| family | files | source |
|---|---|---|
| Bricolage Grotesque (variable, 200–800) | `bricolage-grotesque-latin{,-ext}-wght-normal.woff2` | `@fontsource-variable/bricolage-grotesque` 5.3.0 |
| Inter (variable, upright and italic) | `inter-latin{,-ext}-wght-{normal,italic}.woff2` | `@fontsource-variable/inter` 5.3.0 |
| JetBrains Mono (variable, upright) | `jetbrains-mono-latin{,-ext}-wght-normal.woff2` | `@fontsource-variable/jetbrains-mono` 5.3.0 |

All three are under the SIL Open Font License 1.1; the licence texts ship beside the files (`OFL-<family>.txt`).

## Translations

Every string the theme renders goes through `t()` with an English key, so an English site needs nothing. For other languages add the keys under `translations.<lang>` in `config/app.yaml`:

```yaml
translations:
    en:
        language_name: English
    de:
        language_name: Deutsch
        Skip to content: Zum Inhalt springen
        Main navigation: Hauptnavigation
        Language: Sprache
        Legal: Rechtliches
        Latest post: Neuester Beitrag
        Recent posts: Neueste Beiträge
        All posts: Alle Beiträge
        Published: Veröffentlicht
        Updated: Aktualisiert
        Series: Serie
        Part: Teil
        About the author: Über den Autor
        Read more: Weiterlesen
        posts: Beiträge
        # your footer_links labels
        Imprint: Impressum
        Privacy: Datenschutz
        # plugin-page-pagination
        Pagination: Blätternavigation
```

| key | where |
|---|---|
| `Skip to content` | the skip link |
| `Main navigation`, `Language`, `Legal` | `aria-label` of the header navigation, the language switch, the footer's legal links |
| `Latest post`, `Recent posts` | headings of the home's two post lists |
| `All posts` | the hero button and the link beside "Recent posts" |
| `Published`, `Updated` | a post's author line |
| `Series`, `Part` | the series line above a post's title, the label of the home's series block, the `aria-label` of a post's series list |
| `About the author`, `Read more` | the home's about block; `Read more` also links to part one of the featured series (and is plugin-tags' link text on tag pages) |
| `posts` | the count under a year in the archive ("8 posts") |
| `language_name` | each language's own name in the language switch |

The language switch appears when `translations` has two or more languages and another language has a page to link: the page with the same `slug`, else that language's home page.

## Overriding the theme

| to change | do this | keeps theme updates for |
|---|---|---|
| a colour, a font, a width | the token in your `config/theme.yaml` | everything |
| a few CSS rules | `theme/assets/css/custom.css` + `extra_css: ['/css/custom.css']` | everything |
| where plugin output goes | override a seam | every other file |
| one partial or page type | copy it to `theme/views/<same path>` | every other file |
| the whole shell | override `layouts/layout.pug` | page types, partials, CSS |
| a new page type | `theme/views/pages/<name>.pug` with `extends ../layouts/layout.pug` | everything |

The layout defines the blocks `head`, `header`, `main`, `footer` and `scripts`. The views and partials, all part of the contract: `layouts/layout.pug`; `partials/head.pug`, `tokens.pug`, `helpers.pug`, `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug`, `post-card.pug` (one post in a list; `item`, `position` and `featured` in scope), `home-series.pug` and `home-about.pug`; the seams above; the five page types.

`partials/helpers.pug` defines `pageLang(page)`, `sameLang(page)`, `homeHref(lang)`, `formatDate(value, lang)`, `isoDate(value)` and `hrefFor(value, lang)`. A layout of your own includes it first. It also defines `themeStack`, an object the theme's own views use internally; it is not part of the contract.

### Classes

The theme's public classes, safe to style in your `custom.css`:

- shell: `skip-link`, `site-header`, `site-header__inner`, `site-header__brand`, `site-header__nav`, `lang-switch`, `lang-switch__list`, `lang-switch__item`, `lang-switch__link`, `site-main`, `page__header`, `page__title`, `page__lead`, `page__body`, `site-footer`, `site-footer__inner`, `site-footer__legal`, `site-footer__copy`
- home: `home-hero`, `home-hero__inner`, `home-hero__title`, `home-hero__lead`, `home-hero__actions`, `home-hero__aside`, `button`, `button--primary`, `home-series`, `home-about`, `home-about__mark`, `home-about__links`
- lists: `post-list`, `post-list__title`, `post-list__items`, `post-list__item`, `post-list__more`, `post-card`, `post-card--featured`, `post-card__media`, `post-card__image`, `post-card__cover`, `post-card__cover--{red,night,lime,paper,blue,mint}`, `post-card__body`, `post-card__title`, `post-card__link`, `post-card__excerpt`, `post-card__meta`, `post-card__date`, `post-archive__year`, `post-archive__count`, `post-archive__list`, `post-archive__item`, `tag-page`
- post: `post`, `post__header`, `post__series`, `post__title`, `post__lead`, `post__meta`, `post-author`, `post-author__mark`, `post-author__name`, `post__author`, `post__date`, `post__updated`, `post__media`, `post__image`, `post-facts`, `post-facts__item`, `post-facts__label`, `post-facts__value`, `post__body`, `post__footer`, `post__tags`, `post-series`, `post-series__title`, `post-series__list`, `post-series__item`, `post-series__item--current`, `post__pagination`

The plugin classes the theme styles, all optional peer dependencies:

| plugin | peer range | classes |
|---|---|---|
| `@nera-static/plugin-tags` | `^3.4.1` | `tag-cloud`, `tag-cloud__item`, `tag-links`, `tag-links__item`, `tag-overview` and its elements (`__header`, `__title`, `__image`, `__content`, `__item`, `__item-title`, `__item-date`, `__item-description`, `__item-link`) |
| `@nera-static/plugin-page-pagination` | `^2.4.0` | `page-pagination`, `page-pagination__link`, `page-pagination__link--previous`, `page-pagination__link--next` |
| `@nera-static/plugin-code-blocks` | `^1.2.1` | `nera-code`, `nera-code-scope`, `nera-code__bar`, `nera-code__title`, `nera-code__pre`, `hljs-addition`, `hljs-deletion` |
| `@nera-static/plugin-images` | `^1.0.3` | `nera-image`, `nera-image__caption` |
| `@nera-static/plugin-navigation` | `^3.1.0` | `nav`, `nav--list`, `nav__item`, `nav__link`, `nav__link--active`, `nav__link--active-path` — only inside `.site-header__nav` |
| `@nera-static/plugin-search` | `^2.4.0` | `search`, `search__input`, `search__results`, `search__item`, `search__link`, `search__description`, `search__highlight`, `search__empty` (not `search__title`: the page brings its own `<h1>`) |
| `@nera-static/plugin-social-media-links` | `^2.3.0` | `social-media-links` and its elements — only inside `.site-footer` |

## What your site must do

The theme guarantees its own markup. Your content and the plugin output are yours; for `nera check` to report nothing:

1. Keep a `theme/views/` folder, and delete the `nera:scaffold-default` starter files from it.
2. Publish every plugin template you use (`npx nera-<plugin>`) and fill the seams; keep plugin-navigation's default class names and call `+linkListNav` (with `rootPath` for a language folder).
3. Use `@nera-static/plugin-page-pagination` 2.4.0 or later and translate `Pagination`.
4. Never include `fontawesome-cdn-link.pug`. Set `open_in_new_tab` in `config/social-media-links.yaml` deliberately: `false` keeps every link in the same tab; `true` (with plugin-link-attributes for content links, see above) needs `a11y-target-blank` off.
5. Set `footer_links` to your imprint and privacy pages, per language, with labels the legal checks recognise (`Imprint`/`Impressum`, `Privacy`/`Datenschutz`).
6. Translate every theme key, `language_name` per language, and your `footer_links` labels.
7. Start page bodies at `##`, give every image an `alt`, every post a `date`, and the translations of one page the same `slug`.
8. With plugin-tags: `tag_overview_layout: 'pages/tag.pug'` in `config/tags.yaml` (and `group_by_lang: true` on a multilingual site). With plugin-code-blocks: `extra_css: ['/_nera/code-blocks.css']` and `copy_button: false`. With plugin-images: `widths: [480, 800, 1600, 2400]` and `eager_first: false` in `config/images.yaml`. With plugin-search: `show_title: false` and `include_script: false` (and `group_by_lang: true`) in `config/search.yaml`, and its script from `scripts-extra.pug` (see [Search](#search)).

`test/site/` in this repository is a complete example: the sample blog "tinker.log" in English and German with every step above applied, checked in CI with every `nera check` rule on except `a11y-target-blank` (its external links open in a new tab). Its one picture is a generated placeholder made for this repository.

## Accessibility and privacy

- Skip link first, one `<main id="main">`, one `<h1>`, no skipped heading level, every theme `<nav>` labelled, `<html lang>` always set, a zoomable viewport, no `target="_blank"` in theme markup (links that a plugin opens in a new tab are marked with `↗`). The type covers are decorative (`aria-hidden`): the card's title carries the link.
- `:focus-visible` gets a 3 px outline in the `focus` colour. The card and button shifts on hover run only for visitors without a reduced-motion preference.
- The eight default colour pairs and the theme's four `night`/`highlight` pairs reach at least 4.5:1.
- No JavaScript, no cookies or device storage, no request to another host: the fonts come from your site. Narrow screens are handled by CSS alone; below 900 px every grid stacks to one column.

## Versioning

The theme follows semantic versioning over its contract: view, partial, seam and block paths; token names and every `config/theme.yaml` key; the `t()` keys; the frontmatter and `app.*` keys it reads; the public classes; the plugin classes it styles.

| change | release |
|---|---|
| remove or rename any of these, change an element or its nesting under a public class, change what a key means, raise the `nera.generator` floor, drop a plugin major | major |
| add a view, seam, block, token, key or class; add a plugin major to a peer range; change a token's default | minor (a new `t()` key is named in the [changelog](CHANGELOG.md)) |
| a CSS or markup fix that keeps the contract, an accessibility fix, docs | patch |

## Development

```bash
npm ci
npm run lint
npx vitest run     # builds the fixture site in temporary copies and checks it
```

To look at the fixture site: `cd test/site && npx nera build && npx nera serve`.

## License

MIT. The fonts under `assets/fonts/stack/` are under the SIL Open Font License 1.1 (see the `OFL-*.txt` files beside them).
