// The theme's contract as ROADMAP-themes.md states it (§S2, §S4, §S10–§S13
// with the Revision of 2026-11-23), in one place for the tests.

export const VIEWS = [
    'layouts/layout.pug',
    'partials/head.pug',
    'partials/tokens.pug',
    'partials/helpers.pug',
    'partials/header.pug',
    'partials/lang-switch.pug',
    'partials/footer.pug',
    'partials/scripts.pug',
    // extra partials, contract too (README): as theme-blog, plus the two
    // home blocks of Revision R3
    'partials/page-header.pug',
    'partials/post-card.pug',
    'partials/home-series.pug',
    'partials/home-about.pug',
]

// §S2.4 and §S4.2; Revision R2 withdraws `hero-media` and `thumb-media` for Stack.
export const SEAMS = [
    'partials/head-extra.pug',
    'partials/nav-main.pug',
    'partials/footer-extra.pug',
    'partials/scripts-extra.pug',
    'partials/post-media.pug',
    'partials/card-media.pug',
    'partials/post-tags.pug',
    'partials/post-pagination.pug',
    'partials/tag-overview.pug',
    'partials/tag-cloud.pug',
    'partials/feed-link.pug',
]

export const WITHDRAWN_SEAMS = ['partials/hero-media.pug', 'partials/thumb-media.pug']

export const PAGE_TYPES = ['default', 'home', 'post', 'archive', 'tag']

export const BLOCKS = ['head', 'header', 'main', 'footer', 'scripts']

export const HELPERS = ['pageLang', 'sameLang', 'homeHref', 'formatDate', 'isoDate', 'hrefFor']

export const TOKENS = {
    color: ['bg', 'surface', 'text', 'muted', 'accent', 'accent_text', 'border', 'focus', 'night', 'night_text', 'night_muted', 'highlight'],
    font: ['body', 'heading', 'mono'],
    size: ['base', 'measure', 'width', 'radius', 'space'],
}

// §S13 defaults for Stack.
export const TOKEN_DEFAULTS = {
    color: {
        bg: '#f4f5f7',
        surface: '#ffffff',
        text: '#101319',
        muted: '#555d6b',
        accent: '#d02408',
        accent_text: '#ffffff',
        border: '#d9dde4',
        focus: '#1d4fe0',
        night: '#12151c',
        night_text: '#e7eaf0',
        night_muted: '#98a2b3',
        highlight: '#d8f24a',
    },
    size: { base: '1.0625rem', measure: '46rem', width: '73rem', radius: '0', space: '1.5rem' },
}

export const THEME_KEYS = ['label', 'tokens', 'extra_css', 'footer_links', 'blog', 'author']

export const T_KEYS = [
    // shared (§S2.6)
    'Skip to content',
    'Main navigation',
    'Language',
    'Legal',
    // theme-blog (§S4.3)
    'Recent posts',
    'All posts',
    'Published',
    'Updated',
    // Revision R3
    'Latest post',
    'Series',
    'Part',
    'About the author',
    'Read more',
    'posts',
]

export const SHELL_CLASSES = [
    'skip-link',
    'site-header',
    'site-header__inner',
    'site-header__brand',
    'site-header__nav',
    'lang-switch',
    'lang-switch__list',
    'lang-switch__item',
    'lang-switch__link',
    'site-main',
    'page__header',
    'page__title',
    'page__lead',
    'page__body',
    'site-footer',
    'site-footer__inner',
    'site-footer__legal',
    'site-footer__copy',
]

// §S4.6, as theme-blog.
export const BLOG_CLASSES = [
    'post',
    'post__header',
    'post__title',
    'post__meta',
    'post__date',
    'post__updated',
    'post__author',
    'post__lead',
    'post__media',
    'post__image',
    'post__body',
    'post__footer',
    'post__tags',
    'post__pagination',
    'post-list',
    'post-list__title',
    'post-list__items',
    'post-list__item',
    'post-list__more',
    'post-card',
    'post-card__media',
    'post-card__image',
    'post-card__title',
    'post-card__link',
    'post-card__date',
    'post-card__excerpt',
    'post-archive__year',
    'post-archive__list',
    'post-archive__item',
    'tag-page',
]

