import './styles/global.css'

export function App() {
  return (
    <div className="app-shell">
      <main className="layout">
        <section>
          <h1>Beauty Personalization</h1>
          <p>
            Phase 1 wizard coming soon. Click the start button below to begin gathering user traits.
          </p>
        </section>
        <section>
          <button type="button">Start Personalization</button>
        </section>
      </main>
    </div>
  )
}

export default App
