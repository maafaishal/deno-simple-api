import { Router, helpers } from 'https://deno.land/x/oak/mod.ts'

import { getReasons, reviewAuction } from './controllers/admin.ts'
import { getTotalNotif, getNotif, readNotif } from './controllers/notification.ts'
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from './controllers/products.ts'
import { getAllAuctions, getAuction, addAuction, editAuction, deleteAuction } from './controllers/auctions.ts'
import { getHistoryBids, addBid } from './controllers/bid.ts'

const router = new Router()

router.post('/commads/v1/admin/review',reviewAuction)
router.get('/commads/v1/admin/review-reason/:auction_id',getReasons)

router.get('/commads/v1/common/notification-count',getTotalNotif)
router.get('/commads/v1/common/notification',getNotif)
router.post('/commads/v1/common/read-notifications',readNotif)

router.get('/api/v1/products',getProducts)
router.get('/api/v1/products/:id',getProduct)
router.post('/api/v1/products',addProduct)
router.put('/api/v1/products/:id',updateProduct)
router.delete('/api/v1/products/:id',deleteProduct)

router.get('/commads/v1/common/all-auctions', getAllAuctions);
router.get('/commads/v1/common/auction', getAuction);

router.post('/commads/v1/seller/add-auction', addAuction);
router.post('/commads/v1/seller/edit-auction', editAuction);
router.post('/commads/v1/seller/delete-auction', deleteAuction);

router.get('/commads/v1/buyer/history-bid', getHistoryBids);
router.post('/commads/v1/buyer/bid-auction', addBid);

export default router