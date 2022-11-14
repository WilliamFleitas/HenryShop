import React, { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setFiltersAction } from "../redux/slices/FiltersSlice/filtersActions";
import { getAllProducts } from "../redux/slices/ProductSlice/productActions";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filterState.filters);

  const navigate = useNavigate();
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await dispatch(setFiltersAction({ ...filters, name: search }));

    setSearch("");
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        onChange={changeHandler}
        value={search}
        placeholder="Buscar producto..."
        className="text-base text-gray-900 p-2 pl-4 pr-4 rounded-3xl shadow-lg  border-0 border-b-2 border-black border-solid"
      />
      <button
        type="submit"
        className="text-base text-gray-900 p-2 pl-4 pr-4 bg-white ml-2 rounded-3xl duration-200 shadow-lg hover:bg-gray-200 hover:duration-300 border-b-2 border-black"
      >
        Buscar
      </button>
    </form>
  );
};

export default Searchbar;