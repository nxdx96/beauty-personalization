import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { parse } from 'csv-parse/sync'

import type { Product, TraitBundle } from '../index'

export interface LegacyProductRow {
  id: string
  product: string
  brand: string
  product_type: string
  price: string
  rating: string
  skin_type?: string
  skin_concerns?: string
  hair_texture?: string
  hair_concerns?: string
  url: string
}

const DELIMITER = ';'

const parseDelimited = (value?: string): string[] | undefined => {
  if (!value) return undefined
  const entries = value
    .split(DELIMITER)
    .map((entry) => entry.trim())
    .filter(Boolean)
  return entries.length ? entries : undefined
}

const toNumber = (value: string): number => Number.parseFloat(value)

const toTraitBundle = (row: LegacyProductRow): TraitBundle => ({
  skinTypes: parseDelimited(row.skin_type),
  skinConcerns: parseDelimited(row.skin_concerns),
  hairTextures: parseDelimited(row.hair_texture),
  hairConcerns: parseDelimited(row.hair_concerns),
})

export const transformLegacyRow = (row: LegacyProductRow): Product => ({
  id: row.id,
  name: row.product,
  brand: row.brand,
  category: row.product_type as Product['category'],
  price: toNumber(row.price),
  rating: toNumber(row.rating),
  url: row.url,
  traits: toTraitBundle(row),
})

export const loadLegacyProducts = (relativePath: string): Product[] => {
  const absolutePath = resolve(relativePath)
  const fileContent = readFileSync(absolutePath, 'utf-8')
  const rows = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as LegacyProductRow[]
  return rows.map(transformLegacyRow)
}

export const writeTransformedProducts = (products: Product[], outputPath: string): void => {
  const absolutePath = resolve(outputPath)
  const payload = JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      products,
    },
    null,
    2,
  )
  writeFileSync(absolutePath, payload)
}
