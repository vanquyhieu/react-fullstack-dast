export type imagesType = {
    _id?: string;
    url: string;
  };

export interface Product {
    _id: string;
    id:number;
    name: string;
    price: number;
    price_before_discount: number;
    description: string;
    category: {
        _id: string;
        name: string;
    };
    images: imagesType[];
    image: string;
    rating: number;
    quantity: number;
    sold: number;
    view: number;
    createAt: string;
    updateAt: string;
}

export interface ProductList {
    products: Product[];
    pagination:{
        totalRecords: number ;
        totalPages:number ;
        currentPage:number ;
        recordsPerPage:number ;
    }
}

export interface ProductListConfig {
    page?: number | string;
    totalRecords?: number;
    totalPages?:number;
    currentPage?:number;
    recordsPerPage?:number;
    limit?: number | string;
    sort_by?: 'createAt' | 'view' | 'sold' | 'price';
    order?: 'asc' | 'desc';
    exclude?: string;
    rating_filter?: number | string;
    price_max?: number | string;
    price_min?: number | string;
    name?: string;
    category?: string;
}
