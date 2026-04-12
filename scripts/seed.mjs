/**
 * polArg Supabase Seeder
 * Reads scraped_articles.json and inserts into Supabase
 *
 * Usage: node scripts/seed.mjs
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY in environment
 */

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_KEY required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('🌱 Starting Supabase seed...\n')

  // Read scraped data
  const dataPath = join(__dirname, 'scraped_articles.json')
  let data
  try {
    data = JSON.parse(readFileSync(dataPath, 'utf-8'))
  } catch (_) {
    console.error('❌ scraped_articles.json not found. Run: node scripts/scrape.mjs first')
    process.exit(1)
  }

  const articles = data.articles
  console.log(`📄 Found ${articles.length} articles to seed\n`)

  // Extract unique categories and upsert them first
  const categoryNames = [...new Set(articles.map(a => a.category).filter(Boolean))]
  const categories = categoryNames.map(name => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: null,
  }))

  const { error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })

  if (catError) {
    console.warn('⚠️  Categories upsert warning:', catError.message)
  } else {
    console.log(`✓ Upserted ${categories.length} categories`)
  }

  // Insert articles in batches of 10
  const batchSize = 10
  let inserted = 0
  let skipped = 0

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize)
    const { data: rows, error } = await supabase
      .from('articles')
      .upsert(batch, { onConflict: 'source_url' })
      .select('id')

    if (error) {
      console.warn(`  ⚠️  Batch ${Math.floor(i/batchSize)+1} warning: ${error.message}`)
      skipped += batch.length
    } else {
      inserted += (rows?.length || batch.length)
      console.log(`  ✓ Batch ${Math.floor(i/batchSize)+1}: ${rows?.length || batch.length} articles`)
    }
  }

  console.log(`\n✅ Done — ${inserted} inserted, ${skipped} skipped`)
}

seed().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
