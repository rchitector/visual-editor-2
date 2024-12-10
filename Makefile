sail-restart:
	#./vendor/bin/sail stop
	./vendor/bin/sail down
	./vendor/bin/sail up

pnpm-run-dev:
	./vendor/bin/sail pnpm install  --verbose
	./vendor/bin/sail pnpm run dev -- --force

sail-down:
	./vendor/bin/sail down

pnpm-install:
	#./vendor/bin/sail pnpm install --verbose
	#./vendor/bin/sail pnpm i @vueuse/core @vueuse/components
	#./vendor/bin/sail pnpm i tailwindcss
	#./vendor/bin/sail pnpm install pnpm@latest
	#./vendor/bin/sail pnpm clean
	./vendor/bin/sail pnpx degit sveltejs/template my-new-svelte-app


vue-tsc:
	./vendor/bin/sail npx vue-tsc --noEmit
