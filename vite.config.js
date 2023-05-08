import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['data'],
		},
		proxy: {
			'/image-caption-pairs': 'http://localhost:3000',
			'/update-caption': 'http://localhost:3000',
			'/directories': 'http://localhost:3000',
			'/add-filenames-to-captions': 'http://localhost:3000',
			'/save-files': 'http://localhost:3000',
			'/create-directory': 'http://localhost:3000',
		}
	}
});
