import { AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import useSearchProducts from '../../hooks/useSearchProducts';
import { useAppContext } from '../../contexts/app.context';
import NavHeader from './NavHeader';
import { Logo } from '../icons';
import Button from '../shared/Button';
import { useQuery } from 'react-query';
import { purchasesStatus } from '../../constants/purchase';
import { purchaseService } from '../../services';
import { Popover } from '../shared';
import noproduct from 'src/assets/images/no-product.png';
import { formatCurrency } from '../../utils';
import { path } from '../../constants';
import { useCartStore } from '../../hooks/useCartStore';



const MAX_PURCHASES = 5;

function Header() {
  const { register, onSubmitSearch } = useSearchProducts();

  const { isAuthenticated } = useAppContext();

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchase', purchasesStatus.inCart],
    queryFn: () => purchaseService.getPurchases(),
    enabled: isAuthenticated,
  });

  const purchasesInCart = purchasesInCartData?.data.data;

  const { items, itemCount } = useCartStore();

  return (
    <header className="bg-[linear-gradient(-180deg,#f53d2d,#f63)]">
      <div className="container">
        <NavHeader />

        <nav className="grid w-full grid-cols-10 space-x-4 py-4">
          <div className="col-span-2">
            <Link to="/">
              <Logo className="h-full w-28 fill-white lg:w-44" />
            </Link>
          </div>

          <form className="col-span-7" onSubmit={onSubmitSearch}>
            <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AiOutlineSearch />
              </div>
              <input
                type="search"
                {...register('name')}
                id="default-search"
                className="block w-full rounded-sm border-none border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 outline-none"
                placeholder="FREESHIP ĐƠN TỪ 0 Đ..."
                required
              />
              <Button type="submit" primary className="absolute right-2.5 bottom-2.5">
                <AiOutlineSearch />
              </Button>
            </div>
          </form>

          <div className="flex-center col-span-1 justify-self-end">
            <Popover
              renderPopover={
                <div className="relative max-w-[400px] space-x-2 rounded-sm border border-gray-200 bg-white p-4 text-sm shadow-md">
                  {items.length > 0 ? (
                    <div className="p-2">
                      <p className="capitalize text-gray-400">Sản phẩm mới thêm</p>

                      {items.slice(0, MAX_PURCHASES).map((item) => (
                        <div key={item.productId} className="flex py-2 hover:bg-gray-100">
                          <div className="flex-shrink-0">
                            <img src={item.images[0].url} alt={item.name} className="h-11 w-11 object-cover" />
                          </div>
                          <div className="ml-2 flex-grow overflow-hidden">
                            <p className="truncate">{item.name}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="text-primary">đ{formatCurrency(item.price)}</span>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-sx capitalize text-gray-500">
                          {itemCount > MAX_PURCHASES ? itemCount - MAX_PURCHASES : ''} Thêm hàng vào giỏ
                        </p>
                        <Link to={path.cart} className="rounded-sm bg-primary p-2 text-white hover:bg-opacity-80">
                          Xem giỏ hàng
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[300px] w-[300px] flex-col items-center justify-center p-2">
                      <img src={noproduct} alt="no purchase" className="h-24 w-24" />
                      <div className="mt-3 capitalize">Chưa có sản phẩm</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to="/cart" className="relative">
                <AiOutlineShoppingCart className="cursor-pointer text-xl text-white lg:text-2xl" />
                {items.length > 0 ? (
                  <span className="absolute -top-2 left-3 rounded-full bg-white px-[9px] py-[1px] text-xs text-primary">
                    {items.length}</span>
                ): ''
              }
              </Link>
            </Popover>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
