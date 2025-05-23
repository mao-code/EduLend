import { createStore } from "zustand/vanilla";
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
            balance: '0',
            chainId: undefined,
            network: undefined,
        }
    }
} 

export const defaultAccountState: AccountState = {
    account: {
        address: undefined,
        balance: '0',
        chainId: undefined,
        network: undefined,
    }
}

export const createAccountStore = (initState: AccountState = defaultAccountState) => {
    return createStore<AccountStore>()((set) => ({
        ...initState,
        setAccount: (account: AccountType) => {
            set(() => ({ account: account }))
        }
    }))
}