import { axiosClient } from "../library/axiosClient.ts";
import { Product, ProductList, ProductListConfig } from "../types/product.type";
import { SuccessResponseApi } from "../types/util.type.ts";

const URL = 'http://localhost:3000/api/v1/products';

const productService = {
    getProducts: (params: ProductListConfig) => {
        const category = params.category
        if(category){
            return axiosClient.get<SuccessResponseApi<ProductList>>(`${URL}/product-list/${category}`);
        }
        else return axiosClient.get<SuccessResponseApi<ProductList>>(`${URL}/product-list/`);
    },
    getProductDetail: (id: string) => {
        return axiosClient.get<SuccessResponseApi<Product>>(`${URL}/${id}`);
    },
};

export default productService;
