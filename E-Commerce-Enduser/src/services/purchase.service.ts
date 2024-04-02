import { Purchase, PurchaseListStatus } from "../types/purchase.type.ts";
import { SuccessResponseApi } from "../types/util.type.ts";
import { axiosClient } from "../library/axiosClient.ts";

const URL = 'http://localhost:3000/api/v1/purchases';

const purchaseService = {
    addToCart: (body: { id: number; buy_count: number }) => {
        return axiosClient.post<SuccessResponseApi<Purchase>>(
            `${URL}/add-to-cart`,
            body,
        );
    },
    getPurchases: () => {
        return axiosClient.get<SuccessResponseApi<Purchase[]>>(`${URL}`);
    },
    buyProducts: (body: { id: number; buy_count: number }) => {
        return axiosClient.post<SuccessResponseApi<Purchase>>(
            `${URL}/add-to-cart`,
            body,
        );
    },
    updatePurchase: (body: { product_id: string; buy_count: number }) => {
        return axiosClient.put<SuccessResponseApi<Purchase>>(
            `${URL}/update-purchase`,
            body,
        );
    },
    deletePurchase: (purchaseIds: string[]) => {
        return axiosClient.delete<
            SuccessResponseApi<{ deleted_count: number }>
        >(`${URL}`, {
            data: purchaseIds,
        });
    },
};

export default purchaseService;
