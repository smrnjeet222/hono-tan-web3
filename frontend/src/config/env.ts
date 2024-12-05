import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
	VITE_WALLET_CONNECT_PROJECT_ID: z.string(),
	VITE_ALCHEMY_KEY: z.string(),
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse(import.meta.env);

// Export the result so we can use it in the project
export default env;
