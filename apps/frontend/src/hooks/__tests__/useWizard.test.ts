import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WIZARD_STEPS } from "../../data/steps"
import { useWizard } from "../useWizard"

describe("useWizard", () => {
  it("starts in an idle state until start() is called", () => {
    const { result } = renderHook(() => useWizard())

    expect(result.current.started).toBe(false)
    expect(result.current.currentStep).toBeNull()

    act(() => result.current.start())

    expect(result.current.started).toBe(true)
    expect(result.current.currentStep?.id).toBe(WIZARD_STEPS[0].id)
  })

  it("requires a selection before advancing to the next step", () => {
    const { result } = renderHook(() => useWizard())

    act(() => result.current.start())
    expect(result.current.canAdvance).toBe(false)

    const firstStep = WIZARD_STEPS[0]
    act(() => result.current.toggle(firstStep.id, firstStep.data[0].id))
    expect(result.current.canAdvance).toBe(true)

    act(() => result.current.next())
    expect(result.current.currentStep?.id).toBe(WIZARD_STEPS[1].id)
    expect(result.current.canAdvance).toBe(false)
  })
})
