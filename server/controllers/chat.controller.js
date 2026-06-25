const { generateRecipe, getConfigError, getProvider } = require('../services/llm.service');
const { 
    generateRecipe, 
    getConfigError, 
    getProvider 
} = require('../services/llm.service');

const prisma = require('../config/prisma');


// AI recipe chat / generate recipe

exports.chat = async (req, res) => {

    try {

        const {
            message,
            dishName
        } = req.body;


        const query =
            (dishName || message || '').trim();



        if (!query) {

            return res.status(400).json({
                message:"Please provide message"
            });

        }



        const configError =
            getConfigError();


        if(configError){

            return res.status(503).json({
                message:configError
            });

        }




        const result =
            await generateRecipe(query);



        // Save chat history if user logged in

        if(req.user?.id){


            await prisma.chatHistory.create({

                data:{


                    userId:req.user.id,


                    message:query,


                    response:
                    JSON.stringify(result.recipe)


                }


            });


        }




        res.json({

            recipe:result.recipe,

            provider:result.provider,

            model:result.model

        });


    }
    catch(err){


        console.error(
            "Chat error:",
            err
        );


        res.status(500).json({

            message:"Chat failed",

            error:err.message

        });


    }

};