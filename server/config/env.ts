import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
	PORT: z.coerce.number().min(1000).default(8080),
	JWT_SECRET: z.string(),
	NODE_ENV: z
		.union([z.literal("development"), z.literal("production")])
		.default("development"),
	// ...
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse(process.env);

export type Environment = z.infer<typeof envSchema>;

// Export the result so we can use it in the project
export default env;
