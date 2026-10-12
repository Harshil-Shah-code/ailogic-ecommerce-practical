import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../store/slices/CartSlice";
import { Navbar } from "../../components/Navbar";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalAmount = useAppSelector(selectCartTotalAmount);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full p-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage the items you've added.
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is currently empty</h2>
            <p className="text-gray-500 max-w-sm mb-6 text-sm">
              Discover amazing products and add them to your cart to begin shopping.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center gap-4 hover:shadow-xs transition"
                >
                  <img
                    src={item.image || "https://placehold.co/120x120?text=Product"}
                    alt={item.title}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2 border border-gray-100"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-800 text-base">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Unit Price: ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm font-bold cursor-pointer"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm font-bold cursor-pointer"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-base font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Remove product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 h-fit space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold text-gray-800">{totalQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-xl text-cyan-700">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Order placed successfully for $${totalAmount.toFixed(2)}!`);
                  dispatch(clearCart());
                  navigate("/products");
                }}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition cursor-pointer shadow-sm text-center"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full py-2 text-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
              >
                &larr; Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
