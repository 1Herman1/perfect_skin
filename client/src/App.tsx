import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { IconCart, IconHeart } from '@/components/icons'
import { DrawerProvider } from '@/context/DrawerContext'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { RequireRole } from '@/components/admin/RequireRole'
import { AdminLayout } from '@/components/admin/AdminLayout'

// Shop pages
const HomePage = lazy(() => import('@/components/pages/HomePage').then((m) => ({ default: m.HomePage })))
const CatalogPage = lazy(() => import('@/components/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })))
const ProductPage = lazy(() => import('@/components/pages/ProductPage').then((m) => ({ default: m.ProductPage })))
const AuthPage = lazy(() => import('@/components/pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const CheckoutPage = lazy(() => import('@/components/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrdersPage = lazy(() => import('@/components/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })))
const OrderPage = lazy(() => import('@/components/pages/OrderPage').then((m) => ({ default: m.OrderPage })))
const TrackOrderPage = lazy(() => import('@/components/pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })))
const BrandsPage = lazy(() => import('@/components/pages/BrandsPage').then((m) => ({ default: m.BrandsPage })))
const AboutPage = lazy(() => import('@/components/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactsPage = lazy(() => import('@/components/pages/ContactsPage').then((m) => ({ default: m.ContactsPage })))
const OfferPage = lazy(() => import('@/components/pages/OfferPage').then((m) => ({ default: m.OfferPage })))
const BlogPage = lazy(() => import('@/components/pages/BlogPage').then((m) => ({ default: m.BlogPage })))
const BlogPostPage = lazy(() => import('@/components/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })))
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

// Admin pages
const AdminDashboardPage = lazy(() => import('@/components/admin/pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })))
const AdminOrdersPage = lazy(() => import('@/components/admin/pages/AdminOrdersPage').then((m) => ({ default: m.AdminOrdersPage })))
const AdminOrderPage = lazy(() => import('@/components/admin/pages/AdminOrderPage').then((m) => ({ default: m.AdminOrderPage })))
const AdminProductsPage = lazy(() => import('@/components/admin/pages/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })))
const AdminPromoPage = lazy(() => import('@/components/admin/pages/AdminPromoPage').then((m) => ({ default: m.AdminPromoPage })))
const AdminPostsPage = lazy(() => import('@/components/admin/pages/AdminPostsPage').then((m) => ({ default: m.AdminPostsPage })))
const AdminPostEditPage = lazy(() => import('@/components/admin/pages/AdminPostEditPage').then((m) => ({ default: m.AdminPostEditPage })))

const adminRoles = ['super_admin', 'orders_manager', 'products_manager', 'content_manager']

const ShopLayout = () => (
  <DrawerProvider>
    <CartProvider>
      <FavoritesProvider>
        <Layout cartIcon={<IconCart />} favoriteIcon={<IconHeart />}>
          <Outlet />
        </Layout>
      </FavoritesProvider>
    </CartProvider>
  </DrawerProvider>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <RequireRole roles={adminRoles}>
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminDashboardPage /></Suspense>} />
            <Route path="orders" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminOrdersPage /></Suspense>} />
            <Route path="orders/:number" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminOrderPage /></Suspense>} />
            <Route path="products" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminProductsPage /></Suspense>} />
            <Route path="promo" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminPromoPage /></Suspense>} />
            <Route path="posts" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminPostsPage /></Suspense>} />
            <Route path="posts/:id" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AdminPostEditPage /></Suspense>} />
          </Route>

          {/* Shop routes */}
          <Route element={<ShopLayout />}>
            <Route path="/" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><HomePage /></Suspense>} />
            <Route path="/catalog" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><CatalogPage /></Suspense>} />
            <Route path="/catalog/:slug" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><CatalogPage /></Suspense>} />
            <Route path="/product/:slug" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><ProductPage /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AuthPage /></Suspense>} />
            <Route path="/checkout" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><CheckoutPage /></Suspense>} />
            <Route path="/orders" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><OrdersPage /></Suspense>} />
            <Route path="/orders/:number" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><OrderPage /></Suspense>} />
            <Route path="/track" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><TrackOrderPage /></Suspense>} />
            <Route path="/brands" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><BrandsPage /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><AboutPage /></Suspense>} />
            <Route path="/contacts" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><ContactsPage /></Suspense>} />
            <Route path="/offer" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><OfferPage /></Suspense>} />
            <Route path="/blog" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><BlogPage /></Suspense>} />
            <Route path="/blog/:slug" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><BlogPostPage /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<div className="container-app py-24 text-muted-foreground">Загрузка…</div>}><NotFoundPage /></Suspense>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
