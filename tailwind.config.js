import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
        './resources/**/*.svelte',
        './node_modules/flowbite/**/*.js',
    ],
    safelist: [
        {
            pattern: /^text-.*/, // Сохранить все классы, начинающиеся с text-
            variants: ['hover', 'dark', 'dark:hover'], // Сохранить вариации
        },
        {
            pattern: /^fill-.*/, // Сохранить все классы, начинающиеся с fill-
            variants: ['hover', 'dark', 'dark:hover'], // Сохранить вариации
        },
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // colors: {
            //     ...colors,
            // }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
};
