import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { TagBreadcrumb } from './TagBreadcrumb'
import { usePagination, getColumnCount } from '../hooks/usePagination'
import { addSoftHyphens } from '../lib/hyphenate'
import type { Article } from '../types/database'
import type { ContentBlock, PlacedBlock, TextBlock } from '../types/content'

// ── DROPCAP CONSTANTS ─────────────────────────────────────────────────────────
// Dropcap spans exactly 3 text lines. Math: lineHeightPx = 18×1.7 = 30.6px,
// 3 lines = 91.8px. Work Sans cap height ≈ 0.72em → fontSize = 91.8/0.72 ≈ 128px.
// DROPCAP_LINE_HEIGHT 0.81 compensates for the font's internal leading so
// the baseline lands exactly on the 3rd text line.
const DROPCAP_SIZE = 112
const DROPCAP_LINE_HEIGHT = 0.81

function Dropcap({ char }: { char: string }) {
  return (
    <span
      aria-hidden
      style={{
        float: 'left',
        fontFamily: 'var(--font)',
        fontWeight: 900,
        fontSize: `${DROPCAP_SIZE}px`,
        lineHeight: DROPCAP_LINE_HEIGHT,
        color: 'var(--color-celeste)',
        marginRight: '7px',
        marginTop: '0px',
        userSelect: 'none',
      }}
    >
      {char}
    </span>
  )
}

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

// ── BLOCK RENDERER ─────────────────────────────────────────────────────────────
// Renders a single non-text float block at its computed dimensions.
function BlockRenderer({ pb }: { pb: PlacedBlock }) {
  const { block, width, height } = pb

  if (block.type === 'image') {
    const captionH = block.caption ? 32 : 0
    const mediaH = height - captionH
    return (
      <div style={{ width, height }}>
        <img
          src={block.url}
          alt={block.alt ?? block.caption ?? ''}
          style={{ width: '100%', height: mediaH, objectFit: 'cover', display: 'block' }}
        />
        {block.caption && (
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.45)',
            marginTop: '6px',
            lineHeight: 1.4,
          }}>
            {block.caption}
          </p>
        )}
      </div>
    )
  }

  if (block.type === 'video') {
    return (
      <iframe
        src={block.embedUrl}
        width={width}
        height={height}
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
        title={block.caption ?? 'Video'}
      />
    )
  }

  if (block.type === 'highlight') {
    return (
      <div style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        borderTop: '3px solid var(--color-celeste)',
        borderBottom: '3px solid var(--color-celeste)',
      }}>
        <p style={{
          fontFamily: 'var(--font)',
          fontWeight: 700,
          fontSize: 'clamp(17px, 1.5vw, 22px)',
          lineHeight: 1.3,
          color: 'var(--color-celeste)',
          letterSpacing: '-0.01em',
          textAlign: 'center',
        }}>
          "{block.text}"
        </p>
      </div>
    )
  }

  if (block.type === 'ad') {
    return (
      <div style={{
        width,
        height,
        background: 'var(--color-gris)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.3)',
        }}>
          Publicidad
        </span>
      </div>
    )
  }

  if (block.type === 'module') {
    const label =
      block.variant === 'top-read' ? 'Lo más leído' :
      block.variant === 'more-news' ? 'Más noticias' :
      'Nota destacada'
    return (
      <div style={{
        width,
        height,
        background: 'var(--color-negro)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {label}
        </span>
      </div>
    )
  }

  return null
}

// ── PAGE TRANSITION ───────────────────────────────────────────────────────────
const pageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
}
const pageTransition = { type: 'tween' as const, ease: [0.25, 0.1, 0.25, 1] as const, duration: 0.3 }

// ── TYPOGRAPHY CONSTANTS ──────────────────────────────────────────────────────
// These values drive both rendering AND the Pretext pagination engine.
// Any change here must be consistent with what usePagination receives.
const FONT_SIZE = 18
const LINE_HEIGHT_PX = FONT_SIZE * 1.7
const PARA_GAP = 24
const COL_GAP = 48
const PAD_V = 28
const PAD_H = 32

const DROPCAP_FONT_STR = `900 ${DROPCAP_SIZE}px 'Work Sans'`
const DROPCAP_LINE_COUNT = Math.ceil((DROPCAP_SIZE * DROPCAP_LINE_HEIGHT) / LINE_HEIGHT_PX)
const DROPCAP_MARGIN_RIGHT = 7

interface ArticleReaderProps {
  article: Article
  currentPage: number
  onPageChange: (page: number) => void
  onClose: () => void
}

