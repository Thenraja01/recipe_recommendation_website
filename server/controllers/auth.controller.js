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

const publicUser = (user) => ({
id:user.id,
username:user.username,
email:user.email,
avatar:user.avatar,
role:user.role
});


exports.register = async (req,res)=>{

try{

const {
username,
email,
password
}=req.body;

if(!username || !email || !password){
return res.status(400).json({ message:"Username, email, and password are required" });
}

if(password.length < 6){
return res.status(400).json({ message:"Password must be at least 6 characters" });
}

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
sameSite:'lax',
maxAge:30*24*60*60*1000
}
);



res.status(201).json({

message:"Registered successfully",

token,
user:publicUser(user)

});


}
catch(err){

console.log(err);

res.status(500).json({
error:err.message
});

}

};

exports.login = async (req,res)=>{
try{
const { email, password } = req.body;

if(!email || !password){
return res.status(400).json({ message:"Email and password are required" });
}

const user = await prisma.user.findUnique({
where:{ email }
});

if(!user){
return res.status(401).json({ message:"Invalid email or password" });
}

const passwordMatches = await bcrypt.compare(password,user.password);

if(!passwordMatches){
return res.status(401).json({ message:"Invalid email or password" });
}

const token = generateToken(user.id);

res.cookie(
'token',
token,
{
httpOnly:true,
sameSite:'lax',
maxAge:30*24*60*60*1000
}
);

res.json({
message:"Login successful",
token,
user:publicUser(user)
});
}
catch(err){
res.status(500).json({ error:err.message });
}
};

exports.logout = async (req,res)=>{
res.clearCookie('token', { httpOnly:true, sameSite:'lax' });
res.json({ message:"Logged out" });
};

exports.getMe = async (req,res)=>{
try{
const user = await prisma.user.findUnique({
where:{ id:req.user.id },
select:{
id:true,
username:true,
email:true,
avatar:true,
role:true,
preferences:{
include:{ cuisines:true }
}
}
});

if(!user){
return res.status(404).json({ message:"User not found" });
}

res.json({
user:{
...publicUser(user),
preferences:user.preferences ? {
dietary:user.preferences.dietary,
maxDeliveryMinutes:user.preferences.maxDeliveryMinutes,
preferredCuisines:user.preferences.cuisines.map(item=>item.cuisine)
} : null
}
});
}
catch(err){
res.status(500).json({ error:err.message });
}
};
