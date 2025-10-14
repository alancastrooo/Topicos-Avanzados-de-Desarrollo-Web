import { Router } from "express";
import { createProduct, deleteProduct, getProductBy, getProducts, updateProduct } from "../controllers/productsController.js";


const productsRouter = Router()

productsRouter.post('', createProduct)
productsRouter.get('', getProducts)
productsRouter.get('/find', getProductBy)
productsRouter.put('/:id', updateProduct) 
productsRouter.delete('/:id', deleteProduct)

export default productsRouter;