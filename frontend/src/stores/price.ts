import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

export type PriceState = {
    prices: string[];
}

export type PriceActions = {
    setPrice: (price: string) => void;
}

export type PriceStore = PriceState & PriceActions;

export const initPriceStore = (): PriceState => {
    return {
        prices: []
    }
} 

export const defaultPriceState: PriceState = {
    prices: []
}

export const createPriceStore = (initState: PriceState = defaultPriceState) => {
    return createStore<PriceStore>()(
        persist(
            (set) => (
                {
                    ...initState,
                    setPrice: (price: string) => {
                        set((state) => ({ prices: [...state.prices, price] }));
                    }
                }
            ), 
            {
                name: 'price-store', // localStorage key
                partialize: (state) => ({ prices: state.prices }),
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    );
}