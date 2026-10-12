import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import type { Product, ProductsResponse } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  selectCartItems,
} from "../../store/slices/CartSlice";
import { Navbar } from "../../components/Navbar";
import { FiInbox, FiSearch, FiPlus } from "react-icons/fi";

export type { Product };

function ProductListingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const debouncedSearchTerm = useDebounce(search, 300);
  const [loading, setLoading] = useState<boolean>(true);

  const cartQuantityMap = new Map<number, number>(
    cartItems.map((item) => [item.id, item.quantity])
  );

  useEffect(() => {
    fetch("https://dummyjson.com/products/category-list")
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);

    const api = debouncedSearchTerm
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedSearchTerm)}`
      : selectedCategory
        ? `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}`
        : `https://dummyjson.com/products`;

    fetch(api)
      .then((res) => res.json())
      .then((data: ProductsResponse) => setProductsData(data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedSearchTerm, selectedCategory]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory("");
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchTerm("");
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = (e: MouseEvent, product: Product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Search products by keyword or filter by category.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                name="search"
                value={search}
                placeholder="Search items..."
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 pl-10 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-2xs outline-hidden"
              />
              <FiSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>

            <div className="w-full sm:w-64">
              <select
                name="category"
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-2xs outline-hidden cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-cyan-600 border-t-transparent mb-4" />
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        ) : (
          <div>
            {productsData && productsData.products && productsData.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productsData.products.map((p) => {
                  const quantityInCart = cartQuantityMap.get(Number(p.id)) || 0;

                  return (
                    <div
                      key={String(p.id)}
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-cyan-200 transition-all duration-200 flex flex-col cursor-pointer"
                    >
                      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                        <img
                          src={p.images?.[0] || "https://placehold.co/200x200?text=Product"}
                          alt={p.title}
                          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {quantityInCart > 0 && (
                          <span className="absolute top-2 right-2 bg-cyan-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
                            {quantityInCart} in cart
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-2xs font-semibold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                          <h3
                            className="font-semibold text-gray-900 text-base mt-2 line-clamp-1 group-hover:text-cyan-700 transition"
                            title={p.title}
                          >
                            {p.title}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                            {p.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${Number(p.price).toFixed(2)}
                          </span>

                          {quantityInCart > 0 ? (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center border border-cyan-500 rounded-lg overflow-hidden bg-cyan-50"
                            >
                              <button
                                onClick={() => dispatch(decreaseQuantity(Number(p.id)))}
                                className="px-2.5 py-1 text-cyan-700 hover:bg-cyan-100 text-sm font-bold cursor-pointer"
                                title="Decrease"
                              >
                                -
                              </button>
                              <span className="px-2 py-1 text-xs font-bold text-cyan-900">
                                {quantityInCart}
                              </span>
                              <button
                                onClick={() => dispatch(increaseQuantity(Number(p.id)))}
                                className="px-2.5 py-1 text-cyan-700 hover:bg-cyan-100 text-sm font-bold cursor-pointer"
                                title="Increase"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleAddToCart(e, p)}
                              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                            >
                              <FiPlus className="w-3.5 h-3.5" />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-800">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search query or choosing a different category.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductListingPage;
