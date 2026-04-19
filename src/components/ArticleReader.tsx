import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { TagBreadcrumb } from './TagBreadcrumb'
import { usePagination, getColumnCount } from '../hooks/usePagination'
import { addSoftHyphens } from '../lib/hyphenate'
import type { Article } from '../types/database'

// ── DROPCAP CONSTANTS ─────────────────────────────────────────────────────
// A dropcap spans exactly 3 text lines. The math accounts for Work Sans 300
// at 18px body / 1.7 line-height:
//   lineHeightPx = 18 × 1.7 = 30.6px
//   3 lines = 91.8px total height
//   Work Sans cap height ≈ 0.72 × em → fontSize = 91.8 / 0.72 ≈ 128px
// DROPCAP_LINE_HEIGHT 0.81 compensates for the font's internal leading so
// the cap's baseline lands exactly on the 3rd text line's baseline.
const DROPCAP_SIZE = 112
const DROPCAP_LINE_HEIGHT = 0.81

// ── DROPCAP COMPONENT ─────────────────────────────────────────────────────
// Renders the first character of the article's opening paragraph as a
// large float-left initial capital — standard print editorial convention.
// aria-hidden: the full paragraph text is also rendered in a .sr-only span
// so screen readers don't read the dropcap letter twice.
function Dropcap({ char }: { char: string }) {
  return (
    <span
      aria-hidden
      style={{
        // float: left is the CSS primitive for print-style dropcaps —
        // it pulls the letter out of flow and wraps subsequent lines around it.
        float: 'left',
        fontFamily: 'var(--font)',
        fontWeight: 900,                           // Black weight — maximum contrast with body (Light 300)
        fontSize: `${DROPCAP_SIZE}px`,             // 110px — see constant derivation above
        lineHeight: DROPCAP_LINE_HEIGHT,           // 0.81 — aligns baseline to 3rd text line
        color: 'var(--color-celeste)',              // matches first-line allcaps color
        marginRight: '7px',                        // gap between dropcap and text column
        marginTop: '0px',                          // fine-tunes vertical alignment with cap-height
        userSelect: 'none',                        // prevents accidental text selection of the dropcap
      }}
    >
      {char}
    </span>
  )
}

// HeadlineText applies the same Black+Regular mixed-weight rendering as
// ArticleCard — see that file for the full explanation.
function HeadlineText({ title }: { title: string }) {
  const parts = title.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} style={{ fontWeight: 900 }}>{part.slice(2, -2)}</span>
        }
        return <span key={i} style={{ fontWeight: 400 }}>{part}</span>
      })}
    </>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── PAGE TRANSITION VARIANTS ──────────────────────────────────────────────
// Framer Motion variants for the horizontal slide between pages.
// dir > 0 → moving forward: new page enters from right, old exits to left.
// dir < 0 → moving backward: new page enters from left, old exits to right.
// This mirrors the physical metaphor of flipping book pages left ↔ right.
const pageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
}

// Cubic bezier [0.25, 0.1, 0.25, 1] is the CSS "ease" standard curve —
// fast start, smooth deceleration. 0.3s feels snappy without being jarring.
const pageTransition = { type: 'tween' as const, ease: [0.25, 0.1, 0.25, 1] as const, duration: 0.3 }

// ── TYPOGRAPHY CONSTANTS ──────────────────────────────────────────────────
// These drive both the visual rendering AND the Pretext pagination engine.
// If you change any of these, usePagination must receive the updated values
// or pages will be miscalculated (text will overflow or under-fill pages).
const FONT_SIZE = 18                              // body text size in px
const LINE_HEIGHT_PX = FONT_SIZE * 1.7            // 30.6px — generous for long-form reading
const PARA_GAP = 24                               // vertical gap between paragraphs in px
const COL_GAP = 48                                // horizontal gap between columns in px
// Padding of the page content div — must be subtracted from bodySize before
// passing to usePagination, otherwise the paginator fits more lines than are
// actually visible and text overflows under the footer.
const PAD_V = 28                                  // top + bottom padding (px each side)
const PAD_H = 32                                  // left + right padding (px each side)

