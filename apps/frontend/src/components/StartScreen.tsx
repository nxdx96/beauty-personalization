interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="panel start-panel">
      <p className="eyebrow">Phase 1 · Intake Wizard</p>
      <h1>Let&rsquo;s co-create your beauty routine</h1>
      <p className="lede">
        We&rsquo;ll walk through a few quick questions about your skin and hair. Every
        selection fine-tunes the recommendations we&rsquo;ll prototype next.
      </p>
      <button type="button" className="cta" onClick={onStart}>
        Start personalizing
      </button>
    </section>
  )
}
