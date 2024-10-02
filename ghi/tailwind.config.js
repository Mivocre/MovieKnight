/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                dmSans: ['DM Sans', 'system-ui'],
            },
        },
    },
    plugins: [],
}
