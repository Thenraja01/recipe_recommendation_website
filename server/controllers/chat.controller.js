const prisma = require("../config/prisma");
const llmService = require("../services/llm.service");
const chefService = require("../services/chef.service");

exports.chat = async (req, res) => {
  try {
    const message = req.body.message?.trim();
    const mode = req.body.mode || "default";
    const sessionId = req.body.sessionId || "";

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // 1. Search blogs first (unless waiter mode)
    if (mode !== "waiter") {
      const blog = await prisma.blog.findFirst({
        where: {
          OR: [
            { title: { contains: message, mode: "insensitive" } },
            { content: { contains: message, mode: "insensitive" } },
            { ingredients: { contains: message, mode: "insensitive" } },
            { instructions: { contains: message, mode: "insensitive" } }
          ]
        },
        include: { author: { select: { username: true } } }
      });

      if (blog) {
        await saveChat(req.user.id, message, `blog:${blog.id}`, mode, sessionId);
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

      // 2. Search saved recipes
      const recipe = await prisma.recipe.findFirst({
        where: { title: { contains: message, mode: "insensitive" } },
        include: { ingredients: true }
      });

      if (recipe) {
        await saveChat(req.user.id, message, `recipe:${recipe.id}`, mode, sessionId);
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

      // 3. Search recipes for waiter mode or fallback
      if (mode === "waiter") {
        const menuRecipes = await prisma.recipe.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { ingredients: true }
        });

        if (menuRecipes.length > 0 && message.toLowerCase().includes("menu")) {
          await saveChat(req.user.id, message, `menu:${menuRecipes.length}`, mode, sessionId);
          return res.json({
            type: "menu",
            recipes: menuRecipes.map(r => ({
              title: r.title,
              prepTime: r.prepTime,
              servings: r.servings,
              difficulty: r.difficulty,
              ingredients: r.ingredients.map(i => i.name),
              id: r.id
            }))
          });
        }
      }
    }

    // 4. AI generation using chef service with memory
    const result = await chefService.chat({
      userId: req.user.id,
      message,
      mode,
    });

    const responseJson = JSON.stringify(result.recipe);

    await saveChat(req.user.id, message, responseJson, mode, sessionId);

    return res.json({
      type: "ai",
      recipe: {
        recipe: result.recipe,
        provider: result.provider,
        model: result.model,
        mode: result.mode
      }
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: err.message });
  }
};

async function saveChat(userId, message, response, mode, sessionId) {
  try {
    await prisma.chatHistory.create({
      data: { userId, message, response, mode, sessionId }
    });
  } catch (err) {
    console.error("Failed to save chat history:", err.message);
  }
}
