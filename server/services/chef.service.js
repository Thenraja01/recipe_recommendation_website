const config = require('../config/env');

const { OpenAI } = require('openai');

// In-memory short-term memory: userId -> array of messages
const shortTermMemory = new Map();

const MEMORY_SIZE = 10;

const MODE_PROMPTS = {
  default: `You are a professional chef assistant for a food app called RecipeRec. 
Given a dish name or food question, return ONLY valid JSON with this exact shape:
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
Do not wrap the JSON in markdown code fences.`,

  healthy: `You are a health-conscious chef assistant. 
Given a dish name or food question, return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "ingredients": ["string - focus on nutritious, whole foods"],
  "instructions": "string with numbered steps separated by newlines - emphasize healthy cooking methods",
  "prepTime": number,
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": "string",
  "tips": "nutrition tip and health benefit",
  "calories": "optional estimated calorie range",
  "healthScore": "A+" | "A" | "B" | "C"
}
Focus on low-fat, low-sugar, high-protein, and nutrient-dense ingredients.`,

  quick: `You are a 5-minute fast cooking chef assistant.
Given a dish name or food question, return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "ingredients": ["string - minimal, easy-to-find items"],
  "instructions": "string with numbered steps separated by newlines - MAX 5 steps, each very short",
  "prepTime": number (must be 15 or less),
  "servings": number,
  "difficulty": "Easy",
  "cuisine": "string",
  "tips": "time-saving hack"
}
All recipes must be cookable in under 15 minutes with minimal ingredients.`,

  veg: `You are a vegetarian chef assistant.
Given a dish name or food question, return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "ingredients": ["string - NO meat, NO fish, NO seafood"],
  "instructions": "string with numbered steps separated by newlines",
  "prepTime": number,
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": "string",
  "tips": "protein source suggestion",
  "proteinSource": "string describing main plant protein"
}
All recipes must be 100% vegetarian. No meat, fish, or seafood.`,

  nonveg: `You are a non-vegetarian chef assistant specializing in meat, poultry, and seafood dishes.
Given a dish name or food question, return ONLY valid JSON with this exact shape:
{
  "title": "string",
  "ingredients": ["string - include meat/poultry/seafood"],
  "instructions": "string with numbered steps separated by newlines",
  "prepTime": number,
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": "string",
  "tips": "cooking technique tip for the meat",
  "proteinType": "chicken" | "beef" | "pork" | "fish" | "seafood" | "lamb" | "other"
}`,

  waiter: `You are a friendly virtual restaurant waiter for RecipeRec Bistro.
Your job is to recommend dishes, describe menu items, and assist with ordering.
When asked, return ONLY valid JSON with this exact shape:
{
  "title": "string - dish name",
  "description": "string - appetizing description",
  "ingredients": ["string"],
  "price": "string like '$14.99'",
  "category": "Appetizer" | "Main Course" | "Dessert" | "Beverage",
  "pairing": "optional drink pairing suggestion",
  "chefNote": "optional chef's special note"
}
Be warm, professional, and enthusiastic about the food.`
};

function getProvider() {
  return config.llm.provider;
}

function createClient() {
  const provider = getProvider();
  switch (provider) {
    case 'openai':
      return {
        client: new OpenAI({ apiKey: config.llm.openai.apiKey }),
        model: config.llm.openai.model,
        provider,
        useJsonMode: true
      };
    case 'groq':
      return {
        client: new OpenAI({
          apiKey: config.llm.groq.apiKey,
          baseURL: config.llm.groq.baseURL
        }),
        model: config.llm.model,
        provider,
        useJsonMode: true
      };
    case 'ollama':
      return {
        client: new OpenAI({
          apiKey: config.llm.ollama.apiKey,
          baseURL: config.llm.ollama.baseURL
        }),
        model: config.llm.ollama.model,
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
    throw new Error('Model did not return valid JSON.');
  }
}

// Short-term memory
function getMemory(userId) {
  if (!shortTermMemory.has(userId)) {
    shortTermMemory.set(userId, []);
  }
  return shortTermMemory.get(userId);
}

function addToMemory(userId, role, content) {
  const memory = getMemory(userId);
  memory.push({ role, content });
  if (memory.length > MEMORY_SIZE) {
    memory.splice(0, memory.length - MEMORY_SIZE);
  }
}

function clearMemory(userId) {
  shortTermMemory.delete(userId);
}

// Main chat method
exports.chat = async ({ userId, message, mode = 'default', history = [] }) => {
  const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.default;

  const memory = getMemory(userId);
  addToMemory(userId, 'user', message);

  const { client, model, provider, useJsonMode } = createClient();

  const messages = [
    { role: 'system', content: systemPrompt },
    ...memory.slice(-MEMORY_SIZE),
  ];

  const request = {
    model,
    messages,
    temperature: config.llm.temperature || 0.7,
    max_tokens: config.llm.maxTokens || 1200,
  };

  if (useJsonMode && mode !== 'waiter') {
    request.response_format = { type: 'json_object' };
  }

  const completion = await client.chat.completions.create(request);
  const content = completion.choices[0]?.message?.content;

  let parsed;
  try {
    parsed = extractJson(content);
  } catch {
    parsed = { title: 'Recipe', instructions: content, ingredients: [] };
  }

  addToMemory(userId, 'assistant', JSON.stringify(parsed));

  return { recipe: parsed, provider, model, mode };
};

exports.clearMemory = clearMemory;
exports.getMemory = getMemory;
exports.MODE_PROMPTS = MODE_PROMPTS;
