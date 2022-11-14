import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//INTERFACES
export interface ProductDetails {
  id: string;
  name: string;
  rating: number;
  description: string;
  price: number;
  image: {public_id: string, secure_url: string} | string;
  stock: number;
  category: string;
  colors: Array<string>;
  sizes: Array<string>;
}

interface ProductState {
  productList: Array<ProductDetails>;
  productDetail: ProductDetails;
  productPages: Number;
}

//Definimos el estado
const initialState: ProductState = {
  productList: [],
  productDetail: {
    id: "",
    name: "",
    rating: -1,
    description: "",
    price: 0,
    image: "",
    stock: 0,
    category: "",
    colors: [""],
    sizes: [""],
  },
  productPages: 0,
};

//PORCION DE ESTADO GLOBAL
const ProductSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    getProductList(state, action: PayloadAction<Array<ProductDetails>>) {
      state.productList = action.payload;
    },
    getProductPages(state, action: PayloadAction<Number>) {
      state.productPages = action.payload;
    },
    getProductDetail(state, action: PayloadAction<ProductDetails>) {
      state.productDetail = action.payload;
    },
  },
});

export default ProductSlice.reducer;
export const { getProductList, getProductPages, getProductDetail } =
  ProductSlice.actions;