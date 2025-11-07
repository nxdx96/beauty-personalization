import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { App } from "../../App"

describe("App shell", () => {
  it("renders the start personalization button", () => {
    render(<App />)
    expect(screen.getByRole("button", { name: /start personalization/i })).toBeInTheDocument()
  })
})
