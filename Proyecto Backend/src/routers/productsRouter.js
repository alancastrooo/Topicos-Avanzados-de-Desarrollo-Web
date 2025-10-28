import { Router } from "express";
import { createProduct, deleteProduct, findProduct, getProducts, updateProduct } from "../controllers/productsController.js";

const productsRouter = Router()

// api_url/products
productsRouter.post('', createProduct)
productsRouter.get('', getProducts)
productsRouter.get('/find', findProduct)
productsRouter.put('/:id', updateProduct) 
productsRouter.delete('/:id', deleteProduct)

export default productsRouter;