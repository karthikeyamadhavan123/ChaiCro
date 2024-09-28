const token=require('jsonwebtoken');
const path=require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const secret=process.env.SECRET_KEY;
const jwt=require('jsonwebtoken');

const createToken=(payload)=>{
return token.sign(payload,secret,{
    expiresIn:'2h',
})
}

const verifyToken = (inputToken, secret) => {
    try {
       
        
      const decoded = jwt.verify(inputToken, secret);
      return decoded.userId;
    } catch (error) {
      console.error(error);
      return null; 
    }
  };

module.exports={
    createToken,
    verifyToken
}