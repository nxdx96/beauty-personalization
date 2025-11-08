import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { App } from "../../App"

describe("App shell", () => {
  it("renders the start personalization button", () => {
    render(<App />)
    expect(screen.getByRole("button", { name: /start personalizing/i })).toBeInTheDocument()
  })

  it("advances to the first wizard step after starting", () => {
    render(<App />)
    const [startButton] = screen.getAllByRole("button", { name: /start personalizing/i })
    fireEvent.click(startButton)
    expect(screen.getByRole("heading", { name: /skin type/i })).toBeInTheDocument()
  })
})
