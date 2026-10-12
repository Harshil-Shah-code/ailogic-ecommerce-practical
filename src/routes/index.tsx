import { createBrowserRouter } from "react-router-dom";
import { Login } from "../features/auth/Login";
import App from "../App";
import ProductListingPage from "../features/products/ProductListPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import { ProductDetailPage } from "../features/products/ProductDetailPage";
import { CartPage } from "../features/cart/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <ProductListingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/:id",
        element: (
          <ProtectedRoute>
            <ProductDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;