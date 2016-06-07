.PHONY: test

install:
	npm install

test:
	mocha --recursive test/**/*.spec.js

release:
	npm version $(v)
	npm publish
	git push
	git push --tags
