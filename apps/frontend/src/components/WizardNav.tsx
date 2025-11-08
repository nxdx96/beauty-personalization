interface WizardNavProps {
  canGoBack: boolean
  canAdvance: boolean
  onBack: () => void
  onNext: () => void
  nextLabel?: string
}

export function WizardNav({
  canGoBack,
  canAdvance,
  onBack,
  onNext,
  nextLabel = "Next",
}: WizardNavProps) {
  return (
    <div className="wizard-nav">
      <button type="button" className="ghost" onClick={onBack} disabled={!canGoBack}>
        Back
      </button>
      <button type="button" className="cta" onClick={onNext} disabled={!canAdvance}>
        {nextLabel}
      </button>
    </div>
  )
}
