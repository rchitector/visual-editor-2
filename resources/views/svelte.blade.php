<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{config('app.name')}}</title>
    @vite(['resources/css/svelte/app.css', 'resources/js/svelte/main.ts'])
</head>
<body class="font-sans antialiased bg-white text-gray-900 dark:bg-gray-800 dark:text-white/50">
<div id="svelte-app"></div>
</body>
</html>
