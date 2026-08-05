const prisma = require('../config/prisma');
const chefService = require('../services/chef.service');

exports.createComment = async (req, res) => {
  try {
    const { blogId, question } = req.body;
    const userId = req.user.id;

    if (!blogId || !question) {
      return res.status(400).json({ success: false, message: 'Blog ID and question are required' });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: { author: true }
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = await prisma.blogComment.create({
      data: {
        blogId,
        userId,
        question,
        isAIAnswer: false
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await prisma.blogComment.findMany({
      where: { blogId },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.askAI = async (req, res) => {
  try {
    const { blogId, question } = req.body;
    const userId = req.user.id;

    if (!blogId || !question) {
      return res.status(400).json({ success: false, message: 'Blog ID and question are required' });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const context = `
Blog Title: ${blog.title}
Blog Content: ${blog.content}
Ingredients: ${blog.ingredients}
Instructions: ${blog.instructions}
Recipe History: ${blog.recipeHistory || 'None'}
`;

    const systemPrompt = `You are a helpful cooking assistant answering questions about a specific blog post and recipe. 
Use the provided blog context to answer accurately. If the answer is not in the context, use your general cooking knowledge but mention it's not from the specific blog.

Context:
${context}

User Question: ${question}

Provide a helpful, accurate answer in a friendly tone. Keep it concise but informative.`;

    const response = await chefService.chat({
      userId,
      message: systemPrompt,
      mode: 'default'
    });

    const answer = response.recipe?.instructions || response.recipe?.title || 
      'I apologize, but I could not generate a specific answer. Please try rephrasing your question.';

    const comment = await prisma.blogComment.create({
      data: {
        blogId,
        userId,
        question,
        answer,
        isAIAnswer: true
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });

    res.json({ success: true, comment, aiResponse: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await prisma.blogComment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await prisma.blogComment.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
