import type { WizardStep } from "../data/steps"

import { StepHeader } from "./StepHeader"
import { TraitToggle } from "./TraitToggle"

interface TraitStepProps {
  step: WizardStep
  index: number
  total: number
  activeSelections: string[]
  onToggle: (id: string) => void
}

export function TraitStep({
  step,
  index,
  total,
  activeSelections,
  onToggle,
}: TraitStepProps) {
  return (
    <section className="panel trait-panel">
      <StepHeader
        index={index}
        total={total}
        title={step.title}
        prompt={step.prompt}
        badge={step.badge}
      />
      <div className="trait-grid">
        {step.data.map((option) => (
          <TraitToggle
            key={option.id}
            option={option}
            isActive={activeSelections.includes(option.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  )
}
