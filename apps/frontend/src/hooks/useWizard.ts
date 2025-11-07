import { useEffect, useMemo, useReducer } from "react"

import { WIZARD_STEPS, type StepId, type WizardStep } from "../data/steps"

type WizardSelections = Record<StepId, string[]>

interface WizardState {
  started: boolean
  activeIndex: number
  selections: WizardSelections
}

type WizardAction =
  | { type: "START" }
  | { type: "TOGGLE"; stepId: StepId; traitId: string }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "RESET" }

export const WIZARD_STORAGE_KEY = "beauty-intake:v1"

const makeEmptySelections = () =>
  WIZARD_STEPS.reduce((acc, step) => {
    acc[step.id] = []
    return acc
  }, {} as WizardSelections)

const INITIAL_SELECTIONS = makeEmptySelections()

const INITIAL_STATE: WizardState = {
  started: false,
  activeIndex: 0,
  selections: INITIAL_SELECTIONS,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "START":
      return { ...state, started: true, activeIndex: 0 }
    case "TOGGLE": {
      const currentSelections = state.selections[action.stepId]
      const exists = currentSelections.includes(action.traitId)
      const nextSelections = exists
        ? currentSelections.filter((id) => id !== action.traitId)
        : [...currentSelections, action.traitId]

      return {
        ...state,
        selections: {
          ...state.selections,
          [action.stepId]: nextSelections,
        },
      }
    }
    case "NEXT":
      return {
        ...state,
        activeIndex: Math.min(state.activeIndex + 1, WIZARD_STEPS.length),
      }
    case "PREV":
      return {
        ...state,
        activeIndex: Math.max(state.activeIndex - 1, 0),
      }
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}

const isBrowser = typeof window !== "undefined"

function normalizeSelections(selections: Partial<Record<string, string[]>> | undefined) {
  const base = makeEmptySelections()
  if (!selections) return base
  WIZARD_STEPS.forEach((step) => {
    const incoming = Array.isArray(selections[step.id]) ? selections[step.id]! : []
    base[step.id] = incoming.filter((value) => step.data.some((option) => option.id === value))
  })
  return base
}

function loadPersistedState(): WizardState | null {
  if (!isBrowser) return null
  try {
    const raw = window.localStorage.getItem(WIZARD_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<WizardState>
    if (!parsed || typeof parsed !== "object") return null
    const started = Boolean(parsed.started)
    const activeIndex =
      typeof parsed.activeIndex === "number"
        ? Math.min(Math.max(parsed.activeIndex, 0), WIZARD_STEPS.length)
        : 0
    return {
      started,
      activeIndex: started ? activeIndex : 0,
      selections: normalizeSelections(parsed.selections),
    }
  } catch {
    return null
  }
}

function persistState(state: WizardState) {
  if (!isBrowser) return
  try {
    if (!state.started) {
      window.localStorage.removeItem(WIZARD_STORAGE_KEY)
      return
    }
    window.localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore storage errors
  }
}

export function useWizard() {
  const [state, dispatch] = useReducer(
    wizardReducer,
    INITIAL_STATE,
    () => loadPersistedState() ?? INITIAL_STATE,
  )

  useEffect(() => {
    persistState(state)
  }, [state])

  const currentStep: WizardStep | null =
    state.started && state.activeIndex < WIZARD_STEPS.length
      ? WIZARD_STEPS[state.activeIndex]
      : null

  const isSummary = state.started && state.activeIndex >= WIZARD_STEPS.length

  const selections = state.selections

  const summary = useMemo(() => {
    return WIZARD_STEPS.map((step) => ({
      step,
      selections: selections[step.id].map(
        (value) => step.data.find((option) => option.id === value)?.label ?? value,
      ),
    }))
  }, [selections])

  const canAdvance =
    isSummary || (currentStep ? selections[currentStep.id].length > 0 : false)

  return {
    steps: WIZARD_STEPS,
    started: state.started,
    currentStep,
    selections,
    summary,
    isSummary,
    canAdvance,
    start: () => dispatch({ type: "START" }),
    toggle: (stepId: StepId, traitId: string) =>
      dispatch({ type: "TOGGLE", stepId, traitId }),
    next: () => dispatch({ type: "NEXT" }),
    prev: () => dispatch({ type: "PREV" }),
    reset: () => dispatch({ type: "RESET" }),
  }
}
