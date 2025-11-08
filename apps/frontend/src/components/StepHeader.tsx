interface StepHeaderProps {
  index: number
  total: number
  title: string
  prompt: string
  badge: string
}

export function StepHeader({ index, total, title, prompt, badge }: StepHeaderProps) {
  return (
    <header className="step-header">
      <div className="step-meta">
        <span className="badge">{badge}</span>
        <span className="counter">
          {index + 1} / {total}
        </span>
      </div>
      <h2>{title}</h2>
      <p>{prompt}</p>
    </header>
  )
}
