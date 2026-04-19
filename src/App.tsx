import { AnimatePresence, motion } from 'framer-motion'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Logo } from './components/Logo'
import { ArticleCard } from './components/ArticleCard'
import { ArticleReader } from './components/ArticleReader'
import { mockArticles } from './data/mockArticles'
import { useState } from 'react'

const CATEGORIES = ['Todo', 'Política', 'Economía', 'Judicial', 'Internacional']

export default function App() {
  // URL is the source of truth for which article is open and which page
  const { articulo, pagina } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [activeCategory, setActiveCategory] = useState('Todo')

  const selectedArticle = articulo
    ? (mockArticles.find((a) => a.slug === articulo) ?? null)
    : null

  // pagina is 1-indexed in URL, 0-indexed internally
  const currentPage = (pagina ?? 1) - 1

  const filtered =
    activeCategory === 'Todo'
      ? mockArticles
      : mockArticles.filter(
          (a) => a.category?.toLowerCase() === activeCategory.toLowerCase(),
        )

  const [featured, ...rest] = filtered

  function openArticle(slug: string) {
    navigate({ search: { articulo: slug, pagina: 1 } })
  }

  function closeArticle() {
    navigate({ to: '/', search: {} })
  }

  function changePage(page: number) {
    // Each page turn is its own history entry so back/forward works per page
    navigate({ search: { articulo: articulo!, pagina: page + 1 } })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-blanco)', color: 'var(--color-negro)' }}>
      {/* Header */}
      <header
        style={{
          padding: '18px 32px',
          borderBottom: '1px solid var(--color-gris)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--color-blanco)',
        }}
      >
        <Logo size="md" showClaim />
        <nav style={{ display: 'flex', gap: '2px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: 'var(--font)',
                fontSize: '11px',
                fontWeight: activeCategory === cat ? 700 : 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '6px 12px',
                borderRadius: '2px',
                color: activeCategory === cat ? 'var(--color-negro)' : 'rgba(0,0,0,0.4)',
                background: activeCategory === cat ? 'var(--color-amarillo)' : 'transparent',
                transition: 'all 0.12s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px 64px' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              fontFamily: 'var(--font)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.25)',
            }}
          >
            Sin artículos en esta categoría
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {featured && (
              <ArticleCard
                article={featured}
                variant="featured"
                onClick={() => openArticle(featured.slug)}
              />
            )}
            {rest.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1px',
                  marginTop: '1px',
                  background: 'var(--color-gris)',
                }}
              >
                {rest.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="regular"
                    onClick={() => openArticle(article.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '24px 32px',
          borderTop: '1px solid var(--color-gris)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size="sm" />
        <span
          style={{
            fontFamily: 'var(--font)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.25)',
          }}
        >
          © 2026 Política Argentina
        </span>
      </footer>

      {/* Article reader overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeArticle}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                zIndex: 50,
              }}
            />
            <motion.div
              key={`reader-${selectedArticle.id}`}
              layoutId={`card-${selectedArticle.id}`}
              style={{
                position: 'fixed',
                inset: 'var(--frame)',
                zIndex: 51,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ArticleReader
                article={selectedArticle}
                currentPage={currentPage}
                onPageChange={changePage}
                onClose={closeArticle}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
