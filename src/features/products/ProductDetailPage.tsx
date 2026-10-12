import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    selectCartItemQuantity,
} from "../../store/slices/CartSlice";
import { Navbar } from "../../components/Navbar";

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [productDetail, setProductDetail] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const productId = Number(id);
    const quantityInCart = useAppSelector(selectCartItemQuantity(productId));

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        fetch(`https://dummyjson.com/products/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load product");
                }
                return res.json();
            })
            .then((data: Product) => {
                setProductDetail(data);
            })
            .catch((err) => {
                setError(err.message || "Failed to load product");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="max-w-5xl mx-auto w-full p-6 flex-1">
                <button
                    onClick={() => navigate("/products")}
                    className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-cyan-600 cursor-pointer transition"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-600 border-t-transparent mb-3" />
                        <p className="text-gray-600 font-medium">Loading product details...</p>
                    </div>
                ) : error || !productDetail ? (
                    <div className="bg-white rounded-2xl p-8 border border-red-200 text-center">
                        <p className="text-red-600 font-medium mb-4">{error || "Product not found"}</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                        >
                            Browse Catalog
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <img
                                src={productDetail.images?.[0] || "https://placehold.co/400x400?text=Product"}
                                alt={productDetail.title}
                                className="max-h-80 w-auto object-contain hover:scale-105 transition duration-300"
                            />
                        </div>

                        <div className="flex flex-col justify-between">
                            <div>
                                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md mb-2">
                                    {productDetail.category}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                    {productDetail.title}
                                </h1>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {productDetail.description}
                                </p>
                                <div className="text-3xl font-bold text-gray-900 mb-6">
                                    ${Number(productDetail.price).toFixed(2)}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                {quantityInCart > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-600">Quantity in cart:</span>
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-xs">
                                                <button
                                                    onClick={() => dispatch(decreaseQuantity(productDetail.id))}
                                                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-base font-bold cursor-pointer"
                                                    title="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 text-base font-semibold text-gray-900">
                                                    {quantityInCart}
                                                </span>
                                                <button
                                                    onClick={() => dispatch(increaseQuantity(productDetail.id))}
                                                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-base font-bold cursor-pointer"
                                                    title="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => dispatch(addToCart(productDetail))}
                                                className="flex-1 py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition cursor-pointer shadow-sm text-center"
                                            >
                                                Add Another
                                            </button>
                                            <button
                                                onClick={() => dispatch(removeFromCart(productDetail.id))}
                                                className="py-3 px-4 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium transition cursor-pointer text-sm"
                                            >
                                                Remove from Cart
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => dispatch(addToCart(productDetail))}
                                        className="w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};