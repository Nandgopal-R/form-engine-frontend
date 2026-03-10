/**
 * Toast Notification System
 *
 * This hook provides a global toast notification system using a reducer pattern.
 * It manages toast lifecycle including creation, updates, dismissal, and removal.
 *
 * Key Features:
 * - Single toast limit to avoid overwhelming users (TOAST_LIMIT = 1)
 * - Long auto-remove delay to give users time to read (1000000ms = ~16 minutes)
 * - Global state management using pub/sub pattern
 * - Programmatic control for individual toasts
 *
 * The system uses a custom reducer for state management and a listener pattern
 * to notify components of state changes without React context.
 */

import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

// Only show one toast at a time to avoid overwhelming users
const TOAST_LIMIT = 1
// Long delay to ensure user has time to read the toast
// In practice, most toasts will be dismissed manually by user action
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Action types for the reducer pattern
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

// Counter for generating unique toast IDs
let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: Array<ToasterToast>
}

// Store timeout references for proper cleanup
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Queue toast for removal after delay
// This prevents memory leaks and ensures proper cleanup
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Reducer function that manages toast state transitions
// Handles all toast lifecycle operations in a predictable way
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        // Add new toast to beginning of array and enforce limit
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        // Update existing toast by matching ID
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        // Queue specific toast for removal
        addToRemoveQueue(toastId)
      } else {
        // Queue all toasts for removal
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        // Close toasts immediately (they'll be removed after delay)
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        // Remove all toasts
        return {
          ...state,
          toasts: [],
        }
      }
      // Remove specific toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Global listener array for pub/sub pattern
const listeners: Array<(state: State) => void> = []

// In-memory state store that persists across component unmounts
let memoryState: State = { toasts: [] }

// Dispatch function that updates state and notifies all listeners
// This is the heart of our pub/sub system
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

/**
 * Create a new toast notification
 *
 * @param props - Toast properties (title, description, variant, etc.)
 * @returns Object with toast ID, dismiss function, and update function
 */
function toast({ ...props }: Toast) {
  const id = genId()

  // Update function to modify existing toast
  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })

  // Dismiss function to close toast immediately
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  // Add toast to the system
  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        // Auto-dismiss when user closes toast
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * React hook for accessing toast system
 *
 * @returns Toast state and actions
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  // Subscribe to global state changes
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      // Clean up listener on unmount
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, []) // Empty dependency array - we only want to setup/teardown listener

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
