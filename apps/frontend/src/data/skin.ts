import type { TraitOption } from "./types"

export type SkinTypeId = 'balanced' | 'dry' | 'oily' | 'combination' | 'sensitive'

export interface SkinTrait extends TraitOption {
  id: SkinTypeId
}

export const SKIN_TYPES: SkinTrait[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Feels comfortable most of the day with minimal shine or dryness.',
  },
  {
    id: 'dry',
    label: 'Dry',
    description: 'Tight or flaky areas, often craving deeper nourishment.',
  },
  {
    id: 'oily',
    label: 'Oily',
    description: 'Noticeable shine and enlarged pores through the T-zone.',
  },
  {
    id: 'combination',
    label: 'Combination',
    description: 'Mix of dry patches and oily hotspots, typically across the T-zone.',
  },
  {
    id: 'sensitive',
    label: 'Sensitive',
    description: 'Easily reactive to products, temperature changes, or ingredients.',
  },
]

export type SkinConcernId =
  | "acne"
  | "hyperpigmentation"
  | "dullness"
  | "redness"
  | "texture"
  | "fine-lines"

export const SKIN_CONCERNS: TraitOption[] = [
  {
    id: "acne",
    label: "Breakouts",
    description: "Active acne, clogged pores, or frequent blemishes.",
  },
  {
    id: "hyperpigmentation",
    label: "Dark Spots",
    description: "Hyperpigmentation, scarring, or uneven tone.",
  },
  {
    id: "dullness",
    label: "Dullness",
    description: "Lack of radiance or glow; tired-looking complexion.",
  },
  {
    id: "redness",
    label: "Sensitivity/Redness",
    description: "Visible irritation, rosacea, or inflamed patches.",
  },
  {
    id: "texture",
    label: "Rough Texture",
    description: "Uneven skin texture, enlarged pores, or congestion.",
  },
  {
    id: "fine-lines",
    label: "Fine Lines",
    description: "Emerging fine lines or preventative aging support.",
  },
]

export type SkinImprovementId =
  | "clarity"
  | "calm"
  | "radiance"
  | "firmness"
  | "hydration"
  | "resilience"

export const SKIN_IMPROVEMENTS: TraitOption[] = [
  {
    id: "clarity",
    label: "Clearer complexion",
    description: "Reduce blemishes and keep pores balanced.",
  },
  {
    id: "calm",
    label: "Calmer skin",
    description: "Soothe redness and reinforce the moisture barrier.",
  },
  {
    id: "radiance",
    label: "More radiance",
    description: "Boost luminosity and even tone for a healthy glow.",
  },
  {
    id: "firmness",
    label: "Firmer feel",
    description: "Support elasticity and smooth the look of fine lines.",
  },
  {
    id: "hydration",
    label: "Deep hydration",
    description: "Saturate skin with lasting moisture and bounce.",
  },
  {
    id: "resilience",
    label: "Stronger barrier",
    description: "Fortify skin to handle stress, travel, and climate shifts.",
  },
]
