export type SkinTypeId = 'balanced' | 'dry' | 'oily' | 'combination' | 'sensitive'

export interface SkinTrait {
  id: SkinTypeId
  label: string
  description: string
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
