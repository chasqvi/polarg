// ── CONTENT BLOCK TYPES ───────────────────────────────────────────────────────
// Article content is an ordered ContentBlock[]. TextBlocks carry paragraph text
// (soft hyphens pre-applied). All other types are float blocks: they occupy
// column space and text wraps around them.

export interface TextBlock {
  type: 'text'
  id: string
  text: string
}

export interface ImageBlock {
  type: 'image'
  id: string
  url: string
  alt?: string
  caption?: string
  columnSpan?: number
}

export interface VideoBlock {
  type: 'video'
  id: string
  embedUrl: string
  caption?: string
  columnSpan?: number
}

export interface HighlightBlock {
  type: 'highlight'
  id: string
  text: string
  columnSpan?: number
}

export interface AdBlock {
  type: 'ad'
  id: string
  slot: string
  columnSpan?: number
}

export interface ModuleBlock {
  type: 'module'
  id: string
  variant: 'top-read' | 'more-news' | 'article-card'
  data?: unknown
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | HighlightBlock
  | AdBlock
  | ModuleBlock

// ── PAGE LAYOUT TYPES ─────────────────────────────────────────────────────────
// Produced by usePagination. Each paragraph has an absolute Y position so the
// renderer can use position:absolute within the column, allowing blocks to sit
// between text zones without disrupting the normal CSS flow.

export interface ParagraphEntry {
  text: string
  y: number
  isFirst: boolean
  isSplitHead: boolean
}

export interface ColumnLayout {
  paragraphs: ParagraphEntry[]
}

export interface PlacedBlock {
  block: ContentBlock
  colStart: number
  colSpan: number
  y: number
  height: number
  width: number
}

export interface PageLayout {
  columns: ColumnLayout[]
  blocks: PlacedBlock[]
}
