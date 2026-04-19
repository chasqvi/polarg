import { hyphenateSync } from 'hyphen/es'

/**
 * Inserts soft hyphens (\u00AD) at correct Spanish syllable boundaries
 * using Franklin M. Liang's algorithm with TeX-derived Spanish patterns.
 *
 * Passing the result to Pretext's prepare() means layout() will account for
 * the same break points the browser uses when rendering, keeping measurements
 * accurate. The browser only renders a visible '-' where a line actually breaks.
 *
 * minWordLength: 5 (library default) — words shorter than 5 chars are not
 * hyphenated, avoiding ugly breaks like "es-ta" or "un-o".
 */
export function addSoftHyphens(text: string): string {
  return hyphenateSync(text, { minWordLength: 5 })
}
