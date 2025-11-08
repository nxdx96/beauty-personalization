import type { TraitOption } from "./types"

export type HairTextureId =
  | "straight"
  | "wavy"
  | "curly"
  | "coily"
  | "protective"

export interface HairTrait extends TraitOption {
  id: HairTextureId
}

export const HAIR_TEXTURES: HairTrait[] = [
  {
    id: "straight",
    label: "Straight",
    description: "Naturally smooth strands with minimal bend from root to tip.",
  },
  {
    id: "wavy",
    label: "Wavy",
    description: "Defined S-shape waves that can fluctuate between frizz and flat.",
  },
  {
    id: "curly",
    label: "Curly",
    description: "Springy ringlets that thrive on moisture and definition.",
  },
  {
    id: "coily",
    label: "Coily",
    description: "Tight coils or zig-zag patterns requiring gentle handling and hydration.",
  },
  {
    id: "protective",
    label: "Protective styles",
    description: "Braids, twists, or wigs shielding natural hair for growth and low manipulation.",
  },
]

export type HairConcernId =
  | "frizz"
  | "dryness"
  | "damage"
  | "volume"
  | "sensitivity"

export const HAIR_CONCERNS: TraitOption[] = [
  {
    id: "frizz",
    label: "Frizz & Flyaways",
    description: "Unruly strands that lack definition or smoothness.",
  },
  {
    id: "dryness",
    label: "Dry or Brittle",
    description: "Hair that feels parched, rough, or prone to breakage.",
  },
  {
    id: "damage",
    label: "Heat/Chemical Damage",
    description: "Color-treated or heat-styled strands needing repair.",
  },
  {
    id: "volume",
    label: "Flatness",
    description: "Fine or thinning hair that seeks lift and fullness.",
  },
  {
    id: "sensitivity",
    label: "Scalp Sensitivity",
    description: "Itchy, flaky, or easily irritated scalp states.",
  },
]

export type HairImprovementId =
  | "definition"
  | "strength"
  | "shine"
  | "moisture"
  | "longevity"

export const HAIR_IMPROVEMENTS: TraitOption[] = [
  {
    id: "definition",
    label: "Curl Definition",
    description: "Longer-lasting pattern with minimal frizz.",
  },
  {
    id: "strength",
    label: "Stronger Strands",
    description: "Reinforce hair to reduce shedding and breakage.",
  },
  {
    id: "shine",
    label: "Mirror Shine",
    description: "Boost vibrancy and light reflection.",
  },
  {
    id: "moisture",
    label: "Moisture Lock",
    description: "Seal hydration and keep styles soft for days.",
  },
  {
    id: "longevity",
    label: "Style Longevity",
    description: "Extend blowouts, wash-n-gos, twists, or protective sets.",
  },
]
