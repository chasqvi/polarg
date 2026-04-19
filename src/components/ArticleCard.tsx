import { motion } from 'framer-motion'
import { TagBreadcrumb } from './TagBreadcrumb'
import type { Article } from '../types/database'

// HeadlineText renders the brand's signature mixed-weight headlines.
// Titles can embed **bold** markdown tokens — the text between ** is
// rendered at fontWeight 900 (Black) while the surrounding text is 400
// (Regular). This mirrors the logo logic: "Pol"(Black) + "Arg"(Regular).
function HeadlineText({ title, baseFontSize }: { title: string; baseFontSize: string }) {
  const parts = title.split(/(\*\*[^*]+\*\*)/)
  return (
    // baseFontSize is inherited from the parent h2/h3 so this wrapper
    // doesn't introduce a second font-size declaration.
    <span style={{ fontSize: baseFontSize }}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            // Black weight (900) — the "key concept" in the headline.
            // This is the same weight used for "Pol" in the PolArg logo.
            <span key={i} style={{ fontWeight: 900 }}>
              {part.slice(2, -2)}
            </span>
          )
        }
        return (
          // Regular weight (400) — the surrounding / contextual words.
          <span key={i} style={{ fontWeight: 400 }}>
            {part}
          </span>
        )
      })}
    </span>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface ArticleCardProps {
  article: Article
  variant?: 'featured' | 'regular' | 'minimal'
  onClick: () => void
}

