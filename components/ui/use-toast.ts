// Inspired by react-hot-toast library
import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 3000

// 修改ToastType，增加更多支持的类型
type ToastType = "default" | "destructive" | "success" | "background" | "foreground"

type ToastState = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open: boolean
  type: ToastType
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: Omit<ToastState, "id">
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToastState> & Pick<ToastState, "id">
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToastState["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToastState["id"]
    }

interface State {
  toasts: ToastState[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { ...action.toast, id: genId(), open: true },
        ].slice(-TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        if (toastTimeouts.has(toastId)) {
          clearTimeout(toastTimeouts.get(toastId))
          toastTimeouts.delete(toastId)
        }
      } else {
        for (const [id, timeout] of toastTimeouts.entries()) {
          clearTimeout(timeout)
          toastTimeouts.delete(id)
        }
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToastState, "id" | "open">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToastState) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // 将完整的toast状态添加到ADD_TOAST操作中，避免类型错误
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      open: true,
    },
  })
  
  // 确保toast会自动消失
  // 创建并存储timeout以便于管理
  const timeoutId = setTimeout(() => {
    dismiss()
    // 额外再添加一个延时确保完全移除
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId: id })
    }, 300)
  }, TOAST_REMOVE_DELAY)
  
  toastTimeouts.set(id, timeoutId)

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    success: (props: Toast) => toast({ ...props, type: "success" }),
    error: (props: Toast) => toast({ ...props, type: "destructive" }),
  }
}

export { useToast, toast }
export type { ToastType } 