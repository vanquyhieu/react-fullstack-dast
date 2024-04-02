import { ToastContainer } from 'react-toastify';
import { useRouteElements } from './routes';
import { useEffect } from 'react';
import { LocalStorageEventTarget } from './utils';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from './hooks/useAuth';

function App() {
  const routeElements = useRouteElements();
    const { logout } = useAuth();
    useEffect(() => {
        LocalStorageEventTarget.addEventListener('clearLocalStorage', logout);

        return () => {
            LocalStorageEventTarget.removeEventListener(
                'clearLocalStorage',
                logout,
            );
        };
    }, [logout]);
  return (
    <>
     <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {routeElements}
    </>
  )
}

export default App
