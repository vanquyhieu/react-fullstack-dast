import { useQuery } from 'react-query';
import { Pagination } from '../../components/shared';
import { AsideFilter, SortProductList, Product } from '../../features/product';
import { useQueryConfig } from '../../hooks';
import { categoryService, productService } from '../../services';
import { ProductListConfig } from '../../types/product.type';
import Carousel from '../../components/shared/SimpleSlider';
import './HomePage.css';

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};

const HomePage = () => {
  const queryConfig = useQueryConfig();

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productService.getProducts(queryConfig as ProductListConfig);
    },
  });
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => {
      return categoryService.getCategories();
    },
    keepPreviousData: true,
  });

  let slides = [
    'https://cf.shopee.vn/file/vn-50009109-81922ac443d8bbfae6edf3996b7d0d65_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-5b63794190c80c2cfe3d9bef641e14e0_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-f5ee45d41f992772f18955eeab3a8c5f_xxhdpi',
  ];

  return (
    <div className="container pb-4 ml-10">
      {productsData && (
        <div className="flex-grow items-center gap-3 my-3 ">
          <div className="section-banner-hotword--no-skin flex gap-3">
            <Carousel slides={slides}></Carousel>
            <div className="flex-col w-[30%] ">
              <div className="overflow-hidden">
                <img src="https://cf.shopee.vn/file/vn-50009109-80ac34f22c7e222b584954976ee2ca3f_xhdpi"></img>
              </div>
              <div className="overflow-hidden">
                <img src="https://cf.shopee.vn/file/vn-50009109-93a785d120340b6b6ea24a8d767a205e_xhdpi"></img>
              </div>
            </div>
          </div>
          <div className="col-span-10">
            <AsideFilter categoriesAsider={categoriesData?.data.data.categories || []} queryConfig={queryConfig} />
          </div>
          <div className="col-span-10">
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {productsData &&
                productsData.data.data.products.map((product) => (
                  <div className="col-span-1" key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
            </div>
            <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.currentPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
