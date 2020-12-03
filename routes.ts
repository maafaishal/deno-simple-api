import { Router, helpers } from 'https://deno.land/x/oak/mod.ts'

import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/products.ts'
import { getAllAuctions, getAuction } from './controllers/auctions.ts'

const router = new Router()

router.get('/api/v1/products',getProducts)
router.get('/api/v1/products/:id',getProduct)
router.post('/api/v1/products',addProduct)
router.put('/api/v1/products/:id',updateProduct)
router.delete('/api/v1/products/:id',deleteProduct)

router.get('/api/v1/common/all-auctions', getAllAuctions);
router.get('/api/v1/common/auction', getAuction);

export default router