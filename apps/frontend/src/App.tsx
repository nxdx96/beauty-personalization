import "./styles/global.css"

import { Wizard } from "./components/Wizard"

export function App() {
  return (
    <div className="app-shell">
      <main className="layout">
        <Wizard />
      </main>
    </div>
  )
}

export default App
