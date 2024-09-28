const express = require('express');
const router = express.Router();
const upload = require('../util/multer.js');
const shopController = require('../Controllers/ShopController.js');

// Route for creating a new shop with shop image upload
router.post('/new/:id', upload.single('shop_image'), shopController.createShop);
router.post('/:id/newproducts',upload.single('product_image'),shopController.createShopProducts)
router.get('/allShops',shopController.getShops)
router.get('/:shop_id/products',shopController.getShopProducts)
router.delete('/:userId/:shop_id/delete',shopController.deleteShop)
router.delete('/:productId/:shop_id/delete/products',shopController.deleteShopProducts);
router.put('/:userId/:shop_id/edit',upload.single('shop_image'),shopController.editShop)
router.put('/:productId/:shop_id/edit/products',upload.single('product_image'),shopController.editShopProducts);
router.get('/:productid', shopController.getProductDetailsById);

module.exports = router;