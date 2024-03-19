import { axiosClient } from "../library/axiosClient.ts";
import { Category } from "../types/category.type.ts";
import { SuccessResponseApi } from "../types/util.type.ts";

interface CategoryData {
            categories: Category[]
}

const URL = '/api/v1/categories';

const categoryService = {
    getCategories: () => {
        return axiosClient.get<SuccessResponseApi<CategoryData>>(URL);
    },
    getCategorieById: () => {
        return axiosClient.get<SuccessResponseApi<CategoryData>>(`${URL}/category:id`);
    },
};

export default categoryService;
