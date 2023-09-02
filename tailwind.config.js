/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['light', 'dark', 'cupcake', 'luxury', 'coffe', 'night']
	},
	plugins: [require('daisyui'), formsPlugin]
};
