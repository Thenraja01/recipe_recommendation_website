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

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Blog title cannot be empty" });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Blog content cannot be empty" });
        }
        if (!ingredients || !ingredients.trim()) {
            return res.status(400).json({ message: "Ingredients list cannot be empty" });
        }
        if (!instructions || !instructions.trim()) {
            return res.status(400).json({ message: "Cooking instructions cannot be empty" });
        }

        const blog = await prisma.blog.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                image: image?.trim() || null,
                ingredients: ingredients.trim(),
                instructions: instructions.trim(),
                recipeHistory: recipeHistory?.trim() || null,
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

// Helper to create URL slug from title
const slugify = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// GET ALL BLOGS WITH PAGINATION & SEARCH (Filters out any empty blogs)
exports.getBlogs = async (req, res) => {
    try {
        const { search } = req.query;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 6));
        const skip = (page - 1) * limit;

        const where = {
            title: { not: '' },
            content: { not: '' },
            ...(search ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                    { ingredients: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        };

        const [totalBlogs, blogs] = await Promise.all([
            prisma.blog.count({ where }),
            prisma.blog.findMany({
                where,
                skip,
                take: limit,
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
            })
        ]);

        const totalPages = Math.ceil(totalBlogs / limit) || 1;

        res.json({
            blogs: blogs.map(b => ({
                ...b,
                slug: slugify(b.title)
            })),
            pagination: {
                total: totalBlogs,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// GET SINGLE BLOG BY ID OR SLUG
exports.getBlogById = async (req, res) => {
    try {
        const identifier = decodeURIComponent(req.params.id || '').trim();
        if (!identifier) {
            return res.status(400).json({ message: "Invalid blog identifier" });
        }

        // 1. Try finding by ID first
        let blog = null;
        try {
            blog = await prisma.blog.findUnique({
                where: {
                    id: identifier
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
        } catch (_) {}

        // 2. If not found by ID, search by slug / title
        if (!blog) {
            const allBlogs = await prisma.blog.findMany({
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

            blog = allBlogs.find(
                b => slugify(b.title) === identifier.toLowerCase() || b.id === identifier
            );
        }

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
            blog: {
                ...blog,
                slug: slugify(blog.title)
            },
            relatedBlogs: relatedBlogs.map(r => ({
                ...r,
                slug: slugify(r.title)
            }))
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
