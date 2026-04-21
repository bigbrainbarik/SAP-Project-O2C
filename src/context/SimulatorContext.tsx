import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from 'react'
import type {
  DocumentKey,
  ScenarioType,
  SimulationStep,
  SimulatorMessage,
  SimulatorState,
  ThemeMode,
} from '../types'
import { STEP_ORDER, getStepIndex } from '../utils/steps'

const STORAGE_KEY = 'o2c-simulator-v1'

const initialState: SimulatorState = {
  scenario: null,
  currentStep: 'inquiry',
  completedSteps: [],
  documents: {
    inquiryId: null,
    quotationId: null,
    salesOrderId: null,
    deliveryId: null,
    goodsIssueId: null,
    billingId: null,
    paymentId: null,
  },
  messages: [],
  preferences: {
    theme: 'light',
    soundEnabled: true,
  },
}

type Action =
  | { type: 'SET_SCENARIO'; payload: ScenarioType }
  | { type: 'SET_CURRENT_STEP'; payload: SimulationStep }
  | { type: 'COMPLETE_STEP'; payload: SimulationStep }
  | { type: 'SET_DOCUMENT'; payload: { key: DocumentKey; value: string } }
  | { type: 'PUSH_MESSAGE'; payload: SimulatorMessage }
  | { type: 'DISMISS_MESSAGE'; payload: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SOUND' }
  | {
      type: 'HYDRATE'
      payload: {
        currentStep: SimulationStep
        completedSteps: SimulationStep[]
        documents: SimulatorState['documents']
        preferences: SimulatorState['preferences']
      }
    }
  | { type: 'RESET_SIMULATION' }

const sanitizeSteps = (steps: SimulationStep[]): SimulationStep[] =>
  steps.filter((step) => STEP_ORDER.includes(step))

const reducer = (state: SimulatorState, action: Action): SimulatorState => {
  switch (action.type) {
    case 'SET_SCENARIO':
      return { ...state, scenario: action.payload }
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload }
    case 'COMPLETE_STEP': {
      const next = state.completedSteps.includes(action.payload)
        ? state.completedSteps
        : [...state.completedSteps, action.payload]
      return { ...state, completedSteps: sanitizeSteps(next) }
    }
    case 'SET_DOCUMENT':
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.payload.key]: action.payload.value,
        },
      }
    case 'PUSH_MESSAGE':
      return {
        ...state,
        messages: [action.payload, ...state.messages].slice(0, 8),
      }
    case 'DISMISS_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      }
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] }
    case 'TOGGLE_THEME':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          theme: state.preferences.theme === 'light' ? 'dark' : 'light',
        },
      }
    case 'TOGGLE_SOUND':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          soundEnabled: !state.preferences.soundEnabled,
        },
      }
    case 'HYDRATE':
      return {
        ...state,
        currentStep: action.payload.currentStep,
        completedSteps: sanitizeSteps(action.payload.completedSteps),
        documents: action.payload.documents,
        preferences: action.payload.preferences,
      }
    case 'RESET_SIMULATION':
      return {
        ...state,
        scenario: null,
        currentStep: 'inquiry',
        completedSteps: [],
        documents: initialState.documents,
        messages: [],
      }
    default:
      return state
  }
}

interface SimulatorContextValue {
  state: SimulatorState
  setScenario: (scenario: ScenarioType) => void
  setCurrentStep: (step: SimulationStep) => void
  completeStep: (step: SimulationStep) => void
  setDocument: (key: DocumentKey, value: string) => void
  pushMessage: (message: Omit<SimulatorMessage, 'id'>) => void
  dismissMessage: (id: string) => void
  clearMessages: () => void
  toggleTheme: () => void
  toggleSound: () => void
  resetSimulation: () => void
  canAccessStep: (step: SimulationStep) => boolean
}

const SimulatorContext = createContext<SimulatorContextValue | null>(null)

const randomId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const isValidTheme = (theme: string): theme is ThemeMode =>
  theme === 'light' || theme === 'dark'

const isValidStep = (step: string): step is SimulationStep =>
  STEP_ORDER.includes(step as SimulationStep)

export const SimulatorProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as {
        currentStep?: string
        completedSteps?: string[]
        documents?: SimulatorState['documents']
        preferences?: { theme?: string; soundEnabled?: boolean }
      }

      const parsedCurrentStep = parsed.currentStep ?? ''
      const currentStep = isValidStep(parsedCurrentStep)
        ? parsedCurrentStep
        : initialState.currentStep

      const parsedTheme = parsed.preferences?.theme ?? ''
      const theme: ThemeMode = isValidTheme(parsedTheme)
        ? parsedTheme
        : initialState.preferences.theme

      const completedSteps = (parsed.completedSteps ?? []).filter((step) =>
        isValidStep(step),
      )

      dispatch({
        type: 'HYDRATE',
        payload: {
          currentStep,
          completedSteps,
          documents: parsed.documents ?? initialState.documents,
          preferences: {
            theme,
            soundEnabled:
              typeof parsed.preferences?.soundEnabled === 'boolean'
                ? parsed.preferences.soundEnabled
                : initialState.preferences.soundEnabled,
          },
        },
      })
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        documents: state.documents,
        preferences: state.preferences,
      }),
    )
  }, [state.currentStep, state.completedSteps, state.documents, state.preferences])

  useEffect(() => {
    const isDark = state.preferences.theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
  }, [state.preferences.theme])

  const value = useMemo<SimulatorContextValue>(() => {
    const canAccessStep = (step: SimulationStep): boolean => {
      const targetIndex = getStepIndex(step)
      const currentIndex = getStepIndex(state.currentStep)
      return targetIndex <= currentIndex || state.completedSteps.includes(step)
    }

    return {
      state,
      setScenario: (scenario) => dispatch({ type: 'SET_SCENARIO', payload: scenario }),
      setCurrentStep: (step) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
      completeStep: (step) => dispatch({ type: 'COMPLETE_STEP', payload: step }),
      setDocument: (key, value) =>
        dispatch({ type: 'SET_DOCUMENT', payload: { key, value } }),
      pushMessage: (message) =>
        dispatch({ type: 'PUSH_MESSAGE', payload: { id: randomId(), ...message } }),
      dismissMessage: (id) => dispatch({ type: 'DISMISS_MESSAGE', payload: id }),
      clearMessages: () => dispatch({ type: 'CLEAR_MESSAGES' }),
      toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
      toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
      resetSimulation: () => dispatch({ type: 'RESET_SIMULATION' }),
      canAccessStep,
    }
  }, [state])

  return (
    <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>
  )
}

export const useSimulator = (): SimulatorContextValue => {
  const context = useContext(SimulatorContext)
  if (!context) {
    throw new Error('useSimulator must be used inside SimulatorProvider')
  }
  return context
}
