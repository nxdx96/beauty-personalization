import type { WizardStep } from "../data/steps"

interface SummaryEntry {
  step: WizardStep
  selections: string[]
}

interface SummaryPanelProps {
  summary: SummaryEntry[]
  onRestart: () => void
}

export function SummaryPanel({ summary, onRestart }: SummaryPanelProps) {
  return (
    <section className="panel summary-panel">
      <p className="eyebrow">Summary</p>
      <h2>Here&rsquo;s what we captured</h2>
      <div className="summary-grid">
        {summary.map(({ step, selections }) => (
          <article key={step.id} className="summary-card">
            <header>
              <span className="badge">{step.badge}</span>
              <h3>{step.title}</h3>
            </header>
            {selections.length > 0 ? (
              <ul>
                {selections.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No selections yet.</p>
            )}
          </article>
        ))}
      </div>
      <button type="button" className="cta" onClick={onRestart}>
        Restart wizard
      </button>
    </section>
  )
}
