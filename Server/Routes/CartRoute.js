const express = require('express');
const router = express.Router();
const CartController = require('../Controllers/CartController');
router.post('/:userId/:productId/add',CartController.addToCart)
router.delete('/:userId/:productId/delete',CartController.deleteCartItems)
router.get('/:userId/cart',CartController.getCartItems)

module.exports=router