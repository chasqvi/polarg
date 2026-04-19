interface TagBreadcrumbProps {
  tags: string[] | null
  size?: 'sm' | 'md'
}

export function TagBreadcrumb({ tags, size = 'sm' }: TagBreadcrumbProps) {
  if (!tags || tags.length === 0) return null

  const fontSize = size === 'sm' ? '10px' : '12px'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--font)',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-negro)',
        flexWrap: 'wrap',
      }}
    >
      {tags.map((tag, i) => (
        <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {tag}
          {i < tags.length - 1 && (
            <span
              style={{
                color: 'var(--color-amarillo)',
                fontSize: '1em',
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              →
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