// Dropcap geometry — kept in sync with the Dropcap component below.
// These are also passed to usePagination so the paginator can measure
// paragraph 0 correctly (its first lines are narrowed by the float dropcap).
const DROPCAP_FONT_STR = `900 ${DROPCAP_SIZE}px 'Work Sans'`
// Number of body-text lines the dropcap spans vertically:
//   dropcap rendered height = DROPCAP_SIZE × DROPCAP_LINE_HEIGHT = 112 × 0.81 = 90.72px
//   lines = ceil(90.72 / 30.6) = 3
const DROPCAP_LINE_COUNT = Math.ceil((DROPCAP_SIZE * DROPCAP_LINE_HEIGHT) / LINE_HEIGHT_PX)
const DROPCAP_MARGIN_RIGHT = 7                    // px gap between dropcap glyph and text

interface ArticleReaderProps {
  article: Article
  /** 0-indexed page from URL — source of truth */
  currentPage: number
  onPageChange: (page: number) => void
  onClose: () => void
}

export function ArticleReader({ article, currentPage, onPageChange, onClose }: ArticleReaderProps) {
  // localPage drives all animation/rendering immediately.
  // currentPage (from URL) only syncs it back when browser back/forward fires.
  const [localPage, setLocalPage] = useState(currentPage)
  const [direction, setDirection] = useState<1 | -1>(1)

  // Sync from URL prop — React's "setState during render" derived-state pattern.
  // Storing prevCurrentPage as state (not a ref) avoids any ref mutation during
  // render. React re-renders synchronously once more; children never see stale state.
  const [prevCurrentPage, setPrevCurrentPage] = useState(currentPage)
  if (currentPage !== prevCurrentPage) {
    setPrevCurrentPage(currentPage)
    setDirection(currentPage > prevCurrentPage ? 1 : -1)
    setLocalPage(currentPage)
  }

  const bodyRef = useRef<HTMLDivElement>(null)
  const [bodySize, setBodySize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setBodySize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const columnCount = getColumnCount(bodySize.width)
  const columnWidth =
    bodySize.width > 0
      ? Math.floor((bodySize.width - PAD_H * 2 - COL_GAP * (columnCount - 1)) / columnCount)
      : 0

  const paragraphs = useMemo(
    () =>
      (article.content ?? '')
        .split('\n\n')
        .filter((p) => p.trim().length > 0)
        .map(addSoftHyphens),
    [article.content],
  )

  const dropcapChar = paragraphs[0]?.[0] ?? ''

  const pages = usePagination(paragraphs, {
    columnHeight: bodySize.height - PAD_V * 2,
    columnWidth,
    columnCount,
    fontSize: FONT_SIZE,
    lineHeightPx: LINE_HEIGHT_PX,
    paragraphGap: PARA_GAP,
    dropcapChar,
    dropcapFontStr: DROPCAP_FONT_STR,
    dropcapMarginRight: DROPCAP_MARGIN_RIGHT,
    dropcapLines: DROPCAP_LINE_COUNT,
  })

  // Stable refs — event listeners attach once and always read the latest value.
  // Mutations happen in useEffect (after render) to satisfy the react-hooks/refs rule.
  const totalPagesRef = useRef(0)
  const localPageRef = useRef(localPage)
  useEffect(() => { totalPagesRef.current = pages.length })
  useEffect(() => { localPageRef.current = localPage })

  const goNext = useCallback(() => {
    const next = localPageRef.current + 1
    if (next >= totalPagesRef.current) return
    setDirection(1)
    setLocalPage(next)
    onPageChange(next)
  }, [onPageChange])

  const goPrev = useCallback(() => {
    const prev = localPageRef.current - 1
    if (prev < 0) return
    setDirection(-1)
    setLocalPage(prev)
    onPageChange(prev)
  }, [onPageChange])

  // All event listeners use a single ref so they attach once and never stale-close
  const actionsRef = useRef({ goNext, goPrev, onClose })
  useEffect(() => { actionsRef.current = { goNext, goPrev, onClose } })

  // Keyboard — attached once
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { actionsRef.current.onClose(); return }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); actionsRef.current.goNext()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); actionsRef.current.goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Wheel — attached once, one scroll = one page turn
  useEffect(() => {
    let locked = false
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (locked) return
      locked = true
      if (e.deltaY > 0) actionsRef.current.goNext()
      else actionsRef.current.goPrev()
      setTimeout(() => { locked = false }, 600)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // Touch — attached once
  useEffect(() => {
    let startY = 0, startX = 0
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY; startX = e.touches[0].clientX }
    const onEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY
      const dx = startX - e.changedTouches[0].clientX
      const t = 40
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > t) actionsRef.current.goNext()
        else if (dy < -t) actionsRef.current.goPrev()
      } else {
        if (dx > t) actionsRef.current.goNext()
        else if (dx < -t) actionsRef.current.goPrev()
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [])

  const currentPageData = pages[localPage]

  return (
    // ── READER ROOT ───────────────────────────────────────────────────────
    // The reader fills its parent container (the fixed inset box in App.tsx).
    // overflow: hidden is critical — the page slide animation temporarily
    // positions content at x: ±100%, which would create a scrollbar without it.
    // position: relative creates a stacking context for the absolute page layers.
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',                   // header / body / footer stacked vertically
        height: '100%',                            // fills the fixed inset frame from App.tsx
        background: 'var(--color-blanco)',
        overflow: 'hidden',                        // clips Framer Motion slide transitions
        position: 'relative',                      // stacking context for absolute children
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────
          Contains: tag breadcrumb, article title, byline, and close button.
          flexShrink: 0 prevents the header from compressing when the body
          area is under height pressure. borderBottom visually separates the
          fixed header from the scrollable (actually paginated) body.
          padding: 20px 32px 16px — slightly less bottom padding because the
          title's line-height already provides visual spacing above the body.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px 32px 16px',
          borderBottom: '1px solid var(--color-gris)',
          flexShrink: 0,                           // never shrinks — always full height
          display: 'flex',
          alignItems: 'flex-start',                // top-aligns title and close button
          gap: '16px',
        }}
      >
        {/* Title area takes all remaining width; minWidth: 0 allows flex
            children to truncate/wrap properly (without it, the flex item
            would overflow its parent instead of wrapping). */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '10px' }}>
            <TagBreadcrumb tags={article.tags} size="sm" />
          </div>

          {/* ── Article title in header ────────────────────────────────
              clamp(22px, 2.5vw, 38px): narrower range than the card
              headline because the reader is always in an inset frame.
              lineHeight 1.1 + letterSpacing -0.025em = standard display
              type treatment for editorial headlines.
          ──────────────────────────────────────────────────────────── */}
          <h1
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 400,
              fontSize: 'clamp(22px, 2.5vw, 38px)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'var(--color-negro)',
            }}
          >
            <HeadlineText title={article.title} />
          </h1>

          {/* ── Byline (author + date) ──────────────────────────────────
              Same caption style as ArticleCard: 11px uppercase, 0.1em
              tracking, fontWeight 600. 0.35 alpha keeps it clearly
              subordinate to the title above.
          ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              marginTop: '8px',
              fontFamily: 'var(--font)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.35)',
              display: 'flex',
              gap: '12px',
            }}
          >
            {article.author && <span>{article.author}</span>}
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
          </div>
        </div>

        {/* ── Close button ────────────────────────────────────────────────
            36×36px circle — large enough to tap on mobile (44px is ideal,
            36px is acceptable for a close button that's rarely needed).
            flexShrink: 0 prevents it from being squashed when the title
            is very long.
            Hover state is applied via onMouseEnter/Leave because CSS
            pseudo-classes can't be used with inline styles — we directly
            mutate the element's style property for the transition.
            transition: 'background 0.15s' is set in the initial style so
            the animation plays on both enter AND leave.
        ─────────────────────────────────────────────────────────────────── */}
        <button
          onClick={onClose}
          aria-label="Cerrar artículo"
          style={{
            flexShrink: 0,
            width: '36px',
            height: '36px',
            borderRadius: '50%',                   // perfect circle
            border: '1px solid var(--color-gris)', // subtle ring, matches divider lines
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',        // smooth fill on hover
            background: 'transparent',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F0F0F0' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <X size={15} color="var(--color-negro)" />
        </button>
      </div>

      {/* ── COLUMN BODY ────────────────────────────────────────────────────
          This div is measured by ResizeObserver — its dimensions feed the
          pagination engine. overflow: hidden clips page slide animations.
          position: relative is the containing block for the absolute page
          layers inside AnimatePresence.
          flexGrow: 1 makes this area fill all remaining height between
          the header and footer.
      ─────────────────────────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence initial={false} custom={direction} mode="sync">
          {currentPageData ? (
            // ── Page layer ───────────────────────────────────────────────
            // position: absolute + inset: 0 makes every page fill the
            // body exactly. mode="wait" in AnimatePresence ensures the
            // exiting page fully leaves before the entering page appears,
            // preventing z-index collisions during the slide.
            <motion.div
              key={localPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              style={{
                position: 'absolute',
                inset: 0,                          // fills parent exactly (shorthand for top/right/bottom/left: 0)
                padding: `${PAD_V}px ${PAD_H}px`,
                // CSS Grid creates the multi-column layout.
                // repeat(${columnCount}, 1fr) distributes columns equally.
                // columnCount is derived from viewport width by getColumnCount().
                display: 'grid',
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: `0 ${COL_GAP}px`,             // no row gap (paragraphs handle their own margins); COL_GAP between columns
                alignContent: 'start',             // paragraphs stack from top, not stretched to fill height
              }}
            >
              {currentPageData.columns.map((col, colIdx) => (
                <div key={colIdx}>
                  {col.map((para, paraIdx) => {
                    const isFirst = localPage === 0 && colIdx === 0 && paraIdx === 0
                    // Split heads are the last paragraph in a column when the
                    // paragraph continues in the next column/page. The paginator
                    // does NOT account for marginBottom on split heads, so we
                    // suppress it here to keep rendered height = paginated height.
                    const isSplitHead =
                      currentPageData.colSplitHead[colIdx] &&
                      paraIdx === col.length - 1
                    return (
                      <p
                        key={paraIdx}
                        className={isFirst ? 'article-first-para' : undefined}
                        style={{
                          fontFamily: 'var(--font)',
                          fontWeight: 300,
                          fontSize: `${FONT_SIZE}px`,
                          lineHeight: LINE_HEIGHT_PX / FONT_SIZE,
                          color: 'var(--color-negro)',
                          // Suppress gap on split heads — see isSplitHead comment above.
                          marginBottom: isSplitHead ? 0 : `${PARA_GAP}px`,
                          textAlign: 'justify',
                          // For split heads the "last" line is mid-sentence — justify it
                          // like all other lines. The hyphenation fix in splitParagraph
                          // ensures this line is nearly full, so stretching is minimal.
                          textAlignLast: isSplitHead ? 'justify' : undefined,
                          overflowWrap: 'break-word',
                        }}
                      >
                        {isFirst ? (
                          // ── First paragraph: dropcap + CSS ::first-line styling ──
                          // The .article-first-para class in index.css applies
                          // uppercase / bold / celeste to the first visual line via
                          // ::first-line — the browser does the measurement after layout,
                          // correctly accounting for the dropcap float width and the
                          // column width. No JS measurement needed or reliable here.
                          <>
                            <Dropcap char={para[0]} />
                            <span aria-hidden="true">{para.slice(1)}</span>
                            <span className="sr-only">{para}</span>
                          </>
                        ) : para}
                      </p>
                    )
                  })}
                </div>
              ))}
            </motion.div>
          ) : (
            // ── Loading state ────────────────────────────────────────────
            // Shown while ResizeObserver hasn't fired yet (bodySize is 0×0)
            // and pagination hasn't run. opacity: 0.4 — clearly a placeholder.
            <motion.div
              key="measuring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              style={{ padding: `${PAD_V}px ${PAD_H}px` }}
            >
              <p style={{ fontFamily: 'var(--font)', fontWeight: 300, fontSize: `${FONT_SIZE}px` }}>
                Cargando…
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER NAV ─────────────────────────────────────────────────────
          Contains: previous button, page indicator dots, next button.
          flexShrink: 0 — footer is always full height, never compressed.
          justifyContent: space-between puts prev on the left, next on the
          right, and the page dots centered between them.
          borderTop mirrors the header's borderBottom for visual symmetry.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '14px 32px',
          borderTop: '1px solid var(--color-gris)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <NavButton onClick={goPrev} disabled={localPage === 0} direction="prev" />

        {/* ── Page indicator ───────────────────────────────────────────────
            Circular buttons — one per page, capped at 12 to avoid overflow
            on very long articles. Active page: 28px, Negro bg, white number,
            bold weight. Inactive: 20px, light gray bg, dimmed number.
            If pages > 12, a text fallback "···X/Y" is shown instead of
            the extra dots that wouldn't fit.
            transition: 'all 0.18s' animates the size change when active
            page changes — the active dot smoothly grows/shrinks.
        ─────────────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {pages.length > 0 &&
            Array.from({ length: Math.min(pages.length, 12) }).map((_, i) => {
              const isActive = i === localPage
              const size = isActive ? 28 : 20            // active dot is larger
              const fontSize = isActive ? 12 : 10
              const fontWeight = isActive ? 700 : 400
              return (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > localPage ? 1 : -1)
                    setLocalPage(i)
                    onPageChange(i)
                  }}
                  aria-label={`Ir a página ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: '50%',               // circle shape
                    // Active: solid Negro — maximum contrast, clear selection state.
                    // Inactive: 12% black — subtle, doesn't compete with content.
                    background: isActive ? 'var(--color-negro)' : 'rgba(0,0,0,0.12)',
                    // Active: Blanco number on Negro circle.
                    // Inactive: 45% black — readable but recessed.
                    color: isActive ? 'var(--color-blanco)' : 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font)',
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    lineHeight: 1,
                    flexShrink: 0,                     // prevent dots from shrinking on narrow screens
                    transition: 'all 0.18s ease',      // smooth size + color change on page turn
                  }}
                >
                  {i + 1}
                </button>
              )
            })}

          {/* Overflow label — only shown when the article has more than 12 pages.
              letterSpacing 0.05em adds slight spacing to the ellipsis. */}
          {pages.length > 12 && (
            <span
              style={{
                fontFamily: 'var(--font)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(0,0,0,0.3)',
                letterSpacing: '0.05em',
                marginLeft: '2px',
              }}
            >
              ···{' '}{localPage + 1}/{pages.length}
            </span>
          )}
        </div>

        <NavButton onClick={goNext} disabled={localPage >= pages.length - 1} direction="next" />
      </div>
    </div>
  )
}

