# Changelog

All notable changes to `@nera-static/theme-stack` are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the theme follows [semantic versioning](https://semver.org/) over its contract (see the README).

## [2.2.0] - 2026-11-26

### Added

-   `theme.css` styles `search__empty`, the "no results" message `@nera-static/plugin-search` 2.4.0's client shows when a query matches nothing: muted text (`color.muted` on `color.bg`, 6.1:1) under the search input, in the text column. It sets no `display`, so the client's `hidden` attribute stays in charge, and takes no space while it is empty. Its text is the plugin's `t()` key `search_no_results`.

### Changed

-   The optional peer `@nera-static/plugin-search` rises from `^2.3.1` to `^2.4.0`, the version that renders the message. The README's "Search" section now sets `include_script: false` in `config/search.yaml` instead of deleting the script line from the published template, and names `search_no_results` among the plugin's `t()` keys.

## [2.1.0] - 2026-11-25

### Added

-   `@nera-static/plugin-search` `^2.3.1` is an optional peer, and `theme.css` styles its classes `search`, `search__input`, `search__results`, `search__item`, `search__link`, `search__description` and `search__highlight`: the input full width of the text column with a visible focus, the results as rows like the archive's, matches in lime (`color.highlight`) behind the text colour. An empty results list (before typing, or without a match) draws nothing. The theme still ships no search page and no JavaScript: the README shows how a site adds its own `pages/search.pug`, loads the plugin's script from the `scripts-extra.pug` seam on that page only, and links it from the menu.

## [2.0.0] - 2026-11-24

### Changed

-   **BREAKING**: `blog.home_posts` no longer counts the "Latest post" card. The card is always the newest post; "Recent posts" lists the next `home_posts` posts, and the default drops from `7` to `6`, so a site on the default shows the same seven posts as before. The key now means the same in all Nera blog themes, which do not count their large opening element either. `home_posts: 0` shows the card alone.

### Migration from v1.x

A site that sets `blog.home_posts` subtracts one to keep its home unchanged:

```yaml
# 1.x: the card plus four
blog:
    home_posts: 5

# 2.0: the card plus four
blog:
    home_posts: 4
```

A site on the default changes nothing. `home_posts: 1` in 1.x (the card alone) becomes `0`. `home_posts: 0` in 1.x (no posts on the home) has no 2.0 equivalent: the card is always shown, and a negative value falls back to the default.

## [1.1.0] - 2026-11-24

### Added

-   Links that open a new tab are marked with an arrow (`↗`, in CSS on `a[target="_blank"]`), so the change of context is visible (WCAG 3.2.5). The theme still sets no `target` itself: a site opens external links in a new tab with `@nera-static/plugin-link-attributes` (links in page content) and `open_in_new_tab: true` in plugin-social-media-links (footer). Such a site turns off `nera check`'s opt-in rule `a11y-target-blank`, which reports every `target="_blank"`; the README shows the setup.

### Fixed

-   The topics band (`.tag-cloud` on the home and the archive) stays on one line. plugin-tags lists every tag of the page's language, so a blog with many tags wrapped the band onto a second row; it now scrolls sideways instead, on every screen width.

## [1.0.1] - 2026-11-24

### Fixed

-   The `size.space` token now takes effect: it sets the space between the blocks of a post's or page's running text (paragraphs, headings, lists, code, tables). `theme.css` read the token but used it nowhere, so a site's `size.space` changed nothing. With the default (`1.5rem`) the gap is 24 px instead of the fixed 26 px before.

## [1.0.0] - 2026-11-24

### Added

-   The "Stack" blog theme for people who write about code: `views/`, `assets/css/theme.css`, `config/theme.yaml` and self-hosted webfonts, presentation only — no JavaScript, no third-party request.
-   Page types `pages/home.pug` (hero with the page body as a terminal card, the topics band, the newest post as a wide card, the next posts as cards, the featured series, the about block), `pages/post.pug` (series line, author line, facts, series list), `pages/archive.pug` (posts by year with a count), `pages/tag.pug` and `pages/default.pug` — the same page types as `@nera-static/theme-blog`.
-   The shell `layouts/layout.pug` with the blocks `head`, `header`, `main`, `footer` and `scripts`, and the partials `head.pug`, `tokens.pug`, `helpers.pug`, `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug`, `post-card.pug`, `home-series.pug` and `home-about.pug`.
-   The seams `head-extra.pug`, `feed-link.pug`, `nav-main.pug`, `footer-extra.pug`, `scripts-extra.pug`, `post-media.pug`, `card-media.pug`, `post-tags.pug`, `post-pagination.pug`, `tag-overview.pug` and `tag-cloud.pug`.
-   Type covers: a card without an `image` shows its first tag in large type, on a colour that follows its place in the list.
-   Tokens: the sixteen of the Nera themes plus `color.night`, `color.night_text`, `color.night_muted` and `color.highlight`. Keys `blog.featured_series`, `blog.highlight_tag` (not rendered by Stack), `author.name`, `author.bio`, `author.href`. Frontmatter `series`, `series_part`, `facts`.
-   `t()` keys: `Skip to content`, `Main navigation`, `Language`, `Legal`, `Latest post`, `Recent posts`, `All posts`, `Published`, `Updated`, `Series`, `Part`, `About the author`, `Read more`, `posts`.
-   Fonts: Bricolage Grotesque, Inter (upright and italic) and JetBrains Mono, variable, Latin and Latin Extended, from the `@fontsource-variable` packages 5.3.0, under the SIL Open Font License 1.1, in `assets/fonts/stack/` with their licence texts.
-   Optional peers, styled when present: `@nera-static/plugin-code-blocks` `^1.2.1`, `plugin-images` `^1.0.3`, `plugin-navigation` `^3.1.0`, `plugin-page-pagination` `^2.4.0`, `plugin-social-media-links` `^2.3.0`, `plugin-tags` `^3.4.1`.
