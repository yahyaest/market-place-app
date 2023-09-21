/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite/**/*.js'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: ['light', 'dark', 'cupcake', 'luxury', 'coffe', 'night']
	},
	plugins: [require('daisyui'), formsPlugin, require('flowbite/plugin')]
};
