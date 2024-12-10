import 'flowbite';
import {mount} from 'svelte';
import App from '@/js/svelte/App.svelte';

const app = mount(App, {
    target: document.getElementById("svelte-app") as HTMLElement,
});

export default app;
