import DOMPurify from 'dompurify';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '../../utils';
import { productService, purchaseService } from '../../services';
import { ProductListConfig, Product as ProductType } from '../../types/product.type';
import { purchasesStatus } from '../../constants/purchase';
import { Product, ProductRating } from '../../features/product';
import { Button, QuantityController } from '../../components/shared';
import { useCartStore } from '../../hooks/useCartStore';
import useAuth from '../../hooks/useAuth';

function ProductDetailPage() {
  const { addItem, placeOrder } = useCartStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [buyCount, setBuyCount] = useState(1);
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const queryClient = useQueryClient();

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseService.getPurchases(),
  });

  console.log('purchasesInCartData', purchasesInCartData);

  const { data: productData } = useQuery({
    queryKey: ['product', { id }],
    queryFn: () => {
      return productService.getProductDetail(id);
    },
    keepPreviousData: true,
  });
  const product = productData?.data.data;
  console.log('product?.description', product?.description);

  // const raw = product?.description.split('.');
  // console.log('raw', raw);

  const queryConfig: ProductListConfig = {
    limit: '20',
    page: '1',
    category: product?.category._id,
  };

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productService.getProducts(queryConfig);
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: Boolean(product),
  });

  const imageRef = useRef<HTMLImageElement>(null);

  // lấy 5 ảnh từ 0 1 2 3 4 => cắt qua slice sẽ không lấy số cuối nên phải để 5
  const [currentImagesIndex, setCurrentImagesIndex] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState('');

  const currentImages = useMemo(() => {
    return product ? product.images.slice(...currentImagesIndex) : [];
  }, [product, currentImagesIndex]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0].url);
    }
  }, [product]);

  const prev = () => {
    if (currentImagesIndex[0] > 0) {
      setCurrentImagesIndex((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };

  const next = () => {
    if (currentImagesIndex[1] < (product as ProductType).images.length) {
      setCurrentImagesIndex((prev) => [prev[0] + 1, prev[1] + 1]);
    }
  };

  const handleChooseImage = (img: string) => {
    setActiveImage(img);
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const image = imageRef.current as HTMLImageElement;
    const rect = e.currentTarget.getBoundingClientRect();

    const { naturalHeight, naturalWidth } = image;
    const width = naturalHeight;
    const height = naturalWidth;

    const { offsetX, offsetY } = e.nativeEvent;
    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);

    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    image.style.maxWidth = 'unset';
    image.style.top = `${top}px`;
    image.style.left = `${left}px`;
  };

  const handleRemoveZoom = () => {
    const image = imageRef.current as HTMLImageElement;
    image.removeAttribute('style');
  };

  const handleBuyCount = (count: number) => {
    setBuyCount(count);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-200 py-6">
      <div className="container">
        <div className="bg-white p-4 shadow">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div className="relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow" onMouseMove={handleZoom} onMouseLeave={handleRemoveZoom}>
                <img
                  src={activeImage}
                  alt={product.name}
                  ref={imageRef}
                  className="pointer-events-none absolute top-0 left-0 h-full w-full bg-white object-cover"
                />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" onClick={prev}>
                  <BsChevronLeft />
                </button>
                {currentImages.map((img) => {
                  const isActive = img.url === activeImage;
                  return (
                    <div
                      className="relative w-full pt-[100%]"
                      key={img._id}
                      onMouseEnter={() => handleChooseImage(img.url)}
                      aria-hidden="true"
                      role="button"
                      tabIndex={0}
                    >
                      <img src={img.url} alt={product.name} className="absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover" />
                      {isActive && <div className="absolute inset-0 border-2 border-primary" />}
                    </div>
                  );
                })}
                <button className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white" onClick={next}>
                  <BsChevronRight />
                </button>
              </div>
            </div>
            {/* product detail */}
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">{product.name}</h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-primary text-primary">{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName="h-5 w-5 fill-primary text-primary"
                    nonActiveClassName="h-5 w-5 fill-current text-gray-300"
                  />
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className="ml-1 text-gray-500">Đã bán</span>
                </div>
              </div>
              {/* price */}
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                  {formatCurrency(product.price_before_discount)}
                  &nbsp;VND
                </div>
                <div className="ml-3 text-3xl font-medium text-red-600">{formatCurrency(product.price)}&nbsp;VND</div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                </div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <div className="capitalize text-gray-500">Số lượng</div>
                <QuantityController onDecrease={handleBuyCount} onIncrease={handleBuyCount} onType={handleBuyCount} value={buyCount} max={product.quantity} />
                <div className="ml-6 text-sm text-gray-500">{product.quantity} sản phẩm có sẵn</div>
              </div>
              {isAuthenticated === true ? (
                <div className="mt-8 flex items-center space-x-4">
                  <Button
                    primary
                    outline
                    LeftIcon={AiOutlineShoppingCart}
                    onClick={() => {
                      addItem({
                        product_Id: product._id,
                        name: product.name,
                        price: product.price,
                        price_before_discount: product.price_before_discount,
                        buy_count: buyCount,
                        images: product.images,
                      });
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    primary
                    onClick={() => {
                      placeOrder({
                        id: product._id,
                        buy_count: buyCount,
                      });
                    }}
                  >
                    Mua ngay
                  </Button>
                </div>
              ) : (
                <div className="mt-8 flex items-center space-x-4">
                  <Button primary outline disable>
                    Thêm vào giỏ hàng
                  </Button>
                  <Button primary outline disable>
                    Mua ngay
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-8 bg-white p-4 shadow">
          <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">Mô tả sản phẩm</div>
          {/* <div className="mx-4 mt-12 mb-4 text-sm leading-loose">
            {raw?.map((item) => {
              return (
                <div>
                  <p className="text-gray-700">{item}</p>
                  <br />
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
      <div className="mt-6">
        <div className="container">
          <h3 className="uppercase text-gray-400">Sản phẩm tương tự</h3>
          <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {productsData &&
              productsData.data.data.products.map((product) => (
                <div className="col-span-1" key={product._id}>
                  <Product product={product} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
