// controllers/chat.controller.js

const prisma = require("../config/prisma");
const llmService = require("../services/llm.service");

exports.chat = async (req, res) => {
    try {

        const message = req.body.message?.trim();

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }


        await prisma.chatHistory.create({
            data: {
                userId: req.user.id,
                message,
                response: ""
            }
        });
        const blog = await prisma.blog.findFirst({

            where: {

                OR: [

                    {
                        title: {
                            contains: message,
                            mode: "insensitive"
                        }
                    },

                    {
                        content: {
                            contains: message,
                            mode: "insensitive"
                        }
                    },

                    {
                        ingredients: {
                            contains: message,
                            mode: "insensitive"
                        }
                    },

                    {
                        instructions: {
                            contains: message,
                            mode: "insensitive"
                        }
                    }

                ]

            },

            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }

        });

        //------------------------------------------------
        // Blog Found
        //------------------------------------------------

        if (blog) {

            const reply =
                `I found a blog named "${blog.title}".`;

            await prisma.chatHistory.updateMany({

                where: {
                    userId: req.user.id,
                    message,
                    response: ""
                },

                data: {
                    response: reply
                }

            });

            return res.json({

                type: "blog",

                blog: {
                    id: blog.id,
                    title: blog.title,
                    summary: blog.content.substring(0, 250) + "...",
                    author: blog.author.username
                }

            });

        }

        //------------------------------------------------
        // Search Saved Recipes
        //------------------------------------------------

        const recipe = await prisma.recipe.findFirst({

            where: {

                title: {
                    contains: message,
                    mode: "insensitive"
                }

            },

            include: {
                ingredients: true
            }

        });

        if (recipe) {

            return res.json({

                type: "recipe",

                recipe: {
                    title: recipe.title,
                    prepTime: recipe.prepTime,
                    servings: recipe.servings,
                    difficulty: recipe.difficulty,
                    instructions: recipe.instructions,
                    ingredients: recipe.ingredients.map(i => i.name)
                }

            });

        }

        //------------------------------------------------
        // AI
        //------------------------------------------------

        const aiRecipe =
            await llmService.generateRecipe(message);

        await prisma.chatHistory.updateMany({

            where: {
                userId: req.user.id,
                message,
                response: ""
            },

            data: {
                response: JSON.stringify(aiRecipe)
            }

        });

        return res.json({

            type: "ai",

            recipe: aiRecipe

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};