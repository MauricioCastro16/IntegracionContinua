import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e', // Directorio de pruebas
	use: {
		baseURL: process.env.BASE_URL_E2E || 'http://localhost:3005', // URL del entorno
		headless: true
	},
	projects: [
		//{
		//	name: 'firefox',
		//	use: { ...devices['Desktop Firefox'] }
		//}
		{
			name: 'chrome',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
