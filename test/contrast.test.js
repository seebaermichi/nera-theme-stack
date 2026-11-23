// §S15 "Contrast": the eight default pairs of §S2.7 and Stack's added pairs
// of §S13, computed from config/theme.yaml, each reach 4.5:1 (WCAG 2.2
// relative luminance) and match the ratios §S13 records.
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'

const { color } = loadYaml(path.join(ROOT, 'config', 'theme.yaml')).tokens

const luminance = (hex) => {
    const match = /^#([0-9a-f]{6})$/i.exec(hex)
    if (!match) throw new Error(`not a #rrggbb colour: ${hex}`)
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrast = (a, b) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (light + 0.05) / (dark + 0.05)
}

// [fg, bg, ratio recorded in §S13]
const PAIRS = [
    ['text', 'bg', 17.1],
    ['text', 'surface', 18.6],
    ['muted', 'bg', 6.1],
    ['muted', 'surface', 6.6],
    ['accent', 'bg', 4.9],
    ['accent', 'surface', 5.3],
    ['accent_text', 'accent', 5.3],
    ['focus', 'bg', 5.9],
    // Stack's added pairs
    ['night_text', 'night', 15.2],
    ['night_muted', 'night', 7.1],
    ['highlight', 'night', 14.5],
    ['text', 'highlight', 14.8],
]

describe('Contrast', () => {
    for (const [fg, bg, recorded] of PAIRS) {
        it(`${fg} on ${bg} reaches 4.5:1 (§S13: ${recorded})`, () => {
            const ratio = contrast(color[fg], color[bg])
            expect(ratio).toBeGreaterThanOrEqual(4.5)
            expect(Math.abs(ratio - recorded)).toBeLessThan(0.15)
        })
    }

    // The type covers carry their text in fixed colours (theme.css), not tokens.
    for (const [fg, bg] of [['#ffffff', '#2b50ff'], ['#101319', '#e4e7ec'], ['#101319', '#7fe3b4']]) {
        it(`cover text ${fg} on ${bg} reaches 4.5:1`, () => {
            expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5)
        })
    }
})
