import { useQuery } from 'react-query';
import { Pagination } from '../../components/shared';
import { AsideFilter, SortProductList, Product } from '../../features/product';
import { useQueryConfig } from '../../hooks';
import { categoryService, productService } from '../../services';
import { ProductListConfig } from '../../types/product.type';

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


  return (
    <div className="container pb-4 ml-10">
      {productsData && (
        <div className="flex-wrap items-center gap-3 my-3">
          <div className="col-span-10">
            <AsideFilter categoriesAsider={categoriesData?.data.data.categories || []} queryConfig={queryConfig} />
          </div>
          <div className="col-span-10">
            <SortProductList
              queryConfig={queryConfig}
              pageSize={productsData.data.data.pagination.totalPages}
              page={productsData.data.data.pagination.currentPage}
            />
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