export function ArticleCard({ article, variant = 'regular', onClick }: ArticleCardProps) {

  // ── FEATURED VARIANT ─────────────────────────────────────────────────
  // Used for the first / lead article in the homepage grid.
  // Full-width, tall, with an amarillo accent bar at the top.
  if (variant === 'featured') {
    return (
      <motion.article
        // layoutId ties this card to the ArticleReader overlay so Framer
        // Motion can animate a shared-layout expansion from card → reader.
        layoutId={`card-${article.id}`}
        onClick={onClick}
        // Subtle off-white hover — #FAFAFA is almost white, just enough
        // to signal interactivity without breaking the editorial look.
        whileHover={{ backgroundColor: '#FAFAFA' }}
        transition={{ duration: 0.15 }}
        style={{
          cursor: 'pointer',
          background: 'var(--color-blanco)',       // white card surface
          borderBottom: '1px solid var(--color-gris)', // divides featured from the grid below
          padding: '40px',                         // generous breathing room — editorial feel
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',                             // consistent vertical rhythm between sections
          position: 'relative',                    // needed so the amarillo bar can be absolute
          overflow: 'hidden',                      // clips the bar at the card edges
        }}
      >
        {/* ── Amarillo accent bar ──────────────────────────────────────
            4px full-width stripe at the very top of the featured card.
            Amarillo (#FED900) is "earned" — used sparingly, only for the
            single most important element on screen. Here it signals: this
            is the lead story. position: absolute keeps it out of the flex
            flow so it doesn't push the content down.
        ─────────────────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'var(--color-amarillo)',   // #FED900 — primary brand accent
          }}
        />

        {/* paddingTop: 8px compensates for the absolute bar so tags don't
            visually overlap it when the card is very compact. */}
        <div style={{ paddingTop: '8px' }}>
          <TagBreadcrumb tags={article.tags} size="sm" />
        </div>

        {/* ── Featured headline ─────────────────────────────────────────
            clamp(28px, 3.5vw, 52px): fluid type scaling.
              - 28px minimum — legible on narrow mobile
              - 3.5vw fluid — grows proportionally with viewport
              - 52px maximum — caps at a comfortable editorial size on 4K
            lineHeight: 1.1 — tighter than body text; standard for display
            letterSpacing: -0.025em — negative tracking tightens large type
            (loose tracking on large headlines looks amateurish).
            fontWeight 400 base — Black weight applied per-word in HeadlineText.
        ─────────────────────────────────────────────────────────────── */}
        <h2
          style={{
            fontFamily: 'var(--font)',
            fontWeight: 400,
            fontSize: 'clamp(28px, 3.5vw, 52px)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: 'var(--color-negro)',
          }}
        >
          <HeadlineText title={article.title} baseFontSize="inherit" />
        </h2>

        {/* ── Excerpt ───────────────────────────────────────────────────
            fontWeight 300 (Light) — matches the body text weight for
            long reads, keeps the excerpt secondary to the headline.
            maxWidth 640px — optimal reading line length (~75 chars at 17px);
            prevents the excerpt from stretching uncomfortably wide on
            large desktop screens.
            rgba(0,0,0,0.55) — dimmed to create hierarchy: headline > excerpt.
        ─────────────────────────────────────────────────────────────── */}
        {article.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font)',
              fontWeight: 300,
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'rgba(0,0,0,0.55)',
              maxWidth: '640px',
            }}
          >
            {article.excerpt}
          </p>
        )}

        {/* ── Byline (author + date) ────────────────────────────────────
            11px uppercase with 0.1em letter-spacing — the brand's
            "caption" style: small, bold, allcaps. Matches the tag
            breadcrumb aesthetic.
            rgba(0,0,0,0.35) — further dimmed; metadata is tertiary
            after headline and excerpt.
            The em-dash (—) separator uses --color-gris so it reads as
            a decorative divider, not content.
        ─────────────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            fontFamily: 'var(--font)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.35)',
          }}
        >
          {article.author && <span>{article.author}</span>}
          {article.author && article.published_at && (
            <span style={{ color: 'var(--color-gris)' }}>—</span>
          )}
          {article.published_at && <span>{formatDate(article.published_at)}</span>}
        </div>
      </motion.article>
    )
  }

  // ── MINIMAL VARIANT ───────────────────────────────────────────────────
  // Used in sidebars or "most read" lists — compact, text-only.
  // No excerpt, no padding on sides, just the headline and a thin border.
  if (variant === 'minimal') {
    return (
      <motion.article
        layoutId={`card-${article.id}`}
        onClick={onClick}
        // #F5F5F5 is slightly darker than featured's #FAFAFA — minimal
        // cards are denser so the hover needs a bit more visual weight.
        whileHover={{ backgroundColor: '#F5F5F5' }}
        transition={{ duration: 0.12 }}
        style={{
          cursor: 'pointer',
          padding: '18px 0',                       // vertical-only padding — no side gutters
          borderBottom: '1px solid var(--color-gris)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',                              // tighter than featured — compact list feel
        }}
      >
        {/* Only show the first tag — minimal cards don't have room for
            the full breadcrumb chain. */}
        <TagBreadcrumb tags={article.tags ? [article.tags[0]] : null} size="sm" />

        {/* ── Minimal headline ──────────────────────────────────────────
            Fixed 16px — no fluid scaling, minimal cards are always in
            narrow containers (sidebar). lineHeight 1.3 is tighter than
            featured because headlines here are shorter.
        ─────────────────────────────────────────────────────────────── */}
        <h3
          style={{
            fontFamily: 'var(--font)',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            color: 'var(--color-negro)',
          }}
        >
          <HeadlineText title={article.title} baseFontSize="inherit" />
        </h3>

        {/* Date only (no author) — minimal real estate. Same caption
            style as featured byline but even smaller (10px) and more
            transparent (0.3 alpha). */}
        <div
          style={{
            fontFamily: 'var(--font)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.3)',
          }}
        >
          {formatDate(article.published_at)}
        </div>
      </motion.article>
    )
  }

  // ── REGULAR VARIANT (default) ─────────────────────────────────────────
  // Used in the main grid below the featured article. Cards are equal
  // height inside a CSS grid, achieved via height: 100% + flexGrow on
  // the headline so shorter titles don't leave ragged bottoms.
  return (
    <motion.article
      layoutId={`card-${article.id}`}
      onClick={onClick}
      whileHover={{ backgroundColor: '#F5F5F5' }}
      transition={{ duration: 0.12 }}
      style={{
        cursor: 'pointer',
        background: 'var(--color-blanco)',
        // Full border (not just bottom) because these cards are in a grid
        // where the gap is replaced by a 1px --color-gris background, so
        // each card needs its own border to form the grid lines.
        border: '1px solid var(--color-gris)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',                            // fills the grid cell for equal-height cards
      }}
    >
      {/* Two tags max — regular cards are medium width, a 3+ tag chain
          would overflow on narrow viewport columns. */}
      <TagBreadcrumb tags={article.tags ? article.tags.slice(0, 2) : null} size="sm" />

      {/* ── Regular headline ──────────────────────────────────────────
          clamp(16px, 1.5vw, 22px): tighter fluid range than featured
          because these cards are in a multi-column grid (smaller cells).
          flexGrow: 1 pushes the excerpt and byline to the bottom of each
          card, keeping the grid visually aligned regardless of title length.
      ─────────────────────────────────────────────────────────────── */}
      <h3
        style={{
          fontFamily: 'var(--font)',
          fontWeight: 400,
          fontSize: 'clamp(16px, 1.5vw, 22px)',
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          color: 'var(--color-negro)',
          flexGrow: 1,                             // pushes metadata to card bottom
        }}
      >
        <HeadlineText title={article.title} baseFontSize="inherit" />
      </h3>

      {/* ── Excerpt — clamped to 3 lines ──────────────────────────────
          -webkit-line-clamp: 3 is the standard cross-browser way to
          truncate multi-line text. Requires display: -webkit-box and
          WebkitBoxOrient: vertical + overflow: hidden to work.
          fontWeight 300 at 13px keeps it clearly secondary to the headline.
          0.5 alpha — even more dimmed than featured because regular cards
          are visually denser and the excerpt competes with more elements.
      ─────────────────────────────────────────────────────────────── */}
      {article.excerpt && (
        <p
          style={{
            fontFamily: 'var(--font)',
            fontWeight: 300,
            fontSize: '13px',
            lineHeight: 1.55,
            color: 'rgba(0,0,0,0.5)',
            display: '-webkit-box',               // required for -webkit-line-clamp to work
            WebkitLineClamp: 3,                   // truncate at 3 lines
            WebkitBoxOrient: 'vertical',          // direction the box lays out children
            overflow: 'hidden',                   // clips the text past the 3rd line
          }}
        >
          {article.excerpt}
        </p>
      )}

      {/* ── Author byline ─────────────────────────────────────────────
          marginTop: auto pushes this to the very bottom of the card
          (works because the article wrapper is display: flex + column).
          No date here — regular cards are compact, author alone is enough.
      ─────────────────────────────────────────────────────────────── */}
      <div
        style={{
          fontFamily: 'var(--font)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.3)',
          marginTop: 'auto',                       // pins byline to card bottom
        }}
      >
        {article.author}
      </div>
    </motion.article>
  )
}
