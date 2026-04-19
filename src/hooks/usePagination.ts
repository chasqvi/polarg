import { useMemo, useRef, useState, useEffect } from 'react'
import { prepare, layout, measureNaturalWidth } from '@chenglou/pretext'
import type { PreparedText } from '@chenglou/pretext'

export interface PageLayout {
  /** columns[colIndex] = array of paragraph strings for that column */
  columns: string[][]
  /**
   * colSplitHead[i] is true when the last paragraph in column i is a split head —
   * i.e., the paragraph continues in the next column/page. The renderer uses this
   * to suppress marginBottom on that paragraph so the paginator and rendered heights match.
   */
  colSplitHead: boolean[]
}

export interface PaginationOptions {
  /** Total available height for the text body (header/footer already excluded) */
  columnHeight: number
  /** Width of a single column in pixels */
  columnWidth: number
  /** Number of columns per page */
  columnCount: number
  /** Font size in px */
  fontSize?: number
  /** Line height in px (absolute, not multiplier) */
  lineHeightPx?: number
  /** Gap between paragraphs in px */
  paragraphGap?: number
  /**
   * Dropcap options — when set, the first paragraph is measured with dropcap-aware
   * geometry. The dropcap character floats left, narrowing the first few lines of
   * the paragraph. Without this correction, Pretext measures paragraph 0 at full
   * columnWidth and underestimates its rendered height.
   */
  dropcapChar?: string
  dropcapFontStr?: string
  dropcapMarginRight?: number
  dropcapLines?: number
}

const FONT_WEIGHT = 300

