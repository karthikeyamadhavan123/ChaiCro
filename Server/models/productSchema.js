const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    p_name: {
        type: String,
        required: true,
        minLength: [2, "Product name should be at least 2 characters"],
    },
    p_type: {
        type: String,
        required: true,
        minLength: [2, "Product type should be at least 2 characters"],
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"], // Ensure the price is not negative
    },
    description: {
        type: String,
        required: true,
        maxLength: [500, "Description cannot exceed 500 characters"], // Limit the description length
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"], // Ensure stock is not negative
        default: 0, // Default to zero stock if not provided
    },
    category: {
        type: [String],
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    p_image: {
        type: String,
        required: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop", // Reference to the Shop schema
        required: true
    },
    ratings:[{
        type: Schema.Types.ObjectId,
        ref: "Ratings", // Reference to the Shop schema
        
    }],
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comments",
    }]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;


