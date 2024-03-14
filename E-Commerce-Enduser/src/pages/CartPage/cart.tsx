import { Link } from 'react-router-dom';
import noproduct from 'src/assets/images/no-product.png';
import { formatCurrency, generateNameId } from '../../utils';
import { Button, Input } from '../../components/shared';
import { useCartStore } from '../../hooks/useCartStore';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { path } from '../../constants';
import { Purchase } from '../../types/purchase.type';

export default function Cart() {
  const { items, total, itemCount, removeItem, increaseQuantity, decreaseQuantity, placeOrder, isLoading } = useCartStore();

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        {items.length > 0 ? (
          <>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        <input type="fcheckbox" className="h-5 w-5 accent-orange" />
                      </div>
                      <div className="lex-grow text-black">Sản phẩm</div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng</div>
                      <div className="col-span-1">Số tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className="mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              <input type="checkbox" className="h-5 w-5 accent-orange" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  className="h-20 w-20 flex-shrink-0"
                                  to={`${path.home}${generateNameId({
                                    name: item.name,
                                    id: item.productId,
                                  })}`}
                                >
                                  <img alt={item.name} src={item.images[0].url} />
                                </Link>
                                <div className="flex-grow px-2 pt-1 pb-2">
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: item.name,
                                      id: item.productId,
                                    })}`}
                                    className="text-left line-clamp-2"
                                  >
                                    {item.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <div className="grid grid-cols-5 items-center">
                            <div className="col-span-2">
                              <div className="flex items-center justify-center">
                                <span className="text-gray-300 line-through">₫{formatCurrency(item.price_before_discount)}</span>
                                <span className="ml-3">₫{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                            {/* quantity */}
                            <div className="col-span-1">
                              <div className={'flex items-center'}>
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600"
                                  onClick={() => decreaseQuantity(item.productId)}
                                >
                                  <AiOutlineMinus />
                                </button>
                                <Input
                                  type="text"
                                  value={item.buy_count}
                                  className="flex-center h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-center text-gray-600"
                                  onlyNumber
                                />
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600"
                                  onClick={() => increaseQuantity(item.productId)}
                                >
                                  <AiOutlinePlus />
                                </button>
                              </div>
                            </div>
                            {/* quantity */}
                            <div className="col-span-1">
                              <span className="text-orange">₫{formatCurrency(item.price * item.buy_count)}</span>
                            </div>
                            <div className="col-span-1">
                              <button className="bg-none text-black transition-colors hover:text-orange" onClick={() => removeItem(item.productId)}>
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center pr-3">
                  <input type="checkbox" className="h-5 w-5 accent-orange" />
                </div>
                <button className="mx-3 border-none bg-none">Chọn tất cả ({items.length})</button>
                <button className="mx-3 border-none bg-none">Xóa</button>
              </div>

              <div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center sm:justify-end">
                    <div>Tổng thanh toán ({items.length} sản phẩm):</div>
                    <div className="ml-2 text-2xl text-orange">₫{formatCurrency(total)}</div>
                  </div>
                  <div className="flex items-center text-sm sm:justify-end">
                    <div className="text-gray-500">Tiết kiệm</div>
                    <div className="ml-6 text-orange">₫{formatCurrency(total)}</div>
                  </div>
                </div>
                <Button
                  className="mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0"
                  onClick={() => {
                    items.map((item: Purchase) => {
                      placeOrder({
                        productId: item.productId,
                        name:item.name,
                        buy_count: item.buy_count,
                        price:item.price,
                        price_before_discount:item.price_before_discount,
                        status: 0,
                      });
                    });
                  }}
                  disabled={isLoading}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <img src={noproduct} alt="no purchase" className="mx-auto h-24 w-24" />
            <div className="mt-5 font-bold text-gray-400">Giỏ hàng của bạn còn trống</div>
            <div className="mt-5 text-center">
              <Link to={path.home} className=" rounded-sm bg-orange px-10 py-2  uppercase text-white transition-all hover:bg-orange/80">
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
