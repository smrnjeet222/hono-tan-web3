/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
	readonly VITE_ALCHEMY_KEY: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
