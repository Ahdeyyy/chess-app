/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Saira Variable', 'sans-serif'],
			},
			colors: {
				'board-bg': '#da6d42',
				'board-text': ' #84240c',
			}
		}
	},

	plugins: []
};

module.exports = config;