// §S12 as far as Stack renders it after Revision R3 (no reading time, no
// location, no post-nav, no author classes), plus the classes Stack adds
// (post-card__body, post__series, the two marks).
export const STACK_CLASSES = [
    'home-hero',
    'home-hero__inner',
    'home-hero__title',
    'home-hero__lead',
    'home-hero__actions',
    'home-hero__aside',
    'button',
    'button--primary',
    'post-card--featured',
    'post-card__body',
    'post-card__meta',
    'post-card__cover',
    'post-card__cover--red',
    'post-card__cover--night',
    'post-card__cover--lime',
    'post-card__cover--paper',
    'post-card__cover--blue',
    'post-card__cover--mint',
    'post__series',
    'post-author',
    'post-author__mark',
    'post-author__name',
    'post-facts',
    'post-facts__item',
    'post-facts__label',
    'post-facts__value',
    'post-series',
    'post-series__title',
    'post-series__list',
    'post-series__item',
    'post-series__item--current',
    'home-series',
    'home-about',
    'home-about__mark',
    'home-about__links',
    'post-archive__count',
]

// Computed in post-card.pug (`post-card__cover--${tone}`), so matched by
// the tone list in helpers.pug instead of a literal.
export const COMPUTED_CLASSES = [
    'post-card__cover--red',
    'post-card__cover--night',
    'post-card__cover--lime',
    'post-card__cover--paper',
    'post-card__cover--blue',
    'post-card__cover--mint',
]

// Withdrawn by Revision R2/R3: must not appear in views/ or theme.css.
export const WITHDRAWN_CLASSES = ['callout', 'duo', 'bw', 'post-nav', 'post-card__reading-time', 'post__reading-time', 'post-thumb__image']

export const PUBLIC_CLASSES = [...SHELL_CLASSES, ...BLOG_CLASSES, ...STACK_CLASSES]

// The plugins Stack styles, with the peer floors (§S11.1, Revision R5).
export const PLUGIN_CLASSES = {
    '@nera-static/plugin-tags': {
        range: '^3.4.1',
        classes: [
            'tag-cloud',
            'tag-cloud__item',
            'tag-links',
            'tag-links__item',
            'tag-overview',
            'tag-overview__header',
            'tag-overview__title',
            'tag-overview__image',
            'tag-overview__content',
            'tag-overview__item',
            'tag-overview__item-title',
            'tag-overview__item-date',
            'tag-overview__item-description',
            'tag-overview__item-link',
        ],
    },
    '@nera-static/plugin-page-pagination': {
        range: '^2.4.0',
        classes: [
            'page-pagination',
            'page-pagination__link',
            'page-pagination__link--previous',
            'page-pagination__link--next',
        ],
    },
    '@nera-static/plugin-code-blocks': {
        range: '^1.2.1',
        classes: ['nera-code', 'nera-code-scope', 'nera-code__bar', 'nera-code__title', 'nera-code__pre', 'hljs-addition', 'hljs-deletion'],
    },
    '@nera-static/plugin-images': {
        range: '^1.0.3',
        classes: ['nera-image', 'nera-image__caption'],
    },
    '@nera-static/plugin-navigation': {
        range: '^3.1.0',
        classes: ['nav', 'nav--list', 'nav__item', 'nav__link', 'nav__link--active', 'nav__link--active-path'],
    },
    '@nera-static/plugin-social-media-links': {
        range: '^2.3.0',
        classes: [
            'social-media-links',
            'social-media-links__list',
            'social-media-links__item',
            'social-media-links__link',
            'social-media-links__icon',
            'social-media-links__label',
        ],
    },
    '@nera-static/plugin-search': {
        range: '^2.3.1',
        // search__title is not styled: the fixture's search page brings its
        // own page header and sets show_title: false.
        classes: ['search', 'search__input', 'search__results', 'search__item', 'search__link', 'search__description', 'search__highlight'],
    },
}

// plugin-code-blocks' custom properties on .nera-code: the tokens of the
// dark code panels (§S13: "dark panels for code").
export const CODE_MAPPING = {
    '--nera-code-bg': 'var(--theme-color-night',
    '--nera-code-ink': 'var(--theme-color-night-text',
    '--nera-code-muted': 'var(--theme-color-night-muted',
    '--nera-code-font': 'var(--theme-font-mono',
    '--nera-code-radius': 'var(--theme-size-radius',
}

// The other themes' heading fonts, for "Distinct" (§S15).
export const OTHER_HEADING_FONTS = {
    blog: 'system-ui, -apple-system, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif',
    ansitz: 'Instrument Serif',
    umwege: 'Fraunces',
}