export function usePagination(
  paragraphs: string[],
  options: PaginationOptions,
): PageLayout[] {
  const {
    columnHeight,
    columnWidth,
    columnCount,
    fontSize = 18,
    lineHeightPx = 18 * 1.7,
    paragraphGap = 24,
    dropcapChar = '',
    dropcapFontStr = '',
    dropcapMarginRight = 7,
    dropcapLines: dropcapLineCount = 0,
  } = options

  const [fontsReady, setFontsReady] = useState(
    () => typeof document !== 'undefined' && document.fonts.status === 'loaded',
  )
  useEffect(() => {
    if (fontsReady) return
    document.fonts.ready.then(() => setFontsReady(true))
  }, [fontsReady])

  // Cache PreparedText by `fontStr::text`. Soft hyphens (\u00AD) are intentionally
  // kept in the text passed to prepare() — Pretext handles them as optional break
  // points, exactly as the browser does. Stripping them would cause Pretext to
  // predict different line breaks than the browser, degrading measurement accuracy.
  const prepCache = useRef(new Map<string, PreparedText>())
  const fontStr = `${FONT_WEIGHT} ${fontSize}px 'Work Sans'`

  function getPrepared(text: string): PreparedText {
    const key = `${fontStr}::${text}`
    if (!prepCache.current.has(key)) {
      prepCache.current.set(key, prepare(text, fontStr))
    }
    return prepCache.current.get(key)!
  }

  return useMemo<PageLayout[]>(() => {
    if (
      !fontsReady ||
      paragraphs.length === 0 ||
      columnHeight <= 0 ||
      columnWidth <= 0 ||
      columnCount < 1
    ) {
      return []
    }

    // ── Dropcap geometry ───────────────────────────────────────────────────
    const dropcapPxWidth =
      dropcapChar && dropcapFontStr
        ? measureNaturalWidth(getCached(dropcapChar, dropcapFontStr)) + dropcapMarginRight
        : 0

    // ── measureParaHeight ──────────────────────────────────────────────────
    // Returns paragraph height in px. For the first paragraph (isFirst=true),
    // uses a two-zone model to account for the dropcap float:
    //   Zone 1 — narrow lines wrapping around the dropcap
    //   Zone 2 — full-width lines below the dropcap
    function measureParaHeight(para: string, isFirst: boolean): number {
      if (isFirst && dropcapPxWidth > 0 && dropcapLineCount > 0) {
        const textRest = para.slice(1)
        const narrowW = Math.max(1, columnWidth - dropcapPxWidth)
        const words = textRest.split(' ').filter(Boolean)

        // Find how many words fit within dropcapLineCount narrow lines.
        // layout().lineCount gives the exact line count without float rounding.
        let narrowWordCount = words.length
        for (let i = 1; i <= words.length; i++) {
          const { lineCount } = layout(
            getPrepared(words.slice(0, i).join(' ')),
            narrowW,
            lineHeightPx,
          )
          if (lineCount > dropcapLineCount) {
            narrowWordCount = i - 1
            break
          }
        }

        const wideText = words.slice(narrowWordCount).join(' ')
        const zone1H = dropcapLineCount * lineHeightPx
        const zone2H = wideText.trim()
          ? layout(getPrepared(wideText), columnWidth, lineHeightPx).height
          : 0
        return zone1H + zone2H
      }
      return layout(getPrepared(para), columnWidth, lineHeightPx).height
    }

    // ── splitParagraph ─────────────────────────────────────────────────────
    // Binary search for the last word boundary where the head fits in
    // `linesAvailable` lines. Uses layout().lineCount directly — more accurate
    // than dividing height by lineHeightPx (avoids floating-point drift).
    function splitParagraph(
      para: string,
      linesAvailable: number,
      isFirst: boolean,
    ): [string, string] | null {
      if (linesAvailable < 1) return null
      const words = para.split(' ')
      if (words.length <= 1) return null

      const measureW =
        isFirst && dropcapPxWidth > 0
          ? Math.max(1, columnWidth - dropcapPxWidth)
          : columnWidth

      let lo = 1, hi = words.length - 1, bestSplit = 0
      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        const { lineCount } = layout(
          getPrepared(words.slice(0, mid).join(' ')),
          measureW,
          lineHeightPx,
        )
        if (lineCount <= linesAvailable) {
          bestSplit = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }
      if (bestSplit === 0) return null

      // Try to extend the head with syllables from the first tail word.
      // words[bestSplit] is the first word that didn't fit at the word level.
      // If it contains soft hyphens, try fitting one more syllable at a time.
      const firstTailWord = words[bestSplit]
      const syllables = firstTailWord.split('\u00AD')
      if (syllables.length > 1) {
        let bestSylIdx = 0
        for (let s = 1; s < syllables.length; s++) {
          const candidate =
            words.slice(0, bestSplit).join(' ') +
            ' ' +
            syllables.slice(0, s).join('\u00AD') +
            '-'
          const { lineCount } = layout(getPrepared(candidate), measureW, lineHeightPx)
          if (lineCount <= linesAvailable) {
            bestSylIdx = s
          } else {
            break
          }
        }
        if (bestSylIdx > 0) {
          const head =
            words.slice(0, bestSplit).join(' ') +
            ' ' +
            syllables.slice(0, bestSylIdx).join('\u00AD') +
            '-'
          const tailRest = syllables.slice(bestSylIdx).join('\u00AD')
          const tail =
            (tailRest ? tailRest : '') +
            (words.length > bestSplit + 1 ? ' ' + words.slice(bestSplit + 1).join(' ') : '')
          return [head, tail]
        }
      }

      return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')]
    }

    const pages: PageLayout[] = []
    let curColumns: string[][] = Array.from({ length: columnCount }, () => [])
    // Tracks which columns on the current page end in a split head.
    let curColSplitHead: boolean[] = Array(columnCount).fill(false)
    let curColIdx = 0
    let curColHeight = 0

    const queue = [...paragraphs]
    const originalFirstPara = queue[0]
    let qi = 0

    while (qi < queue.length) {
      const para = queue[qi++]
      const isFirst = para === originalFirstPara && pages.length === 0 && curColIdx === 0

      const paraH = measureParaHeight(para, isFirst)
      // totalBlockHeight includes the paragraph gap that follows this paragraph.
      // The gap is NOT added for split heads (they end the column — no gap needed).
      const totalBlockHeight = paraH + paragraphGap
      const remainingHeight = columnHeight - curColHeight

      if (paraH <= remainingHeight || curColumns[curColIdx].length === 0) {
        curColumns[curColIdx].push(para)
        curColHeight += totalBlockHeight
        // A complete paragraph clears any previous split-head mark on this column.
        curColSplitHead[curColIdx] = false
      } else {
        // Paragraph overflows. Try to split at a word boundary.
        // Math.round instead of Math.floor: floor can leave up to (lineHeightPx - 1)px
        // of blank space at the column bottom. Rounding allows at most 0.5×lineHeight
        // overflow, which is absorbed by the 28px bottom padding (PAD_V) and never
        // visible. This fills columns tightly without clipping text.
        const linesAvailable = Math.round(remainingHeight / lineHeightPx)
        const split = splitParagraph(para, linesAvailable, isFirst)

        if (split) {
          const [head, tail] = split
          const headH = measureParaHeight(head, isFirst)
          curColumns[curColIdx].push(head)
          curColHeight += headH
          curColSplitHead[curColIdx] = true  // head ends this column, no margin after it

          curColIdx++
          if (curColIdx >= columnCount) {
            pages.push({ columns: curColumns, colSplitHead: curColSplitHead })
            curColumns = Array.from({ length: columnCount }, () => [])
            curColSplitHead = Array(columnCount).fill(false)
            curColIdx = 0
          }
          curColHeight = 0
          queue.splice(qi, 0, tail)
        } else {
          // Can't split — move whole paragraph to next column.
          curColIdx++
          if (curColIdx >= columnCount) {
            pages.push({ columns: curColumns, colSplitHead: curColSplitHead })
            curColumns = Array.from({ length: columnCount }, () => [])
            curColSplitHead = Array(columnCount).fill(false)
            curColIdx = 0
          }
          curColHeight = 0
          queue.splice(qi, 0, para)
        }
      }
    }

    if (curColumns.some((col) => col.length > 0)) {
      pages.push({ columns: curColumns, colSplitHead: curColSplitHead })
    }

    return pages
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paragraphs,
    fontsReady,
    columnHeight,
    columnWidth,
    columnCount,
    fontSize,
    lineHeightPx,
    paragraphGap,
    dropcapChar,
    dropcapFontStr,
    dropcapMarginRight,
    dropcapLineCount,
  ])
}

