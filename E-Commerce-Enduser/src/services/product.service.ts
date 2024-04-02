import { axiosClient } from '../library/axiosClient.ts';
import { Product, ProductList, ProductListConfig } from '../types/product.type';
import { SuccessResponseApi } from '../types/util.type.ts';

const URL = 'http://localhost:3000/api/v1/products';

const productService = {
  getProducts: (params: ProductListConfig) => {
      return axiosClient.get<SuccessResponseApi<ProductList>>(`${URL}/`,{params});
  },
  getProductDetail: (id: string) => {
    return axiosClient.get<SuccessResponseApi<Product>>(`${URL}/${id}`);
  },
};

export default productService;
