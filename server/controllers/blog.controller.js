const prisma = require('../config/prisma');
const llmService = require('../services/llm.service.js');

// CREATE BLOG
exports.createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            image,
            ingredients,
            instructions,
            recipeHistory
        } = req.body;

        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                image,
                ingredients,
                instructions,
                recipeHistory,
                authorId: req.user.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// GET ALL BLOGS
exports.getBlogs = async (req, res) => {
    try {
        const { search } = req.query;
        
        const where = search ? {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { ingredients: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const blogs = await prisma.blog.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            blogs
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// GET SINGLE BLOG
exports.getBlogById = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Fetch related blogs (same author or matching keywords)
        const relatedBlogs = await prisma.blog.findMany({
            where: {
                id: { not: blog.id },
                OR: [
                    { authorId: blog.authorId },
                    { title: { contains: blog.title.split(' ')[0], mode: 'insensitive' } }
                ]
            },
            take: 3,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            blog,
            relatedBlogs
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: req.params.id
            }
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        if (blog.authorId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized - you can only edit your own blogs"
            });
        }

        const updated = await prisma.blog.update({
            where: {
                id: req.params.id
            },
            data: req.body,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });

        res.json({
            message: "Blog updated successfully",
            blog: updated
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: req.params.id
            }
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        if (blog.authorId !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized - you can only delete your own blogs"
            });
        }

        await prisma.blog.delete({
            where: {
                id: req.params.id
            }
        });

        res.json({
            message: "Blog deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// AI ASSIST ENDPOINT
exports.aiAssist = async (req, res) => {
    try {
        const { action, prompt, text } = req.body;

        let result;

        switch (action) {
            case 'generateBlog':
                result = await llmService.generateBlog(prompt);
                break;
            case 'expandContent':
                result = await llmService.expandContent(text);
                break;
            case 'summarizeContent':
                result = await llmService.summarizeContent(text);
                break;
            case 'rewriteContent':
                result = await llmService.rewriteContent(text);
                break;
            case 'generateRecipeDetails':
                result = await llmService.generateRecipeDetails(prompt);
                break;
            case 'answerRecipeQuestion':
                result = await llmService.answerRecipeQuestion(prompt);
                break;
            default:
                return res.status(400).json({
                    message: "Invalid action. Supported actions: generateBlog, expandContent, summarizeContent, rewriteContent, generateRecipeDetails, answerRecipeQuestion"
                });
        }

        res.json({
            result,
            provider: result.provider,
            model: result.model
        });
    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({
            error: err.message
        });
    }
};
