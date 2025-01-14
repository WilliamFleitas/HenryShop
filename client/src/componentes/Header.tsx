import React, { useEffect, useState } from "react";
import logo from "../assets/logoHenryBlack.png";
import logoMobile from "../assets/hernyLogoSmall.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserAlt } from "react-icons/fa";
import Searchbar from "./Searchbar";
import { Link, useNavigate } from "react-router-dom";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setFiltersAction } from "../redux/slices/FiltersSlice/filtersActions";
import { useShoppingCart } from "./ShoppingCart/ContextShoppingCart";
import { Button } from "react-bootstrap";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import getObjectSession from "../funciones/getObjectSession";
import {
  setUserData,
  clearUserData,
} from "../redux/slices/UserSlice/UserActions";
import axios from "axios";
import axiosGetCall from "../funciones/axiosGetCall";
import NewsLetter from "./newsletter";
import HeaderLink from './HeaderLink';

interface userMod {
  birthday: string;
  confirmed: boolean;
  deleted: boolean;
  email: string;
  id: string;
  isAdmin: boolean;
  name: string;
  password: string;
  username: string;
}

const Header = () => {
  const { openCart, cartQuantity } = useShoppingCart();

  const [deploy, setDeploy] = useState(false);
  const [categoryDeploy, setCategoryDeploy] = useState(false);
  const [categories, setCategories] = useState([{id:'', name:''}]);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filterState.filters);
  const { username } = useAppSelector((state) => state.user);
  const REACT_APP_BACKEND_URL: string = process.env
    .REACT_APP_BACKEND_URL as string;

  const logout = () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("Shoping-cart");
    dispatch(clearUserData());
    setDeploy(false);
    window.open(`${REACT_APP_BACKEND_URL}/googleusers/google/logout`, "_self");
  };
  const token = JSON.parse(
    window.localStorage.getItem("userSession") as string
  );

  const [userProps, setUserProps] = useState<userMod>({
    birthday: "",
    confirmed: false,
    deleted: false,
    email: "",
    id: "",
    isAdmin: false,
    name: "",
    password: "",
    username: "",
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // let userData;
  // const getUser = async () => {
  //   const result = await axios.get(
  //     `${REACT_APP_BACKEND_URL}/users/getuser/${token?.username}`
  //   );
  //   setUserProps(result.data);
  // };

  const getCategories = async () => {
    const result = await axios.get( 
      `${REACT_APP_BACKEND_URL}/categories`
    );
    setCategories(result.data);
  }

  useEffect(() => {
    const session = getObjectSession();
    // getUser();
    if (session) {
      dispatch(setUserData());
    }
    getCategories();
  }, []);

  
  useEffect(() => {
    const session = window.localStorage.getItem("userSession");
    if (session) {
      axiosGetCall("/users/isAdmin")
        .then(() => {
          setIsAdmin(true);
        })
        .catch(() => {
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }
  , [dispatch]);


  return (
    <nav className="flex flex-col sticky w-full">
      <div className=" h-16 bg-yellow flex justify-between items-center pr-4 pl-4">
        <Link to="/">
          <img
            src={logoMobile}
            alt="Logo de Henry"
            className="h-8 select-none"
          />
        </Link>
        <Searchbar />
        <div className="inline-flex space-x-28">
          <div className="flex-1 ">
            <GiHamburgerMenu
              onClick={() => {
                setDeploy(!deploy);
              }}
              className={
                deploy
                  ? "-rotate-90 h-8 w-auto cursor-pointer duration-300"
                  : "h-8 w-auto cursor-pointer duration-300"
              }
            />
          </div>
        </div>
      </div>
      {deploy && (
        <div
          id="divDeployNavbar"
          className="bg-yellow h-auto pb-4 w-full origin-top animate-open-menu duration-300 flex flex-col"
        >
          <div className="select-none flex justify-evenly font-bold text-lg">
            {username ? (
              <div className="flex flex-col items-center  p-4 w-full">
                <p className="text-base font-medium">Bienvenido:</p>
                <div className="flex flex-row gap-2 items-center">
                  <FaUserAlt />
                  <p>{username}</p>
                </div>
                <button
                  className="bg-white duration-300 hover:bg-gray-200 hover:duration-300 p-2 rounded-3xl pl-4 pr-4 border-b-2 border-black"
                  onClick={logout}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-row gap-2 justify-center">
                <Link to="/Login">
                  <button className="bg-white duration-300 hover:bg-gray-200 hover:duration-300 p-1 rounded-md pl-2 pr-2 border-b-2 border-black font-medium text-base w-32 mt-2">
                    Iniciar sesion
                  </button>
                </Link>
                <Link to="/Register">
                  <button className="bg-white duration-300 hover:bg-gray-200 hover:duration-300 p-1 rounded-md pl-2 pr-2 border-b-2 border-black font-medium text-base w-32 mt-2">
                    Registrarse
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div>

            { isAdmin ? 
            <Link to="/admin">
              <h4 className="pl-2 hover:pl-4 hover:delay-300 duration-300 font-bold hover:cursor-pointer">
                Panel de admin
              </h4>
            </Link>:<div></div>}
          </div>

          <div className="p-4 flex flex-col text-left justify-start select-none">
            {/* Carrito */}
            {cartQuantity > 0 && (
              <div className="flex-1">
                <Button
                  onClick={() => {
                    dispatch(setUserData());
                    openCart();
                  }}
                  className="bg-transparent hover:bg-white text-black-700 font-semibold hover:text-yellow-200 py-2 px-4 border border-black hover:border-transparent rounded-full"
                  style={{ width: "4rem", position: "absolute", right: "2rem" }}
                >
                  <ShoppingCartIcon />
                  <div
                    className="rounded-circle bg-red-500 d-flex justify-content-center align-items-center rounded-full"
                    style={{
                      color: "black",
                      width: "1.5rem",
                      height: "1.5 rem",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      transform: "translate(25%, 25%)",
                    }}
                  >
                    {cartQuantity}
                  </div>
                </Button>
              </div>
            )}
            {username ? (
              <div><Link to="/shopping">
              <h5 className="pl-2 hover:pl-4 hover:delay-300 duration-300 font-bold hover:cursor-pointer">
                  Mis compras
              </h5>
              </Link>
              {token?.origin === 'default'?(<Link to="/User">
                <h5 className="pl-2 pt-3 hover:pl-4 hover:delay-300 duration-300 font-bold hover:cursor-pointer">
                  Ir al Perfil
                </h5>
              </Link>):null}
              </div>
            ) : null}
            <Link to="/">
              <h5 className="pl-2 mt-4 hover:pl-4 hover:delay-300 duration-300 font-bold hover:cursor-pointer">
                Productos
              </h5>
            </Link>
            <h5
              onClick={() => setCategoryDeploy(!categoryDeploy)}
              className="font-bold mt-4  hover:delay-300 hover:cursor-pointer pl-2 hover:pl-4 duration-300"
            >
              Categorias
            </h5>
            {categoryDeploy && (
              <div className="animate-open-menu origin-top">
                {
                  categories.length?categories.map(category => {
                    return(
                      <HeaderLink 
                        name={category.name}
                        callback = {()=>{
                          dispatch(
                            setFiltersAction({ ...filters, category: category.name })
                          );
                        }} 
                      />
                    )
                  }):null
                }
              </div>
            )}
            <h5 className=" hover:delay-300 pl-2 hover:pl-4 duration-300 font-bold mt-4  hover:cursor-pointer">
              Sobre nosotros
            </h5>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

/*
 {cartQuantity > 0 && (
            <div className="flex-1">
              <Button
                onClick={openCart}
                className="bg-transparent hover:bg-white text-black-700 font-semibold hover:text-yellow-200 py-2 px-4 border border-black hover:border-transparent rounded-full"
                style={{ width: "4rem", position: "absolute" }}
              >
                <ShoppingCartIcon />
                <div
                  className="rounded-circle bg-red-500 d-flex justify-content-center align-items-center rounded-full"
                  style={{
                    color: "black",
                    width: "1.5rem",
                    height: "1.5 rem",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    transform: "translate(25%, 25%)",
                  }}
                >
                  {cartQuantity}
                </div>
              </Button>
            </div>
          )}

*/
