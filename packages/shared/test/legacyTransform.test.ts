import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { loadLegacyProducts } from '../src'

const currentDir = dirname(fileURLToPath(import.meta.url))
const samplePath = resolve(
  currentDir,
  '../../../data/legacy/prod_data/products_sample.csv'
)

describe('legacy transform', () => {
  it('parses sample CSV into typed products', () => {
    const products = loadLegacyProducts(samplePath)
    expect(products).toHaveLength(5)
    const foundation = products.find(
      (product) => product.category === 'foundation'
    )
    expect(foundation).toMatchObject({
      id: 'prod_foundation_001',
      traits: {
        skinTypes: ['combination'],
        skinConcerns: ['dryness', 'uneven_tone'],
      },
    })
    const haircare = products.find((product) => product.category === 'haircare')
    expect(haircare?.traits.hairConcerns).toContain('frizz')
  })
})
