export type ProductCategory =
  | 'foundation'
  | 'blush'
  | 'eyeshadow'
  | 'eyeliner'
  | 'haircare'

export interface TraitBundle {
  skinTypes?: string[]
  skinConcerns?: string[]
  hairTextures?: string[]
  hairConcerns?: string[]
}

export interface Product {
  id: string
  name: string
  brand: string
  category: ProductCategory
  price: number
  rating: number
  url: string
  traits: TraitBundle
}

export interface TraitOption {
  key: keyof TraitBundle | 'category'
  values: string[]
}

export interface UserProfile {
  skinType?: string
  skinTone?: string
  skinConcerns?: string[]
  hairTexture?: string
  hairConcerns?: string[]
  preferences?: string[]
}

export interface RecommendationRequest {
  profile: UserProfile
  topK?: number
}

export interface Recommendation {
  product: Product
  score: number
  reasons: string[]
}

export {
  loadLegacyProducts,
  transformLegacyRow,
  writeTransformedProducts,
} from './legacy/transform'
