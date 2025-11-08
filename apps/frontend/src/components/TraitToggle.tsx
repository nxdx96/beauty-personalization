import type { TraitOption } from "../data/types"

interface TraitToggleProps {
  option: TraitOption
  isActive: boolean
  onToggle: (id: string) => void
}

export function TraitToggle({ option, isActive, onToggle }: TraitToggleProps) {
  return (
    <button
      type="button"
      className={`trait-toggle ${isActive ? "active" : ""}`}
      aria-pressed={isActive}
      onClick={() => onToggle(option.id)}
    >
      <span className="trait-label">{option.label}</span>
      {option.description && <span className="trait-copy">{option.description}</span>}
    </button>
  )
}
