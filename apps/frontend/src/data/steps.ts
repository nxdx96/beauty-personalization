import {
  HAIR_CONCERNS,
  HAIR_IMPROVEMENTS,
  HAIR_TEXTURES,
} from "./hair"
import {
  SKIN_CONCERNS,
  SKIN_IMPROVEMENTS,
  SKIN_TYPES,
} from "./skin"
import type { TraitOption } from "./types"

export type StepId =
  | "skin-type"
  | "skin-concerns"
  | "skin-goals"
  | "hair-texture"
  | "hair-concerns"
  | "hair-goals"

export interface WizardStep {
  id: StepId
  title: string
  prompt: string
  multiSelect: boolean
  data: TraitOption[]
  badge: string
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "skin-type",
    title: "Skin type",
    prompt: "Choose all skin types that resonate across seasons.",
    badge: "Skin",
    multiSelect: true,
    data: SKIN_TYPES,
  },
  {
    id: "skin-concerns",
    title: "Skin concerns",
    prompt: "What are we supporting right now?",
    badge: "Skin",
    multiSelect: true,
    data: SKIN_CONCERNS,
  },
  {
    id: "skin-goals",
    title: "Skin improvements",
    prompt: "Pick the changes you'd love to see.",
    badge: "Skin",
    multiSelect: true,
    data: SKIN_IMPROVEMENTS,
  },
  {
    id: "hair-texture",
    title: "Hair texture or style",
    prompt: "Select the textures or protective styles you rotate through.",
    badge: "Hair",
    multiSelect: true,
    data: HAIR_TEXTURES,
  },
  {
    id: "hair-concerns",
    title: "Hair concerns",
    prompt: "Where could your hair use extra care?",
    badge: "Hair",
    multiSelect: true,
    data: HAIR_CONCERNS,
  },
  {
    id: "hair-goals",
    title: "Hair improvements",
    prompt: "Dream hair check-in—what's on your wish list?",
    badge: "Hair",
    multiSelect: true,
    data: HAIR_IMPROVEMENTS,
  },
]