// ---------------------------------------------------------------------------
// Viewport helpers
// ---------------------------------------------------------------------------

export function getColumnCount(viewportWidth: number): number {
  if (viewportWidth >= 2560) return 5
  if (viewportWidth >= 1280) return 4
  if (viewportWidth >= 768) return 2
  return 1
}

// ---------------------------------------------------------------------------
// First-line measurement helpers
// ---------------------------------------------------------------------------

const _lineCache = new Map<string, PreparedText>()

export function getCached(text: string, fontStr: string): PreparedText {
  const key = `${fontStr}::${text}`
  if (!_lineCache.has(key)) _lineCache.set(key, prepare(text, fontStr))
  return _lineCache.get(key)!
}

export interface FirstLineMeasurement {
  chars: number
  addHyphen: boolean
}

export function measureFirstLine(
  text: string,
  availableWidth: number,
  fontStr: string,
  lineHeightPx: number,
): FirstLineMeasurement {
  const fits = (meas: string) =>
    layout(getCached(meas, fontStr), availableWidth, lineHeightPx).lineCount <= 1

  if (availableWidth <= 0 || !text) return { chars: text.length, addHyphen: false }

  const words = text.split(' ')
  let origLine = ''
  let measLine = ''

  for (const word of words) {
    const measWord = word.replace(/\u00AD/g, '').toUpperCase()
    const measCandidate = measLine ? `${measLine} ${measWord}` : measWord
    const origCandidate = origLine ? `${origLine} ${word}` : word

    if (!fits(measCandidate)) {
      if (!origLine) return { chars: origCandidate.length, addHyphen: false }

      const syllables = word.split('\u00AD')
      if (syllables.length > 1) {
        let lastGoodChars = origLine.length
        let lastAddHyphen = false
        for (let s = 0; s < syllables.length - 1; s++) {
          const measChunk = syllables.slice(0, s + 1).join('').toUpperCase() + '-'
          const measFull = measLine ? `${measLine} ${measChunk}` : measChunk
          const origChunk = syllables.slice(0, s + 1).join('\u00AD')
          const origFull = origLine ? `${origLine} ${origChunk}` : origChunk
          if (!fits(measFull)) break
          lastGoodChars = origFull.length
          lastAddHyphen = true
        }
        return { chars: lastGoodChars, addHyphen: lastAddHyphen }
      }

      return { chars: origLine.length, addHyphen: false }
    }

    origLine = origCandidate
    measLine = measCandidate
  }

  return { chars: origLine.length, addHyphen: false }
}

export function measureGlyphWidth(char: string, fontStr: string): number {
  const prepared = getCached(char, fontStr)
  return measureNaturalWidth(prepared)
}
