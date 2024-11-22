sail-restart:
	./vendor/bin/sail stop
	./vendor/bin/sail up

pnpm-run-dev:
	./vendor/bin/sail pnpm install  --verbose
	./vendor/bin/sail pnpm run dev

sail-down:
	./vendor/bin/sail down

pnpm-install:
	#./vendor/bin/sail pnpm install --verbose
	./vendor/bin/sail pnpm install @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev

vue-tsc:
	./vendor/bin/sail npx vue-tsc --noEmit
