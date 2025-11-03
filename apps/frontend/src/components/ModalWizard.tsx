import type { ReactNode } from 'react'

import './ModalWizard.css'

interface ModalWizardProps {
  open: boolean
  title: string
  stepLabel: string
  stepIndex: number
  totalSteps: number
  onClose: () => void
  onBack?: () => void
  onPrimary: () => void
  primaryLabel: string
  primaryDisabled?: boolean
  isPrimaryLoading?: boolean
  children: ReactNode
}

export const ModalWizard = ({
  open,
  title,
  stepLabel,
  stepIndex,
  totalSteps,
  onClose,
  onBack,
  onPrimary,
  primaryLabel,
  primaryDisabled,
  isPrimaryLoading,
  children,
}: ModalWizardProps) => {
  if (!open) return null

  return (
    <div className="wizard-overlay">
      <div
        className="wizard-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        <header className="wizard-header">
          <div>
            <h2 id="wizard-title">{title}</h2>
            <p className="wizard-subtitle">
              Step {stepIndex + 1} of {totalSteps} - {stepLabel}
            </p>
          </div>
          <button
            className="wizard-close"
            onClick={onClose}
            aria-label="Close wizard"
          >
            x
          </button>
        </header>
        <section className="wizard-body">{children}</section>
        <footer className="wizard-footer">
          <button
            className="wizard-secondary"
            onClick={onBack}
            disabled={!onBack}
          >
            Back
          </button>
          <button
            className="wizard-primary"
            onClick={onPrimary}
            disabled={primaryDisabled}
            aria-busy={isPrimaryLoading}
          >
            {isPrimaryLoading ? 'Loading...' : primaryLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}
