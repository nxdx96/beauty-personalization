import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  loadLegacyProducts,
  writeTransformedProducts,
} from '@beauty-personalization/shared'

const ROOT = resolve(process.cwd(), '..', '..')
const SOURCE = resolve(ROOT, 'data/legacy/prod_data/products_sample.csv')
const OUTPUT_DIR = resolve(ROOT, 'data/processed')
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'products.json')

try {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const products = loadLegacyProducts(SOURCE)
  writeTransformedProducts(products, OUTPUT_FILE)
  process.stdout.write(
    `Transformed ${products.length} legacy products -> ${OUTPUT_FILE}\n`
  )
} catch (error) {
  process.stderr.write(
    `Failed to seed from legacy data: ${(error as Error).message}\n`
  )
  process.exitCode = 1
}
