import { Navigate, Outlet, useRoutes } from 'react-router';
import { CartLayout, MainLayout, RegisterLayout } from './components/layouts';
import { path } from './constants';
import UserLayout from './pages/user/layouts/UserLayout';
import { Suspense, lazy } from 'react';
import useAuth from './hooks/useAuth';

const LoginPage = lazy(() => import('./pages/LoginPage/login'));
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/register'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/product-detail'));
const ChangePasswordPage = lazy(() => import('./pages/user/change-password'));
const ProfilePage = lazy(() => import('./pages/user/profile'));
const PurchasePage = lazy(() => import('./pages/user/history-purchase'));
const CartPage = lazy(() => import('./pages/CartPage/cart'));
// const NotFoundPage = lazy(() => import('./pages/notFound'));

function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

const routes = [
    // home
    {
        path: path.home,
        index: true,
        element: (
            <MainLayout>
                <Suspense>
                    <HomePage />
                </Suspense>
            </MainLayout>
        ),
    },
    //productdetail
    {
        path: path.productDetail,
        index: true,
        element: (
            <MainLayout>
                <Suspense>
                    <ProductDetailPage />
                </Suspense>
            </MainLayout>
        ),
    },
    // user
    {
        path: '',
        element: <ProtectedRoute />,
        children: [
            {
                path: path.user, // khi đi qua path user, trong user layout sẽ có outlet
                // các component trong children sẽ được render vào outlet
                element: (
                    <MainLayout>
                        <UserLayout />
                    </MainLayout>
                ),
                children: [
                    {
                        path: path.profile,
                        element: (
                            <Suspense>
                                <ProfilePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: path.changePassword,
                        element: (
                            <Suspense>
                                <ChangePasswordPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: path.historyPurchase,
                        element: (
                            <Suspense>
                                <PurchasePage />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: path.cart,
                element: (
                    <CartLayout>
                        <Suspense>
                            <CartPage />
                        </Suspense>
                    </CartLayout>
                ),
            },
        ],
    },
    //login
    {
        path: '',
        element: <RejectedRoute />,
        children: [
            {
                path: path.login,
                element: (
                    <RegisterLayout>
                        <Suspense>
                            <LoginPage />
                        </Suspense>
                    </RegisterLayout>
                ),
            },
            {
                path: path.register,
                element: (
                    <RegisterLayout>
                        <Suspense>
                            <RegisterPage />
                        </Suspense>
                    </RegisterLayout>
                ),
            },
        ],
    },
    //404
    {
        path: '*',
        element: (
            <MainLayout>
                <Suspense>
                    {/* <NotFoundPage /> */}
                </Suspense>
            </MainLayout>
        ),
    },
];

export function useRouteElements() {
    const routesElements = useRoutes(routes);

    return routesElements;
}
