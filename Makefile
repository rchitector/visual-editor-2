sail-up:
	./vendor/bin/sail up

sail-down:
	./vendor/bin/sail down

npm-clear:
	./vendor/bin/sail npm cache clean --force

npm-install:
	#./vendor/bin/sail npm cache clean --force --no-progress --verbose
	#./vendor/bin/sail npm install --no-progress --verbose
	./vendor/bin/sail npm install tailwindcss postcss autoprefixer flowbite --no-progress --verbose
	#./vendor/bin/sail npm install --verbose

npm-run-dev:
	./vendor/bin/sail npm run dev
