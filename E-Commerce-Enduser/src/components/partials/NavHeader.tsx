import { AiOutlineGlobal } from 'react-icons/ai';
import { BsChevronDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { Avatar, Button, Popover } from '../shared';
import { path } from '../../constants';
import useAuth from '../../hooks/useAuth';

function NavHeader() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className=" flex items-center justify-end space-x-4 py-2">
      {/* language switcher */}
      <Popover
        renderPopover={
          <div className="relative rounded-sm border border-gray-200 bg-white shadow-md">
            <div className="flex flex-col py-2 pr-28 pl-3">
              <button className="py-2 px-3 text-left hover:text-primary">Tiếng Việt</button>
              <button className="mt-2 py-2 px-3 text-left hover:text-primary">English</button>
            </div>
          </div>
        }
      >
        <Button secondary RightIcon={BsChevronDown} LeftIcon={AiOutlineGlobal} className="text-white/80">
          Tiếng Việt
        </Button>
      </Popover>

      {/* user */}
      {isAuthenticated === true ? (
        <Popover
          renderPopover={
            <div className="relative rounded-sm border border-gray-200 bg-white shadow-md">
              <Link to={path.profile} className="block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500">
                Tài khoản của tôi
              </Link>
              <Link to={path.historyPurchase} className="block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500">
                Đơn mua
              </Link>
              <button
                onClick={() => {
                  logout();
                }}
                className="block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500"
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <Button secondary>
            <Avatar />
          </Button>
        </Popover>
      ) : (
        <div className="flex items-center">
          <Link to={path.register} className="mx-3 capitalize hover:text-white/70">
            Đăng ký
          </Link>
          <div className="border-r-[1px] border-r-white/40" />
          <Link to={path.login} className="mx-3 capitalize hover:text-white/70">
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavHeader;
