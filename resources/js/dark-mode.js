document.addEventListener('DOMContentLoaded', function() {

    const darkIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    darkIconPath.setAttribute('d', 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z');

    const darkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    darkIcon.setAttribute('id', 'theme-toggle-dark-icon');
    darkIcon.setAttribute('class', 'hidden flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white');
    darkIcon.setAttribute('fill', 'currentColor');
    darkIcon.setAttribute('viewBox', '0 0 20 20');
    darkIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    darkIcon.appendChild(darkIconPath);

    const lightIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lightIconPath.setAttribute('d', 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z');
    lightIconPath.setAttribute('fill-rule', 'evenodd');
    lightIconPath.setAttribute('clip-rule', 'evenodd');

    const lightIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lightIcon.setAttribute('id', 'theme-toggle-light-icon');
    lightIcon.setAttribute('class', 'hidden flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white');
    lightIcon.setAttribute('fill', 'currentColor');
    lightIcon.setAttribute('viewBox', '0 0 20 20');
    lightIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    lightIcon.appendChild(lightIconPath);

    let button = document.getElementById('theme-toggle')
    if (!button) {
        button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('id', 'theme-toggle');
        button.setAttribute('class', 'border z-40 absolute top-5 right-5 flex items-center p-2 text-gray-900 rounded-full dark:text-white bg-gray-100 dark:bg-gray-800 group');
        document.body.appendChild(button)
    }
    button.appendChild(darkIcon)
    button.appendChild(lightIcon)

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-toggle-light-icon').classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark')
        document.getElementById('theme-toggle-dark-icon').classList.remove('hidden');
    }

    document.getElementById('theme-toggle').addEventListener('click', function () {
        document.getElementById('theme-toggle-dark-icon').classList.toggle('hidden');
        document.getElementById('theme-toggle-light-icon').classList.toggle('hidden');

        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });
});