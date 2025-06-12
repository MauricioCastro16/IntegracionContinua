import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 3005
	},
	test: {
		coverage: {
			provider: 'v8', // Usando c8 como proveedor de cobertura
			reporter: ['text', 'json', 'html'], // Reportes en consola, JSON, HTML
			all: true, // Incluye todos los archivos en la cobertura
			include: ['src/**/*.ts', 'src/**/*.svelte'], // Solo incluye archivos .ts y .svelte en la cobertura
			exclude: ['node_modules', 'src/**/*.test.ts'] // Excluye los archivos de test y node_modules
		},
		projects: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['tests/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
