const llmService = require('../services/llm.service');

exports.generateRecipe = async (req, res) => {
    const query = req.body?.query || req.body?.prompt || req.body?.dish;

    if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({
            error: 'Recipe prompt is required'
        });
    }

    try {
        const result = await llmService.generateRecipe(query.trim());
        return res.json(result);
    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
};
