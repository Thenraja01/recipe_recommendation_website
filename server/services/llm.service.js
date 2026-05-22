const OpenAI = require('openai');

const SYSTEM_PROMPT = `You are a professional chef assistant for a food delivery app.
Given a dish name or food prompt, return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "ingredients": ["string"],
  "instructions": "string with numbered steps separated by newlines",
  "prepTime": number,
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": "string",
  "tips": "optional short cooking tip"
}
Do not wrap the JSON in markdown code fences.`;

function getProvider() {
    return (process.env.LLM_PROVIDER || 'groq').toLowerCase();
}

function getConfigError() {
    const provider = getProvider();

    if (provider === 'groq' && !process.env.GROQ_API_KEY?.trim()) {
        return 'Set GROQ_API_KEY in server/.env — free key at https://console.groq.com/keys';
    }
    if (provider === 'openai' && !process.env.OPENAI_API_KEY?.trim()) {
        return 'Set OPENAI_API_KEY in server/.env (or use LLM_PROVIDER=groq).';
    }
    if (provider === 'ollama') {
        return null;
    }
    if (!['groq', 'openai', 'ollama'].includes(provider)) {
        return `Unknown LLM_PROVIDER "${provider}". Use groq, ollama, or openai.`;
    }
    return null;
}

function createClient() {
    const provider = getProvider();

    switch (provider) {
        case 'openai':
            return {
                client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
                model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
                provider,
                useJsonMode: true
            };

        case 'groq':
            return {
                client: new OpenAI({
                    apiKey: process.env.GROQ_API_KEY,
                    baseURL: 'https://api.groq.com/openai/v1'
                }),
                model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
                provider,
                useJsonMode: true
            };

        case 'ollama':
            return {
                client: new OpenAI({
                    apiKey: process.env.OLLAMA_API_KEY || 'ollama',
                    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1'
                }),
                model: process.env.LLM_MODEL || process.env.OLLAMA_MODEL || 'llama3.2',
                provider: 'ollama',
                useJsonMode: false
            };

        default:
            throw new Error(`Unsupported LLM_PROVIDER: ${provider}`);
    }
}

function extractJson(text) {
    if (!text?.trim()) {
        throw new Error('Empty response from language model');
    }

    const trimmed = text.trim();
    try {
        return JSON.parse(trimmed);
    } catch {
        const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenced) {
            return JSON.parse(fenced[1].trim());
        }
        const start = trimmed.indexOf('{');
        const end = trimmed.lastIndexOf('}');
        if (start !== -1 && end > start) {
            return JSON.parse(trimmed.slice(start, end + 1));
        }
        throw new Error('Model did not return valid JSON. Try a smaller prompt or another LLM_MODEL.');
    }
}

exports.getProvider = getProvider;
exports.getConfigError = getConfigError;

exports.generateRecipe = async (query) => {
    const configError = getConfigError();
    if (configError) {
        const err = new Error(configError);
        err.status = 503;
        throw err;
    }

    const { client, model, provider, useJsonMode } = createClient();

    const request = {
        model,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Create a detailed home-cook recipe for: ${query}` }
        ],
        temperature: 0.7,
        max_tokens: 1200
    };

    if (useJsonMode) {
        request.response_format = { type: 'json_object' };
    }

    let completion;
    try {
        completion = await client.chat.completions.create(request);
    } catch (err) {
        if (provider === 'groq') {
            const msg = err.status === 401
                ? 'Invalid GROQ_API_KEY. Create a free key at https://console.groq.com/keys'
                : `Groq API error: ${err.message}`;
            const wrapped = new Error(msg);
            wrapped.status = err.status === 401 ? 401 : 503;
            throw wrapped;
        }
        if (provider === 'ollama') {
            const hint = err.code === 'ECONNREFUSED' || err.message?.includes('fetch')
                ? ' Is Ollama running? Run: ollama pull llama3.2 && ollama serve'
                : '';
            const wrapped = new Error(`Ollama request failed.${hint} ${err.message}`);
            wrapped.status = 503;
            throw wrapped;
        }
        throw err;
    }

    const content = completion.choices[0]?.message?.content;
    const recipe = extractJson(content);

    return { recipe, provider, model };
};
