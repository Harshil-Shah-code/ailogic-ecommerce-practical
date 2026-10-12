import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthCredentials } from "../store/slices/AuthSlice";
import { clearCart, selectCartTotalQuantity } from "../store/slices/CartSlice";
import { persistor, resetStore } from "../store/store";
import { CartDrawer } from "../features/cart/CartDrawer";
import { FiShoppingCart } from "react-icons/fi";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(clearAuthCredentials());
    dispatch(clearCart());
    dispatch(resetStore());
    await persistor.purge();
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/products" className="flex items-center gap-2 group">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Ecommerce<span className="text-cyan-600">Hub</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/products"
                className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition"
              >
                Products
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-full transition flex items-center cursor-pointer"
              aria-label="View Shopping Cart"
              title="View Cart"
            >
              <FiShoppingCart className="w-6 h-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center animate-scale-in">
                  {totalQuantity}
                </span>
              )}
            </button>

            {auth?.email && (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <span className="hidden sm:inline-block text-xs font-medium text-gray-500 max-w-[150px] truncate" title={auth.email}>
                  {auth.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-gray-200 cursor-pointer"
                  title="Log out"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