export function ArticleReader({ article, currentPage, onPageChange, onClose }: ArticleReaderProps) {
  const [localPage, setLocalPage] = useState(currentPage)
  const [direction, setDirection] = useState<1 | -1>(1)

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
  const columnHeight = bodySize.height - PAD_V * 2

  // ── Content blocks ─────────────────────────────────────────────────────────
  // If the article has pre-structured contentBlocks, use them directly.
  // Otherwise fall back to splitting article.content by double newlines.
  const contentBlocks = useMemo<ContentBlock[]>(() => {
    if (article.contentBlocks && article.contentBlocks.length > 0) {
      return article.contentBlocks
    }
    return (article.content ?? '')
      .split('\n\n')
      .filter((p) => p.trim().length > 0)
      .map(
        (text, i): TextBlock => ({
          type: 'text',
          id: `p${i}`,
          text: addSoftHyphens(text),
        }),
      )
  }, [article.contentBlocks, article.content])

  const dropcapChar = useMemo(() => {
    const firstText = contentBlocks.find((b): b is TextBlock => b.type === 'text')
    return firstText?.text[0] ?? ''
  }, [contentBlocks])

  const pages = usePagination(contentBlocks, {
    columnHeight,
    columnWidth,
    columnCount,
    colGap: COL_GAP,
    fontSize: FONT_SIZE,
    lineHeightPx: LINE_HEIGHT_PX,
    paragraphGap: PARA_GAP,
    dropcapChar,
    dropcapFontStr: DROPCAP_FONT_STR,
    dropcapMarginRight: DROPCAP_MARGIN_RIGHT,
    dropcapLines: DROPCAP_LINE_COUNT,
  })

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

  const actionsRef = useRef({ goNext, goPrev, onClose })
  useEffect(() => { actionsRef.current = { goNext, goPrev, onClose } })

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-blanco)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px 32px 16px',
          borderBottom: '1px solid var(--color-gris)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '10px' }}>
            <TagBreadcrumb tags={article.tags} size="sm" />
          </div>
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

        <button
          onClick={onClose}
          aria-label="Cerrar artículo"
          style={{
            flexShrink: 0,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--color-gris)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
            background: 'transparent',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F0F0F0' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <X size={15} color="var(--color-negro)" />
        </button>
      </div>

      {/* ── COLUMN BODY ─────────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence initial={false} custom={direction} mode="sync">
          {currentPageData ? (
            <motion.div
              key={localPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
            >
              {/* ── Column grid ─────────────────────────────────────────────── */}
              {/* Paragraphs are position:absolute within each column, so the
                  column div must be position:relative with an explicit height.
                  overflow:visible lets split-head text that slightly overshoots
                  the column bottom be absorbed by PAD_V rather than clipped. */}
              <div
                style={{
                  position: 'absolute',
                  top: PAD_V,
                  left: PAD_H,
                  right: PAD_H,
                  bottom: PAD_V,
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                  columnGap: `${COL_GAP}px`,
                }}
              >
                {currentPageData.columns.map((col, colIdx) => (
                  <div
                    key={colIdx}
                    style={{ position: 'relative', height: `${columnHeight}px`, overflow: 'visible' }}
                  >
                    {col.paragraphs.map((entry, i) => (
                      <p
                        key={i}
                        className={entry.isFirst ? 'article-first-para' : undefined}
                        style={{
                          position: 'absolute',
                          top: `${entry.y}px`,
                          left: 0,
                          right: 0,
                          fontFamily: 'var(--font)',
                          fontWeight: 300,
                          fontSize: `${FONT_SIZE}px`,
                          lineHeight: LINE_HEIGHT_PX / FONT_SIZE,
                          color: 'var(--color-negro)',
                          textAlign: 'justify',
                          textAlignLast: entry.isSplitHead ? 'justify' : undefined,
                          overflowWrap: 'break-word',
                        }}
                      >
                        {entry.isFirst ? (
                          <>
                            <Dropcap char={entry.text[0]} />
                            <span aria-hidden="true">{entry.text.slice(1)}</span>
                            <span className="sr-only">{entry.text}</span>
                          </>
                        ) : entry.text}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* ── Float blocks ─────────────────────────────────────────────── */}
              {/* Absolutely positioned over the page, using colStart and y from
                  the paginator. left = PAD_H + colStart × (colWidth + colGap). */}
              {currentPageData.blocks.map((pb, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: PAD_H + pb.colStart * (columnWidth + COL_GAP),
                    top: PAD_V + pb.y,
                    width: pb.width,
                    height: pb.height,
                  }}
                >
                  <BlockRenderer pb={pb} />
                </div>
              ))}
            </motion.div>
          ) : (
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

      {/* ── FOOTER NAV ──────────────────────────────────────────────────────── */}
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

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {pages.length > 0 &&
            Array.from({ length: Math.min(pages.length, 12) }).map((_, i) => {
              const isActive = i === localPage
              const size = isActive ? 28 : 20
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
                    borderRadius: '50%',
                    background: isActive ? 'var(--color-negro)' : 'rgba(0,0,0,0.12)',
                    color: isActive ? 'var(--color-blanco)' : 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font)',
                    fontSize: isActive ? '12px' : '10px',
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: 1,
                    flexShrink: 0,
                    transition: 'all 0.18s ease',
                  }}
                >
                  {i + 1}
                </button>
              )
            })}
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
        opacity: disabled ? 0.2 : 0.55,
        transition: 'opacity 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-negro)',
        minWidth: '80px',
        justifyContent: direction === 'next' ? 'flex-end' : 'flex-start',
      }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.opacity = '1' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = disabled ? '0.2' : '0.55' }}
    >
      {direction === 'prev'
        ? <><ChevronLeft size={13} /> Anterior</>
        : <>Siguiente <ChevronRight size={13} /></>}
    </button>
  )
}