// ── NAV BUTTON ────────────────────────────────────────────────────────────
// Prev / Next navigation buttons in the footer.
// opacity: 0.2 when disabled (not 0) — fully invisible disabled buttons
// would break the layout's symmetry (both sides must occupy space).
// minWidth: 80px ensures both buttons have equal width so the page dots
// stay centered regardless of the text length ("Anterior" vs "Siguiente").
// justifyContent mirrors the read direction: prev is left-aligned, next
// is right-aligned — matches the chevron position.
// Hover: opacity snaps to 1 (full opacity) to signal full interactivity.
// onMouseLeave restores to 0.55 (partially transparent) — not 1, because
// the non-hovered state is deliberately muted to keep focus on the content.
function NavButton({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void
  disabled: boolean
  direction: 'prev' | 'next'
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.2 : 0.55,           // 0.2 disabled — present but clearly inactive
        transition: 'opacity 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',                               // space between chevron icon and label text
        fontFamily: 'var(--font)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',               // matches caption / breadcrumb style
        color: 'var(--color-negro)',
        minWidth: '80px',                         // ensures both buttons are the same width
        justifyContent: direction === 'next' ? 'flex-end' : 'flex-start', // mirrors read direction
      }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.opacity = '1' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = disabled ? '0.2' : '0.55' }}
    >
      {direction === 'prev' ? <><ChevronLeft size={13} /> Anterior</> : <>Siguiente <ChevronRight size={13} /></>}
    </button>
  )
}
