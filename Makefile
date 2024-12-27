sail-restart:
	#./vendor/bin/sail stop
	./vendor/bin/sail down
	./vendor/bin/sail up

pnpm-run-dev:
	./vendor/bin/sail npm install
	./vendor/bin/sail npm run dev

sail-down:
	./vendor/bin/sail down

pnpm-install:
	./vendor/bin/sail npm install
	./vendor/bin/sail npm install @svelte/runes


vue-tsc:
	./vendor/bin/sail npx vue-tsc --noEmit
