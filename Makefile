build:
	./scripts/build.sh

publish:
	npm run build
	lerna publish
