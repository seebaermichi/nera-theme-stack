// §S15 "Distinct" (replacing §S7's): the three blog themes'
// `tokens.font.heading` defaults differ from each other and from theme-blog's.
// Ansitz and Umwege are not built yet; their heading families are those of
// §S11.2.
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { OTHER_HEADING_FONTS } from './helpers/contract.js'

const heading = loadYaml(path.join(ROOT, 'config', 'theme.yaml')).tokens.font.heading
const first = (stack) => stack.split(',')[0].trim().replace(/^'|'$/g, '')

describe('Distinct', () => {
    it('names Bricolage Grotesque first', () => {
        expect(first(heading)).toBe('Bricolage Grotesque')
    })

    it('differs from theme-blog\'s heading font and from Ansitz\'s and Umwege\'s families', () => {
        expect(heading).not.toBe(OTHER_HEADING_FONTS.blog)
        expect(first(heading)).not.toBe(first(OTHER_HEADING_FONTS.blog))
        expect(first(heading)).not.toBe(OTHER_HEADING_FONTS.ansitz)
        expect(first(heading)).not.toBe(OTHER_HEADING_FONTS.umwege)
    })
})
