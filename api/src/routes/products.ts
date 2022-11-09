import { Router, Request, Response } from "express";
import {
  getAllProductsAdmin,
  getAllProducts,
  // getAllProductsByCategory,
  // getAllProductsByName,
  addNewProduct,
  getProductById,
  deleteProduct,
  changeProperty
} from "../controllers/product/index";
require("../mongo");

const routes = Router();

//TODOS LOS GET
<<<<<<< HEAD
routes.get("/", async (req: Request, res: Response) => {
=======
routes.get("/admin", async (_req: Request, res: Response) => {
  try {
    const result = await getAllProductsAdmin();
    res.status(200).send(result);
    
  } catch (error) {
    console.log(error);
  }
});

routes.get("/", async (_req: Request, res: Response) => {
>>>>>>> 2ef6a65715748fcaf39f073679af3a6206a0d9ba
  try {
    const category = req.query.category;
    if(category){
      console.log(typeof category);
      // const result = await getAllProductsByCategory(category);
      // if(result.length)res.status(200).send(result);
      // else res.status(201).send({message: "No results find with this category"}) 
    }
    // const name = req.query.name;
    const result = await getAllProducts();
    res.status(200).send(result);
    
  } catch (error:any) {
    res.status(500).json({error_message:error.message});
  }
});

// routes.get("/category/:category", async (req: Request, res: Response) => {
//   try {
//     const {category } = req.params;
//     const result = await getAllProductsByCategory(category);\
//     if(result.length)res.status(200).send(result);
//   } catch (error:any) {
//     res.status(500).json({error_message:error.message});
//   }
// });

// routes.get('/name/:name', async (req:Request, res:Response)=>{
//   try{
//     const {name} = req.params;
//     const result = await getProductsByName(name);
//     if(result.length) res.status(200).send(result);
//     else res.status(201).send({message: "No results find with this name"})
//   }catch(error:any){
//     res.status(500).json({error_message:error.message});
//   }

// });

routes.get("/:id", async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const result = await getProductById(id);

  res.status(200).send(result);
  } catch (error: any) {
    res.status(500).json({error_message:error.message});
  }
  
});

//TODOS LOS POSTS
routes.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    if (!newProduct) {
      res.status(400).send({ error: "Info Missing" });
    } else {
      await addNewProduct(newProduct);
      res.status(200).send(newProduct);
    }
  } catch (error: any) {
    res.status(500).send({error_message: error.message});
  }
});

//DELETE
routes.delete("/:id", async (req: Request, res: Response) =>{
  try {
    const {id} = req.params;
    const del = await deleteProduct(id);
    console.log(del)
    res.status(200).json({message : 'Producto eliminado'});
  } catch (error) {
    console.log(error)
  }
})

//PUT

routes.put("/:id", async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const bodyr = req.body;
    const put = await changeProperty(id, bodyr)
    res.status(200).send(put)
  } catch (error) {
    console.log(error)
  }
})



export default routes;
