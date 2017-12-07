LERNA = ./node_modules/.bin/lerna

bootstrap:
	$(LERNA) bootstrap

build:
	./scripts/build.sh

publish: build
	$(LERNA) publish --force-publish=*

test: build
	$(LERNA) run test
