# Changelog

All notable changes to `@nera-static/theme-stack` are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the theme follows [semantic versioning](https://semver.org/) over its contract (see the README).

## [1.0.2] - 2026-11-24

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
