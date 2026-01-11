/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'brand-primary': '#6366f1', // Indigo 500
                'brand-secondary': '#8b5cf6', // Violet 500
                'brand-accent': '#ec4899', // Pink 500
                'brand-dark': '#1e1b4b', // Indigo 950
                'brand-success': '#10b981', // Emerald 500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
