interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showClaim?: boolean
}

const sizes = {
  sm: { fontSize: '18px', claimSize: '9px' },
  md: { fontSize: '24px', claimSize: '11px' },
  lg: { fontSize: '36px', claimSize: '14px' },
}

export function Logo({ size = 'md', showClaim = false }: LogoProps) {
  const { fontSize, claimSize } = sizes[size]

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
      <div
        style={{
          fontFamily: 'var(--font)',
          fontSize,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--color-negro)',
          userSelect: 'none',
        }}
      >
        <span style={{ fontWeight: 900 }}>Pol</span>
        <span style={{ fontWeight: 400 }}>Arg</span>
      </div>
      {showClaim && (
        <div
          style={{
            fontFamily: 'var(--font)',
            fontSize: claimSize,
            fontWeight: 300,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.4)',
          }}
        >
          Desde adentro
        </div>
      )}
    </div>
  )
}
