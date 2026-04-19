import { useMemo, useRef, useState, useEffect } from 'react'
import { prepareWithSegments, layout, measureNaturalWidth } from '@chenglou/pretext'
import type { PreparedTextWithSegments } from '@chenglou/pretext'
import type {
  ContentBlock,
  TextBlock,
  ImageBlock,
  PageLayout,
  ParagraphEntry,
  PlacedBlock,
} from '../types/content'

export type { PageLayout }

export interface PaginationOptions {
  columnHeight: number
  columnWidth: number
  columnCount: number
  colGap?: number
  fontSize?: number
  lineHeightPx?: number
  paragraphGap?: number
  dropcapChar?: string
  dropcapFontStr?: string
  dropcapMarginRight?: number
  dropcapLines?: number
}

const FONT_WEIGHT = 300

export function usePagination(
  blocks: ContentBlock[],
  options: PaginationOptions,
): PageLayout[] {
  const {
    columnHeight,
    columnWidth,
    columnCount,
    colGap = 48,
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

  const prepCache = useRef(new Map<string, PreparedTextWithSegments>())
  const fontStr = `${FONT_WEIGHT} ${fontSize}px 'Work Sans'`

  function getPrepared(text: string): PreparedTextWithSegments {
    const key = `${fontStr}::${text}`
    if (!prepCache.current.has(key)) {
      prepCache.current.set(key, prepareWithSegments(text, fontStr))
    }
    return prepCache.current.get(key)!
  }

  return useMemo<PageLayout[]>(() => {
    if (
      !fontsReady ||
      blocks.length === 0 ||
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

    function measureParaHeight(para: string, isFirst: boolean): number {
      if (isFirst && dropcapPxWidth > 0 && dropcapLineCount > 0) {
        const textRest = para.slice(1)
        const narrowW = Math.max(1, columnWidth - dropcapPxWidth)
        const words = textRest.split(' ').filter(Boolean)
        let narrowWordCount = words.length
        for (let i = 1; i <= words.length; i++) {
          const { lineCount } = layout(getPrepared(words.slice(0, i).join(' ')), narrowW, lineHeightPx)
          if (lineCount > dropcapLineCount) { narrowWordCount = i - 1; break }
        }
        const wideText = words.slice(narrowWordCount).join(' ')
        const zone1H = dropcapLineCount * lineHeightPx
        const zone2H = wideText.trim() ? layout(getPrepared(wideText), columnWidth, lineHeightPx).height : 0
        return zone1H + zone2H
      }
      return layout(getPrepared(para), columnWidth, lineHeightPx).height
    }

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
        const { lineCount } = layout(getPrepared(words.slice(0, mid).join(' ')), measureW, lineHeightPx)
        if (lineCount <= linesAvailable) { bestSplit = mid; lo = mid + 1 } else { hi = mid - 1 }
      }
      if (bestSplit === 0) return null

      // Extend with syllables from first tail word
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
          if (lineCount <= linesAvailable) { bestSylIdx = s } else { break }
        }
        if (bestSylIdx > 0) {
          const head =
            words.slice(0, bestSplit).join(' ') +
            ' ' +
            syllables.slice(0, bestSylIdx).join('\u00AD') +
            '-'
          const tailRest = syllables.slice(bestSylIdx).join('\u00AD')
          const tail =
            tailRest +
            (words.length > bestSplit + 1 ? ' ' + words.slice(bestSplit + 1).join(' ') : '')
          return [head, tail]
        }
      }
      return [words.slice(0, bestSplit).join(' '), words.slice(bestSplit).join(' ')]
    }

    function computeBlockHeight(block: ContentBlock, blockWidth: number): number {
      if (block.type === 'image' || block.type === 'video') {
        const mediaH = Math.round(blockWidth * 9 / 16)
        const captionH = block.type === 'image' && block.caption ? 32 : 0
        return mediaH + captionH
      }
      if (block.type === 'highlight') return Math.round(lineHeightPx * 3.5 + 48)
      if (block.type === 'ad') return 250
      if (block.type === 'module') return 280
      return 200
    }

    function resolveBlockColSpan(block: ContentBlock, fromColIdx: number): number {
      const remaining = columnCount - fromColIdx
      const declared = (block as { columnSpan?: number }).columnSpan
      if (declared != null) return Math.min(Math.max(1, declared), remaining)
      if (block.type === 'image' || block.type === 'video') {
        return Math.min(columnCount >= 2 ? 2 : 1, remaining)
      }
      if (block.type === 'highlight') {
        return Math.min(columnCount >= 2 ? 2 : 1, remaining)
      }
      if (block.type === 'module') return remaining
      return Math.min(1, remaining)
    }

    // ── Page state ─────────────────────────────────────────────────────────
    const pages: PageLayout[] = []
    let firstTextPlaced = false

    // All let — mutated by flushPage / advanceColumn
    let colCursors: number[] = Array(columnCount).fill(0)
    let colParas: ParagraphEntry[][] = Array.from({ length: columnCount }, () => [])
    let curPageBlocks: PlacedBlock[] = []
    // reservations[c] = sorted {y, height} blocks that span through column c
    let reservations: Array<Array<{ y: number; height: number }>> =
      Array.from({ length: columnCount }, () => [])
    let curColIdx = 0

    function flushPage() {
      pages.push({
        columns: colParas.map((paras) => ({ paragraphs: paras })),
        blocks: curPageBlocks,
      })
      colCursors = Array(columnCount).fill(0)
      colParas = Array.from({ length: columnCount }, () => [])
      curPageBlocks = []
      reservations = Array.from({ length: columnCount }, () => [])
      curColIdx = 0
    }

    function advanceColumn() {
      curColIdx++
      if (curColIdx >= columnCount) flushPage()
    }

    // Advance cursor past any reservation overlapping it
    function skipReservations(colIdx: number) {
      let changed = true
      while (changed) {
        changed = false
        const cursor = colCursors[colIdx]
        for (const r of reservations[colIdx]) {
          if (r.y <= cursor && cursor < r.y + r.height) {
            colCursors[colIdx] = r.y + r.height
            changed = true
            break
          }
        }
      }
    }

    // Y where the current zone ends: start of next reservation above cursor, or columnHeight
    function zoneEnd(colIdx: number): number {
      const cursor = colCursors[colIdx]
      let nearest = columnHeight
      for (const r of reservations[colIdx]) {
        if (r.y > cursor && r.y < nearest) nearest = r.y
      }
      return nearest
    }

    // ── placeImage ──────────────────────────────────────────────────────────
    // Routes image blocks to the correct placement strategy based on
    // `block.placement` (explicit) or viewport defaults (implicit).
    function placeImage(block: ImageBlock) {
      const placement = block.placement ?? (columnCount >= 4 ? 'middle' : 'before')

      if (columnCount >= 4 && placement === 'full') {
        // Desktop full: cols 1–(N-1), variable height = full column height.
        // Text in col 0 fills beside it; cols 1+ are fully reserved.
        const colSpan = Math.min(3, columnCount - 1)
        const colStart = 1
        if (curColIdx > colStart) return  // already past — skip silently
        const blockWidth = colSpan * columnWidth + (colSpan - 1) * colGap
        curPageBlocks.push({ block, colStart, colSpan, y: 0, height: columnHeight, width: blockWidth })
        for (let c = colStart; c < colStart + colSpan && c < columnCount; c++) {
          reservations[c].push({ y: 0, height: columnHeight })
          reservations[c].sort((a, b) => a.y - b.y)
        }
        if (curColIdx >= colStart) skipReservations(curColIdx)

      } else if (columnCount >= 4 && placement === 'middle') {
        // Desktop middle: cols 1–2, 16:9, Y=0. Text in cols 0 and 3 wraps freely.
        const colSpan = Math.min(2, columnCount - 1)
        const colStart = 1
        if (curColIdx > colStart) return  // already past — skip silently
        const blockWidth = colSpan * columnWidth + (colSpan - 1) * colGap
        const blockHeight = computeBlockHeight(block, blockWidth)
        curPageBlocks.push({ block, colStart, colSpan, y: 0, height: blockHeight, width: blockWidth })
        for (let c = colStart; c < colStart + colSpan && c < columnCount; c++) {
          reservations[c].push({ y: 0, height: blockHeight })
          reservations[c].sort((a, b) => a.y - b.y)
        }
        if (curColIdx >= colStart) skipReservations(curColIdx)
        // curColIdx intentionally NOT advanced — col 0 keeps filling

      } else if (placement === 'before') {
        // Tablet/mobile: 16:9 full-width before text.
        // Flush to a fresh page if any content already exists.
        if (colParas.some((p) => p.length > 0) || curPageBlocks.length > 0) {
          flushPage()
        }
        const blockWidth = columnCount * columnWidth + (columnCount - 1) * colGap
        const blockHeight = computeBlockHeight(block, blockWidth)
        if (blockHeight > columnHeight) return  // too tall — skip
        curPageBlocks.push({ block, colStart: 0, colSpan: columnCount, y: 0, height: blockHeight, width: blockWidth })
        // Register in ALL columns, including col 0, then skip past it
        for (let c = 0; c < columnCount; c++) {
          reservations[c].push({ y: 0, height: blockHeight })
          reservations[c].sort((a, b) => a.y - b.y)
        }
        skipReservations(0)  // advances colCursors[0] to blockHeight

      } else {
        // 'after' or desktop image with non-default placement: stream position, full width
        placeGenericBlock(block)
      }
    }

    // ── placeGenericBlock ────────────────────────────────────────────────────
    // Stream-position block: placed at the current column cursor.
    // Text wraps above (already placed) and below (continues after block).
    function placeGenericBlock(block: ContentBlock) {
      const span = resolveBlockColSpan(block, curColIdx)
      const actualSpan = Math.min(span, columnCount - curColIdx)
      const blockWidth = actualSpan * columnWidth + (actualSpan - 1) * colGap
      const blockHeight = computeBlockHeight(block, blockWidth)

      skipReservations(curColIdx)
      let blockY = colCursors[curColIdx]

      if (blockY + blockHeight > columnHeight) {
        if (colParas[curColIdx].length > 0 || curColIdx > 0) {
          advanceColumn()
          skipReservations(curColIdx)
          blockY = colCursors[curColIdx]
        }
        if (blockHeight > columnHeight) return
      }

      curPageBlocks.push({ block, colStart: curColIdx, colSpan: actualSpan, y: blockY, height: blockHeight, width: blockWidth })
      colCursors[curColIdx] = blockY + blockHeight
      for (let c = curColIdx + 1; c < curColIdx + actualSpan && c < columnCount; c++) {
        reservations[c].push({ y: blockY, height: blockHeight })
        reservations[c].sort((a, b) => a.y - b.y)
      }
    }

    const queue = [...blocks]

    while (queue.length > 0) {
      skipReservations(curColIdx)

      // Column exhausted — advance
      if (colCursors[curColIdx] >= columnHeight) {
        advanceColumn()
        continue
      }

      const item = queue[0]

      if (item.type === 'text') {
        queue.shift()
        const para = (item as TextBlock).text
        const isFirst =
          !firstTextPlaced && pages.length === 0 && curColIdx === 0

        let placed = false

        for (let attempt = 0; !placed && attempt < columnCount * 6; attempt++) {
          skipReservations(curColIdx)

          if (colCursors[curColIdx] >= columnHeight) {
            advanceColumn()
            continue
          }

          const cursorY = colCursors[curColIdx]
          const end = zoneEnd(curColIdx)
          const available = end - cursorY
          const paraH = measureParaHeight(para, isFirst)

          if (paraH <= available) {
            colParas[curColIdx].push({ text: para, y: cursorY, isFirst, isSplitHead: false })
            colCursors[curColIdx] = cursorY + paraH + paragraphGap
            if (!firstTextPlaced) firstTextPlaced = true
            placed = true
          } else {
            const linesAvail = Math.round(available / lineHeightPx)
            const split = linesAvail >= 1 ? splitParagraph(para, linesAvail, isFirst) : null

            if (split) {
              const [head, tail] = split
              const headH = measureParaHeight(head, isFirst)
              colParas[curColIdx].push({ text: head, y: cursorY, isFirst, isSplitHead: true })
              colCursors[curColIdx] = cursorY + headH
              if (!firstTextPlaced) firstTextPlaced = true

              if (end < columnHeight) {
                // Hit a block reservation — skip past it
                colCursors[curColIdx] = end
                skipReservations(curColIdx)
                if (colCursors[curColIdx] >= columnHeight) advanceColumn()
              } else {
                advanceColumn()
              }
              queue.unshift({ type: 'text', id: (item as TextBlock).id, text: tail })
              placed = true
            } else {
              // Can't split — skip this zone or advance column
              if (end < columnHeight) {
                colCursors[curColIdx] = end
                skipReservations(curColIdx)
                if (colCursors[curColIdx] >= columnHeight) advanceColumn()
              } else if (colParas[curColIdx].length === 0) {
                // Force-place in empty column to prevent infinite loop
                colParas[curColIdx].push({ text: para, y: cursorY, isFirst, isSplitHead: false })
                colCursors[curColIdx] = cursorY + paraH + paragraphGap
                if (!firstTextPlaced) firstTextPlaced = true
                placed = true
              } else {
                advanceColumn()
              }
            }
          }
        }
      } else {
        // ── Float block ────────────────────────────────────────────────────
        queue.shift()

        if (item.type === 'image') {
          placeImage(item as ImageBlock)
        } else {
          placeGenericBlock(item)
        }
      }
    }

    if (colParas.some((p) => p.length > 0) || curPageBlocks.length > 0) {
      flushPage()
    }

    return pages
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blocks,
    fontsReady,
    columnHeight,
    columnWidth,
    columnCount,
    colGap,
    fontSize,
    lineHeightPx,
    paragraphGap,
    dropcapChar,
    dropcapFontStr,
    dropcapMarginRight,
    dropcapLineCount,
  ])
}

// ── Viewport helpers ───────────────────────────────────────────────────────

export function getColumnCount(viewportWidth: number): number {
  if (viewportWidth >= 2560) return 5
  if (viewportWidth >= 1280) return 4
  if (viewportWidth >= 768) return 2
  return 1
}

// ── First-line / glyph measurement helpers ─────────────────────────────────

const _lineCache = new Map<string, PreparedTextWithSegments>()

export function getCached(text: string, fontStr: string): PreparedTextWithSegments {
  const key = `${fontStr}::${text}`
  if (!_lineCache.has(key)) _lineCache.set(key, prepareWithSegments(text, fontStr))
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
  return measureNaturalWidth(getCached(char, fontStr))
}
