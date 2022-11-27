/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { uploadImageToFirebaseStorage } from "../../firebase/uploadImageToFirebaseStorage";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {getCategories} from "../../redux/slices/ProductSlice/productActions";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ListDisplayer from "../ListDisplayer";

const variants = { XS: "XS", S: "S", M: "M", L: "L", XL: "XL", XXL: "XXL" };
const colors = { Blanco: "Blanco", Negro: "Negro" };
interface formData {
  name: string;
  rating: number;
  description: string;
  price: number;
  image: string;
  category: string;
  colors: Array<object>;
  variants: Array<object>;
}

interface variant{
  value:string;
  quantity:number;
}

const schema = yup
  .object()
  .shape({
    name: yup.string().required("Debes agregar el nombre del producto"),
    rating: yup
      .number()
      .typeError("El rating debe ser un número")
      .min(0, "el número debe ser mayor o igual a 0")
      .max(5, "el número debe ser menor o igual a 5")
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),
    description: yup
      .string()
      .min(1, "Se requiere por lo menos un caracter")
      .max(80, "No se pueden una descripción mayor a 80 caracteres")
      .required(),
    price: yup
      .number()
      .typeError("El precio debe ser un número")
      .min(0, "requiere un precio igual o superior a 0")
      .required("No olvides agregar el precio del prodcuto"),
    image: yup.mixed().test("required", "Debe subir una imagen", (value) => {
      return value && value.length;
    }),
    category: yup.string().required("Recuerda agregar la categoría"),
    colors: yup
      .array()
      .of(yup.object().shape(
          {
            quantity: yup.number(),
            value: yup.string()
          }
        ))
      .nullable(),
    variants: yup
      .array()
      .of(yup.object().shape(
          {
            quantity: yup.number(),
            value: yup.string()
          }
        ))
      .nullable(),
  })
  .required();

const PostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const initialForm: formData = {
    name: "",
    rating: -1,
    description: "",
    price: -1,
    image: "",
    category: "",
    colors: [{}],
    variants: [{}],
  };

  const [variantsInput, setVariantsInput] = useState<variant[]>([]);
  const [variantsError, setvariantsError] = useState('');
  const [variantName, setVariantName] = useState('');

  const [newVariant, setNewVariant] = useState<string>('');


  const handleVariants = (value:variant) => {
    let variantsInputCopy:variant[] = typeof variantsInput !== 'string'? variantsInput: [{value: "", quantity: 0}];
    if(variantsInput.includes(value)){
      variantsInputCopy.every((filter, index) => {
        if(filter === value){
          setVariantsInput(current => variantsInputCopy.filter(element => element !== value ));
          return false;
        }
        return true
      });
    }else{
      variantsInputCopy = [...variantsInputCopy, value];
      setVariantsInput(variantsInputCopy);
    }
  };


  const handleNewVariant = (event:any) => {
    event.preventDefault();
    const variantToAdd = newVariant.split('|');
    if(variantToAdd.length === 2 && !isNaN(Number(variantToAdd[1]))) {
      const variantToObject:variant = {
        value:variantToAdd[0],
        quantity:Number(variantToAdd[1])
      } 
      if(!variantsInput.map(e => e.value).includes(variantToObject.value)){
        handleVariants(variantToObject);
        setNewVariant('');
      }else{
        console.log("valor ya ingresado");
      }
    }else{
      console.log('valor ingresado no valido');
    }
  }

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.products.categoryList?.map(category => category.name));

  const [input, setInput] = useState(initialForm);
  
  const [file, setFile] = useState(null);
  
  let imgSrc: any;
  let imgFile: any;
  let imgUrl: any;
  
  const onChangeFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const target =  e.target as HTMLInputElement;
    imgSrc = target.files?.[0];
    setFile(imgSrc)
    let arr: string = "";
    
    
      imgFile =  URL.createObjectURL(imgSrc);
      arr = imgFile;
      setInput((prev) => ({ ...prev, image: arr }));
    

  };
  

  const submitCall = async ({
    name,
    rating,
    description,
    price,
    category,
    colors,
  }:formData) => {
    let backData = process.env.REACT_APP_BACKEND_URL;
    imgUrl =  await uploadImageToFirebaseStorage(file);


    if (backData )
      axios
        .post(`${backData}/products`, {
          name,
          rating,
          description,
          price,
          image: imgUrl,
          category,
          colors,
          variants: variantsInput,
          variantName,

        })
        .then((res) => {
          alert("Producto creado correctamente");
          window.location.reload();
        }
        )
        .catch((err) => console.error(err));
  }

  const handleCategories = (event:React.ChangeEvent<HTMLSelectElement>) => {
    if(event.target.value === 'all') return ;
    setInput({...input, category: event.target.value}); 
  }

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <form
      onSubmit={handleSubmit(submitCall)}
      className="flex justify-center flex-col items-center w-9/12 m-auto"
    >

      <div className="mb-3.5 w-full">
        <div className="flex justify-center">
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Name..."
            className="border border-black border-solid w-full rounded-2xl pl-2 py-1"
          />
          *
        </div>
        {errors?.name && (
          <p className="text-red-600 font-bold">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-3.5 w-full">
        <input
          {...register("rating")}
          id="rating"
          type="text"
          placeholder="Rating..."
          className="border border-black border-solid w-full rounded-2xl pl-2 py-1"
        />
        {errors?.rating && (
          <p className="text-red-600 font-bold">{errors.rating.message}</p>
        )}
      </div>

      <div className="mb-3.5 w-full">
        <div className="flex justify-center">
          <input
            {...register("description")}
            id="description"
            type="text"
            placeholder="Description..."
            className="border border-black border-solid w-full rounded-2xl pl-2 py-1"
          />
          *
        </div>
        {errors?.description && (
          <p className="text-red-600 font-bold">{errors.description.message}</p>
        )}
      </div>

      <div className="mb-3.5 w-full">
        <div className="flex justify-center">
          <input
            {...register("price")}
            id="price"
            type="text"
            placeholder="Price..."
            className="border border-black border-solid w-full rounded-2xl pl-2 py-1"
          />
          *
        </div>
        {errors?.price && (
          <p className="text-red-600 font-bold">{errors.price.message}</p>
        )}
      </div>

      <div className="mb-3.5 w-full">
        <div className="flex justify-center">
          <input
            {...register("image")}
            id="image"
            type="file"
            className="border border-black border-solid w-full rounded-2xl pl-2 py-1"
            onChange={onChangeFiles}
          />
          *
        </div>
        { input.image.length?
          <div className="flex flex-wrap justify-start h-28 mt-4">
            
            {
              <img
                className="h-full mr-4 border border-black border-solid rounded"
                src={input.image}
                alt={`upload_image_${input.image}`}
                key={input.image}

              />
            }
          </div>: null
        
        } 
        {errors.image && (
          <p className="text-red-600 font-bold">{errors.image.message}</p>
        )}
      </div>

      <div className="mb-3.5 w-full">
        <div className="flex justify-center">
          
          <select {...register('category')} onChange = {handleCategories}>
            <option value = "all">
              All
            </option >
            {categories?.map(category => {
              return(<option key = {category} value = {category}>{category}</option>)
            })}
          </select>*
        </div>
        {errors?.category && (
          <p className="text-red-600 font-bold">{errors.category.message}</p>
        )}
      </div>

      <div className="my-5 border border-black border-solid w-full rounded-2xl pl-2 py-1">
        Selecciona las tallas
        <div className="my-2 flex justify-center">
          <input name = "variant" value = {variantName} placeholder="Coloca el nombre del conjunto de variantes" onChange = {(event)=> setVariantName(event.target.value)}/>
          <ListDisplayer elements = {variantsInput} setState = {handleVariants} name = "Variantes agregadas"/>
          <input name="variantes" onChange = {(event) => setNewVariant(event.target.value)} value = {newVariant}/>
          <button className="bg-[#d9d9d9] w-full py-2 rounded-2xl font-bold my-1.5 mb-8" onClick = {handleNewVariant}>Agregar</button>
        </div>
      </div>
      <span>* Campos obligatorios</span>
      <button className="bg-[#d9d9d9] w-full py-2 rounded-2xl font-bold my-1.5 mb-8">
        Agregar producto
      </button>
    </form>
  );
};

export default PostForm;
