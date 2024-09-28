const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT;
const registerRoutes = require('./routes/UserRoute');
const shopRoutes=require('./Routes/Shoproute')
const CartRoutes=require('./Routes/CartRoute')
main().catch(err => console.log(err));
const cors = require('cors')
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database Connected');

}

//MIDDLEWARES


// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(cors());


// Import and use your routes

app.use('/api', registerRoutes);
app.use('/shop',shopRoutes)
app.use('/cart',CartRoutes)



app.listen(port, () => {
    console.log(`Server Running on ${port}`);

})