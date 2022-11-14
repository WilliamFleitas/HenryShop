import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//INTERFACES
export interface Filters {
  name: string;
  category: string;
  property: string;
  order: string;
}

export interface FiltersState {
  filters: Filters;
}

//Definimos el estado
const initialState: FiltersState = {
  filters: {
    name: "",
    category: "",
    property: "",
    order: "",
  },
};

//PORCION DE ESTADO GLOBAL
const FiltersSlice = createSlice({
  name: "Filters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
    },
  },
});

export default FiltersSlice.reducer;
export const { setFilters } = FiltersSlice.actions;