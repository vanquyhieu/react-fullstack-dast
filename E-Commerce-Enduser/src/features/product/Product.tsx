import { Link } from 'react-router-dom';
import { Product as ProductType } from '../../types/product.type';
import ProductRating from './ProductRating';
import { path } from '../../constants';
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from '../../utils';

interface ProductProps {
  product: ProductType;
}

const Product = ({ product }: ProductProps) => {
  return (
    <Link
      to={`${path.home}${generateNameId({
        id: product._id,
        name: product.name,
      })}`}
    >
      <div className="overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md">
        <div className="relative w-full pt-[100%]">
          <img src={product.images[0].url} alt="product" className="absolute top-0 left-0 h-full w-full bg-white object-cover" />
        </div>

        <div className="overflow-hidden p-2">
          <div className="min-h-[2rem] text-base line-clamp-2">{product.name}</div>

          <div className="mt-3 flex justify-center text-red-600">
              <span className=" text-xl">₫</span>
              <span className="text-xl">{formatCurrency(product.price)}</span>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <ProductRating rating={product.rating} />
            <div className="ml-2 text-sm">
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className="ml-1">Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
