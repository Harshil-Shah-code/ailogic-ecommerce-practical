export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
}

export interface ProductsResponse {
  limit: number;
  products: Product[];
  skip: number;
  total: number;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface AuthState {
  email: string;
  password: string;
}
