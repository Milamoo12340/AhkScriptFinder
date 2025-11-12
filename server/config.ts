/**
 * Configuration utility that handles environment variables for both
 * Replit AI integrations and external deployments
 */

export const config = {
  // OpenAI Configuration
  openai: {
    // Prefer Replit AI integration, fallback to standard OpenAI env vars
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 
            process.env.OPENAI_API_KEY || 
            process.env.OPENAI_API || 
            undefined
  },

  // GitHub Configuration
  github: {
    // Check multiple possible environment variable names
    token: process.env.GITHUB_TOKEN || 
           process.env.GITHUB_PERSONAL_ACCESS_TOKEN || 
           process.env.Github_Token || 
           undefined
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development'
  }
};

// Validation
export function validateConfig() {
  const warnings: string[] = [];
  
  if (!config.openai.apiKey) {
    warnings.push('⚠️  No OpenAI API key found. AI generation features will not work.');
    warnings.push('   Set one of: AI_INTEGRATIONS_OPENAI_API_KEY, OPENAI_API_KEY, or OPENAI_API');
  }
  
  if (!config.github.token) {
    warnings.push('⚠️  No GitHub token found. GitHub search will have lower rate limits (60 requests/hour).');
    warnings.push('   Set one of: GITHUB_TOKEN, GITHUB_PERSONAL_ACCESS_TOKEN, or Github_Token');
  }
  
  if (!config.database.url) {
    warnings.push('⚠️  No DATABASE_URL found. Database features will not work.');
  }
  
  return warnings;
}
