'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type PriceStore,
  createPriceStore,
  initPriceStore,
} from '@/stores/price'

export type PriceStoreApi = ReturnType<typeof createPriceStore>

export const PriceStoreContext = createContext<PriceStoreApi | undefined>(
  undefined,
)

export interface PriceStoreProviderProps {
  children: ReactNode
}

export const PriceStoreProvider = ({
  children,
}: PriceStoreProviderProps) => {
  const storeRef = useRef<PriceStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createPriceStore(initPriceStore())
  }

  return (
    <PriceStoreContext.Provider value={storeRef.current}>
      {children}
    </PriceStoreContext.Provider>
  )
}

export const usePriceStore = <T,>(
  selector: (store: PriceStore) => T,
): T => {
  const priceStoreContext = useContext(PriceStoreContext)

  if (!priceStoreContext) {
    throw new Error(`usePriceStore must be used within PriceStoreProvider`)
  }

  return useStore(priceStoreContext, selector)
}
