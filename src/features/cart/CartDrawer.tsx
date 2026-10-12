import React from "react";
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
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItems = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalAmount = useAppSelector(selectCartTotalAmount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
            <span className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-lg text-lg font-bold"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <svg
                className="w-16 h-16 text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-400 mb-4">Looks like you haven't added anything yet.</p>
              <button
                onClick={() => {
                  onClose();
                  navigate("/products");
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition"
              >
                <img
                  src={item.image || "https://placehold.co/100x100?text=Product"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg bg-white p-1 border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800 truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ${item.price.toFixed(2)} each
                  </p>
                  <p className="text-xs font-semibold text-cyan-700 mt-1">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm font-bold cursor-pointer"
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-semibold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(increaseQuantity(item.id))}
                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm font-bold cursor-pointer"
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove product"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Quantity:</span>
                <span className="font-semibold text-gray-800">{totalQuantity}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-cyan-700 text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="flex-1 py-2 px-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                disabled={true}
                onClick={() => {
                  alert(`Thank you! Order total is $${totalAmount.toFixed(2)}.`);
                  dispatch(clearCart());
                  onClose();
                }}
                className="flex-2 py-2 px-4 bg-gray-600 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-sm opacity-50 cursor-not-allowed"
              >
                Checkout (${totalAmount.toFixed(2)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
