import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccountType } from "@/lib/metamask";

export type AccountState = {
    account: AccountType;
}

export type AccountActions = {
    setAccount: (account: AccountType) => void;
}

export type AccountStore = AccountState & AccountActions;

export const initAccountStore = (): AccountState => {
    return {
        account: {
            address: undefined,
            eduBalance: '0',
            mUSDTBalance: '0',
        }
    }
} 

export const defaultAccountState: AccountState = {
    account: {
        address: undefined,
        eduBalance: '0',
        mUSDTBalance: '0',
    }
}

export const createAccountStore = (initState: AccountState = defaultAccountState) => {
    return createStore<AccountStore>()(
        persist(
            (set) => (
                {
                    ...initState,
                    setAccount: (account: AccountType) => {
                        set(() => ({ account: account }))
                    }
                }
            ), 
            {
                name: 'account-store', // localStorage key
                partialize: (state) => ({ account: state.account }), // 可選，只儲存 account
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    );
}