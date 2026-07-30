require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    cookieMaxAge: parseInt(process.env.JWT_COOKIE_MAX_AGE, 10) || 30 * 24 * 60 * 60 * 1000,
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },

  cors: {
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  },

  llm: {
    provider: (process.env.LLM_PROVIDER || 'groq').toLowerCase(),
    model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
    maxTokens: parseInt(process.env.MAX_AI_TOKENS, 10) || 2048,
    requestTimeout: parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10) || 30000,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,

    groq: {
      apiKey: process.env.GROQ_API_KEY,
      baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
    },

    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },

    ollama: {
      apiKey: process.env.OLLAMA_API_KEY || 'ollama',
      baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
      model: process.env.OLLAMA_MODEL || 'llama3.2',
    },
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};

const requiredVars = {
  'DATABASE_URL': config.database.url,
  'JWT_SECRET': config.jwt.secret,
};

const missing = Object.entries(requiredVars)
  .filter(([, value]) => !value?.trim())
  .map(([name]) => name);

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach((name) => console.error(`  - ${name}`));
  console.error('Copy server/.env.example to server/.env and fill in the values.');
  if (config.isProd) {
    process.exit(1);
  }
}

const provider = config.llm.provider;
if (provider === 'groq' && !config.llm.groq.apiKey?.trim()) {
  console.warn('Warning: GROQ_API_KEY not set. LLM features will fail until configured.');
  console.warn('  Get a free key at https://console.groq.com/keys');
} else if (provider === 'openai' && !config.llm.openai.apiKey?.trim()) {
  console.warn('Warning: OPENAI_API_KEY not set. LLM features will fail until configured.');
}

if (config.isDev) {
  console.log(`Mode: development | LLM: ${provider} | Port: ${config.port}`);
}

Object.freeze(config);

module.exports = config;
