build:
	./scripts/build.sh

publish: build
	lerna publish --force-publish=*

test: build
	lerna run test
