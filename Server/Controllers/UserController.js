const bcrypt = require('bcrypt');
const jwt = require('../jwt/jwt');
const User = require('../models/userSchema.js');
const cloudinary = require('../util/cloudinary.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const crypto = require('../util/crypto.js');
const { sendVerificationEmail, sendResetEmailSuccessful } = require('../NodeMalier/nodemailer.js');
const Register = async (req, res) => {
    try {
        const saltRounds = 10;
        const { username, email, password, userType } = req.body;

        // Ensure a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Image is required." });
        }
        const image = req.file.path;


        // Validation checks
        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }
        if (!userType) {
            return res.status(400).json({ message: "User type is required." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const verificationToken = crypto.generateToken(16);
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'image'
        });
        const imageUrl = result.secure_url;

        // Create new user instance and save to the database
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            image: imageUrl,
            userType: userType,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        });
        await newUser.save();

        // Generate a JWT token for the user
        const userId = newUser._id;
        const token = jwt.createToken({ userId });

        await sendVerificationEmail(newUser.email, verificationToken)
        // Send response with the new user data and token
        res.status(201).json({
            userId,
            password: undefined
            , token
        });

    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Send a generic error message to the client
    }
}

const Login = async (req, res) => {
    try {

        const { email, password } = req.body;
        // Ensure a file is uploaded


        // Validation checks

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }


        // Hash the password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(403).json({ message: "Passwords Not Matched." });
        }

        const userId = user._id;
        const token = jwt.createToken({ userId });
        const username = user.username
        const isAdmin = user.userType

        // Send response with the new user data and token
        res.status(201).json({ token, username, isAdmin, userId });

    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Send a generic error message to the client
    }
}

const Logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1]; // Split by space to get the token
        if (!token) {
            return res.status(401).send('Token not found');
        }

        // Verify the token (using your specific method for token verification)
        const secret = process.env.SECRET_KEY;
        const result = jwt.verifyToken(token, secret); // Example with 'jsonwebtoken'

        if (result) {

            res.status(200).send('Logout Successful');
        } else {
            res.status(401).send('Invalid Token');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User Not Exist');
        }
        const token = crypto.generateToken(17);
        const resetPasswordTokenexpires = Date.now() + 1 * 60 * 60 * 1000
        user.resetPasswordToken = token
        user.resetPasswordExpiresAt = resetPasswordTokenexpires
        await user.save();
        await sendVerificationEmail(user.email, token)
        return res.status(200).json({ message: 'Reset Pssword Email Successfully sent', success: true, resetToken: token });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }


}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).send('ResetToken Expired Or not Provided');
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        user.password = hashedpassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save();
        await sendResetEmailSuccessful(user.email);
        res.status(200).json({ success: true, message: 'Password Reset Successful' })


    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

}

const getCurrentUserImage = async (req, res) => {
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
            decoded = jwt.verifyToken(token, secret); // Use your custom verifyToken function
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required." });

        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "user not  present." });
        }
        const image=user.image;
       
        return res.status(200).json({ userimage: image });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {
    Register,
    Login,
    Logout,
    forgotPassword,
    resetPassword,
    getCurrentUserImage

}
