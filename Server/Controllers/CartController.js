const jwt = require('../jwt/jwt.js'); // Ensure this path is correct
const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Cart = require('../models/CartSchema');
const { default: mongoose } = require('mongoose');

const addToCart = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
       
        
        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1];
        
        
         // Extract token from header
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret); // Verify the token
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const { userId, productId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "UserId Not Exist" });
        }
        if (!productId) {
            return res.status(400).json({ success: false, message: "ProductId Not Exist" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Exist" });
        }

        // Check if the userType is 'user'
       

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Exist" });
        }

        const price = product.price;
        let cart = await Cart.findOne({ user: userId });

        // If cart does not exist, create a new cart
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity: 1 }],
                totalPrice: price
            });
        } else {
            // Check if product is already in the cart
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingItemIndex > -1) {
                // If product exists, increment the quantity
                cart.items[existingItemIndex].quantity += 1;
            } else {
                // If product does not exist, add it with quantity 1
                cart.items.push({ product: productId, quantity: 1 });
            }

            // Update total price
            cart.totalPrice += price;
        }

        await cart.save();
        return res.status(200).json({ success: true, message: "Product added to cart", cart });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

const deleteCartItems = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        
        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1]; // Extract token from header
        
        
        if (!token) {
            return res.status(401).send('Token not found');
        }

        const secret = process.env.SECRET_KEY;
        let decoded;
        try {
            decoded = jwt.verifyToken(token, secret);
           
             
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const { userId, productId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "UserId Not Exist" });
        }
        if (!productId) {
            return res.status(400).json({ success: false, message: "ProductId Not Exist" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Exist" });
        }

        // Ensure the user is authorized
        if (user._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Exist" });
        }
        const price = product.price;

        const cart = await Cart.findOne({ user: userId });

        // If cart does not exist or is empty
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ success: false, message: "Cannot delete from a non-existing or empty cart" });
        }

        // Check if product exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex !== -1) {
            const item = cart.items[existingItemIndex];

            if (item.quantity > 1) {
                // Decrement the quantity if it's greater than 1
                cart.items[existingItemIndex].quantity -= 1;
            } else {
                // Remove the product from the cart if quantity is 1
                cart.items.splice(existingItemIndex, 1);
            }

            // Update the total price
            cart.totalPrice -= price;

            await cart.save();
            return res.status(200).json({ success: true, message: "Product removed from cart", cart });
        } else {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const getCartItems=async(req,res)=>{
try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1];
    
     // Extract token from header
    if (!token) {
        return res.status(401).send('Token not found');
    }

    const secret = process.env.SECRET_KEY;
    let decoded;
    try {
        decoded = jwt.verifyToken(token, secret); // Verify the token
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const {userId}=req.params
    if (!userId) {
        return res.status(400).json({ success: false, message: "UserId Not Exist" });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ success: false, message: "User Not Exist" });
    }

    // Check if the userType is 'user'
    if (user._id.toString()!==userId) {
        return res.status(403).json({ success: false, message: "Your are not allowed to view" });
    }
    let cart = await Cart.findOne({ user: userId }).populate('items.product')
   let populateCart=cart.items.map(item=>{
    return item
   })
    

    return res.status(200).json({success:true,cart:populateCart})
} catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
}
}
module.exports = {
    addToCart,
    deleteCartItems,
    getCartItems
};
