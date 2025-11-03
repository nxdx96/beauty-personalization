import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

import {
  loadLegacyProducts,
  Recommendation,
  RecommendationRequest,
  Product,
  TraitOption,
} from '@beauty-personalization/shared'

const currentDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(currentDir, '../../..')
const processedPath = resolve(repoRoot, 'data/processed/products.json')
const legacyPath = resolve(
  repoRoot,
  'data/legacy/prod_data/products_sample.csv'
)

let cache: Product[] | undefined

const readProcessedProducts = (): Product[] => {
  const raw = readFileSync(processedPath, 'utf-8')
  const parsed = JSON.parse(raw) as { products: Product[] }
  return parsed.products ?? []
}

export const loadProducts = (): Product[] => {
  if (!cache) {
    try {
      cache = readProcessedProducts()
    } catch {
      cache = loadLegacyProducts(legacyPath)
    }
  }
  return cache ?? []
}

const uniqueValues = (values: (string | undefined)[]): string[] =>
  Array.from(new Set(values.filter(Boolean) as string[])).sort()

export const getTraitOptions = (): TraitOption[] => {
  const products = loadProducts()
  return [
    {
      key: 'category',
      values: uniqueValues(products.map((product) => product.category)),
    },
    {
      key: 'skinTypes',
      values: uniqueValues(
        products.flatMap((product) => product.traits.skinTypes ?? [])
      ),
    },
    {
      key: 'skinConcerns',
      values: uniqueValues(
        products.flatMap((product) => product.traits.skinConcerns ?? [])
      ),
    },
    {
      key: 'hairTextures',
      values: uniqueValues(
        products.flatMap((product) => product.traits.hairTextures ?? [])
      ),
    },
    {
      key: 'hairConcerns',
      values: uniqueValues(
        products.flatMap((product) => product.traits.hairConcerns ?? [])
      ),
    },
  ]
}

const matchesProfile = (
  product: Product,
  request: RecommendationRequest
): boolean => {
  const { profile } = request
  const { traits } = product

  if (
    profile.skinType &&
    traits.skinTypes &&
    !traits.skinTypes.includes(profile.skinType)
  ) {
    return false
  }

  if (profile.skinConcerns?.length) {
    const productSkinConcerns = traits.skinConcerns ?? []
    if (!productSkinConcerns.length) {
      return false
    }
    if (
      !profile.skinConcerns.some((concern: string) =>
        productSkinConcerns.includes(concern)
      )
    ) {
      return false
    }
  }

  if (
    profile.hairTexture &&
    traits.hairTextures &&
    !traits.hairTextures.includes(profile.hairTexture)
  ) {
    return false
  }

  if (profile.hairConcerns?.length) {
    const productHairConcerns = traits.hairConcerns ?? []
    if (!productHairConcerns.length) {
      return false
    }
    if (
      !profile.hairConcerns.some((concern: string) =>
        productHairConcerns.includes(concern)
      )
    ) {
      return false
    }
  }

  return true
}

export const getRecommendations = (
  request: RecommendationRequest
): Recommendation[] => {
  const { topK = 5 } = request
  const products = loadProducts()
  const filtered = products.filter((product) =>
    matchesProfile(product, request)
  )

  const scored = (filtered.length ? filtered : products)
    .map<Recommendation>((product) => ({
      product,
      score: product.rating,
      reasons: [
        `Rating: ${product.rating.toFixed(1)}`,
        ...(product.traits.skinConcerns ?? []),
        ...(product.traits.hairConcerns ?? []),
      ],
    }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, topK)
}
