export type HairTextureId =
  | "straight"
  | "wavy"
  | "curly"
  | "coily"
  | "protective"

export interface HairTrait {
  id: HairTextureId
  label: string
  description: string
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
