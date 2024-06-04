// @/contexts/quotationOrder.ts
import { Dispatch, Reducer, createContext, useContext } from "react";

type TDiscount = {
  type: "percentage" | "fixed";
  value: number;
};

export interface QuotationProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  image?: string;
  msrp: number;
  tier1: number;
  tier2: number;
  discount?: TDiscount;
  level1Category?: string;
}
export interface IQuotationOrderState {
  tier: "tier1" | "tier2" | "msrp";
  meta: {
    id?: string;
    name: string;
    abn: string;
    contact: string;
  } | null;
  products: QuotationProduct[];
  discount?: TDiscount;
}

export enum ActionType {
  UPDATE_TIER = "UPDATE_TIER",
  ADD_PRODUCT = "ADD_PRODUCT",
  REMOVE_PRODUCT = "REMOVE_PRODUCT",
  UPDATE_PRODUCT = "UPDATE_PRODUCT",
  SET_PRODUCT_DISCOUNT = "SET_PRODUCT_DISCOUNT",
  SET_GLOBAL_DISCOUNT = "SET_GLOBAL_DISCOUNT",
  UPDATE_META = "UPDATE_META",
}

export type TQuotationOrderActions =
  | {
      type: ActionType.UPDATE_TIER;
      payload: IQuotationOrderState["tier"];
    }
  | {
      type: ActionType.ADD_PRODUCT;
      payload: QuotationProduct;
    }
  | {
      type: ActionType.UPDATE_PRODUCT;
      payload: QuotationProduct;
    }
  | {
      type: ActionType.REMOVE_PRODUCT;
      payload: string;
    }
  | {
      type: ActionType.SET_PRODUCT_DISCOUNT;
      payload: {
        id: string;
        discount: TDiscount;
      };
    }
  | {
      type: ActionType.UPDATE_META;
      payload: {
        id?: string;
        name: string;
        abn: string;
        contact: string;
      };
    }
  | {
      type: ActionType.SET_GLOBAL_DISCOUNT;
      payload: TDiscount | undefined;
    };

export interface IQuotationOrderContextProps {
  state: IQuotationOrderState;
  dispatch: Dispatch<TQuotationOrderActions>;
}

export const initialQuotationOrderState: IQuotationOrderState = {
  tier: "msrp",
  meta: null,
  products: [],
};

const QuotationOrderContext = createContext<IQuotationOrderContextProps>({
  state: initialQuotationOrderState,
  dispatch: () => {},
});

export const quotationOrderReducer: Reducer<
  IQuotationOrderState,
  TQuotationOrderActions
> = (state, action) => {
  switch (action.type) {
    case ActionType.UPDATE_TIER:
      return {
        ...state,
        tier: action.payload,
      };
    case ActionType.ADD_PRODUCT:
      {
        const existingProduct = state.products.find(
          (product) => product.id === action.payload.id,
        );

        if (existingProduct) {
          return {
            ...state,
            products: state.products.map((product) =>
              product.id === action.payload.id
                ? {
                    ...product,
                    quantity: product.quantity + 1,
                  }
                : product,
            ),
          };
        }
      }

      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case ActionType.REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload,
        ),
      };
    case ActionType.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product,
        ),
      };
    case ActionType.SET_PRODUCT_DISCOUNT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? {
                ...product,
                discount: action.payload.discount,
              }
            : product,
        ),
      };
    case ActionType.UPDATE_META:
      return {
        ...state,
        meta: action.payload,
      };
    case ActionType.SET_GLOBAL_DISCOUNT:
      return {
        ...state,
        discount: action.payload,
      };
    default:
      return state;
  }
};

export const QuotationOrderContextConsumer = QuotationOrderContext.Consumer;
export const QuotationOrderContextProvider = QuotationOrderContext.Provider;

export const useQuotationOrderContext = () => {
  const context = useContext(QuotationOrderContext);

  if (!context) {
    throw new Error(
      "useQuotationOrderContext must be used within a QuotationOrderContextProvider",
    );
  }

  return context;
};

export default QuotationOrderContextProvider;
