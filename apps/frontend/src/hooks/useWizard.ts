import { useMemo, useReducer } from "react"

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

const INITIAL_SELECTIONS = WIZARD_STEPS.reduce((acc, step) => {
  acc[step.id] = []
  return acc
}, {} as WizardSelections)

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

export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE)

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
