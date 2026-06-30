import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_BASE_API_URL: z.string().url(),
  NEXT_PUBLIC_IP_API_URL: z.string().url(),
  NEXT_PUBLIC_COUNTRY_CODE: z
    .string()
    .length(2)
    .transform((s) => s.toLowerCase()),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  NEXT_PUBLIC_IP_API_URL: process.env.NEXT_PUBLIC_IP_API_URL,
  NEXT_PUBLIC_COUNTRY_CODE: process.env.NEXT_PUBLIC_COUNTRY_CODE,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(
    `Invalid environment variables.\n${issues}\n\nSee .env.example for required values.`,
  );
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;

console.log('ENV:', env);
