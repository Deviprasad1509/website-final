"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"

interface CartItem {
  id: string
  book_id: string
  qty: number
  unit_price: number
  books: {
    title: string
    cover_url?: string
  }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }

const initialState: CartState = {
  items: [],
  isOpen: false
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(item => item.book_id === action.payload.book_id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.book_id === action.payload.book_id
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, qty: Math.max(1, action.payload.qty) }
            : item
        )
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: []
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.payload
      }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (item: Omit<CartItem, "id">) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.book_id}-${Date.now()}`
    }
    dispatch({ type: "ADD_ITEM", payload: cartItem })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, qty: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, qty } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const setCartOpen = (open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open })
  }

  const getTotal = () => {
    return state.items.reduce((total, item) => total + (item.unit_price * item.qty), 0)
  }

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.qty, 0)
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
    getTotal,
    getItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

