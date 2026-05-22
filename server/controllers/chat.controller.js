const { generateRecipe, getConfigError, getProvider } = require('../services/llm.service');

exports.generateRecipe = async (req, res) => {
    try {
        const { prompt, dishName } = req.body;
        const query = (dishName || prompt || '').trim();

        if (!query) {
            return res.status(400).json({ message: 'Provide dishName or prompt' });
        }

        const configError = getConfigError();
        if (configError) {
            return res.status(503).json({ message: configError });
        }

        const { recipe, provider, model } = await generateRecipe(query);

        res.status(200).json({ recipe, query, provider, model });
    } catch (err) {
        console.error('Recipe generation error:', err);
        const status = typeof err.status === 'number' ? err.status : 500;
        res.status(status).json({
            message: err.message || 'Failed to generate recipe',
            provider: getProvider(),
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
