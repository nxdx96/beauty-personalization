import { SummaryPanel } from "./SummaryPanel"
import { StartScreen } from "./StartScreen"
import { TraitStep } from "./TraitStep"
import { WizardNav } from "./WizardNav"
import { useWizard } from "../hooks/useWizard"

export function Wizard() {
  const {
    steps,
    started,
    currentStep,
    selections,
    summary,
    isSummary,
    canAdvance,
    start,
    toggle,
    next,
    prev,
    reset,
  } = useWizard()

  if (!started) {
    return <StartScreen onStart={start} />
  }

  if (isSummary) {
    return <SummaryPanel summary={summary} onRestart={reset} />
  }

  const currentIndex = currentStep ? steps.findIndex((step) => step.id === currentStep.id) : 0

  return (
    <div className="panel-stack">
      {currentStep && (
        <>
          <TraitStep
            step={currentStep}
            index={currentIndex}
            total={steps.length}
            activeSelections={selections[currentStep.id]}
            onToggle={(id) => toggle(currentStep.id, id)}
          />
          <WizardNav
            canGoBack={currentIndex > 0}
            canAdvance={canAdvance}
            onBack={prev}
            onNext={next}
            nextLabel={currentIndex === steps.length - 1 ? "Review summary" : "Next"}
          />
        </>
      )}
    </div>
  )
}
