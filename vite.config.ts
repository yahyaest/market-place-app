import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { webSocketServer } from './src/servers/webSocket';

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	server: {
		host: '0.0.0.0',
		port: 5173,
		fs: {
			allow: ['./static']
		}
	}
});
