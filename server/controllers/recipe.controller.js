const prisma = require('../config/prisma');


// CREATE RECIPE

exports.createRecipe = async(req,res)=>{

try{


const {
title,
ingredients,
instructions,
prepTime,
servings,
difficulty
}=req.body;



const recipe =
await prisma.recipe.create({

data:{


title,

instructions,

prepTime,

servings,

difficulty,


creatorId:req.user.id,


ingredients:{

create:
ingredients.map(item=>({

name:item

}))

}


},


include:{
ingredients:true
}

});



res.status(201).json({

message:"Recipe created",

recipe

});


}
catch(err){

res.status(500).json({
error:err.message
});

}

};





// GET ALL RECIPES


exports.getRecipes = async(req,res)=>{


try{


const recipes =
await prisma.recipe.findMany({

include:{


creator:{
select:{
id:true,
username:true,
avatar:true
}
},


ingredients:true


}


});



res.json({
recipes
});


}
catch(err){

res.status(500).json({
error:err.message
});

}


};





// GET SINGLE


exports.getRecipeById=async(req,res)=>{


try{


const recipe =
await prisma.recipe.findUnique({

where:{
id:req.params.id
},


include:{

creator:true,

ingredients:true

}


});



if(!recipe){

return res.status(404)
.json({
message:"Recipe not found"
});

}



res.json({
recipe
});


}
catch(err){

res.status(500).json({
error:err.message
});

}

};





// UPDATE


exports.updateRecipe = async(req,res)=>{


try{


const recipe =
await prisma.recipe.findUnique({

where:{
id:req.params.id
}

});



if(!recipe){

return res.status(404)
.json({
message:"Recipe not found"
});

}



if(recipe.creatorId !== req.user.id){

return res.status(403)
.json({
message:"Unauthorized"
});

}




const updated =
await prisma.recipe.update({

where:{
id:req.params.id
},


data:req.body

});



res.json({

message:"Updated",

recipe:updated

});


}
catch(err){

res.status(500).json({
error:err.message
});

}

};






// DELETE


exports.deleteRecipe=async(req,res)=>{


try{


await prisma.recipe.delete({

where:{
id:req.params.id
}

});



res.json({

message:"Recipe deleted"

});


}
catch(err){

res.status(500).json({
error:err.message
});

}

};