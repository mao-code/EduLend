'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type AccountStore,
  createAccountStore,
  initAccountStore,
} from '@/stores/account'

export type AccountStoreApi = ReturnType<typeof createAccountStore>

export const AccountStoreContext = createContext<AccountStoreApi | undefined>(
  undefined,
)

export interface AccountStoreProviderProps {
  children: ReactNode
}

export const AccountStoreProvider = ({
  children,
}: AccountStoreProviderProps) => {
  const storeRef = useRef<AccountStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createAccountStore(initAccountStore())
  }

  return (
    <AccountStoreContext.Provider value={storeRef.current}>
      {children}
    </AccountStoreContext.Provider>
  )
}

export const useAccountStore = <T,>(
  selector: (store: AccountStore) => T,
): T => {
  const accountStoreContext = useContext(AccountStoreContext)

  if (!accountStoreContext) {
    throw new Error(`useAccountStore must be used within AccountStoreProvider`)
  }

  return useStore(accountStoreContext, selector)
}
