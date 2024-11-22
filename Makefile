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
	./vendor/bin/sail pnpm i uuid --verbose