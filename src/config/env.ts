import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    return null;
  }

  return parsed.data;
}

export const env = validateEnv();