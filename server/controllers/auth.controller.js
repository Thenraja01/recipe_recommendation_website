const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};


exports.register = async (req,res)=>{

try{

const {
username,
email,
password
}=req.body;


const existingUser =await prisma.user.findUnique({
where:{email}
});


if(existingUser){
return res.status(400).json({
message:"User already exists"
});
}



const hashedPassword =
await bcrypt.hash(password,10);



const user =await prisma.user.create({

data:{
username,
email,
password:hashedPassword
}

});


const token =generateToken(user.id);



res.cookie(
'token',
token,
{
httpOnly:true,
sameSite:'strict',
maxAge:30*24*60*60*1000
}
);



res.status(201).json({

message:"Registered successfully",

user:{
id:user.id,
username:user.username,
email:user.email
}

});


}
catch(err){

console.log(err);

res.status(500).json({
error:err.message
});

}

};