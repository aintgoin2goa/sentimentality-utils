.PHONY: test

install:
	npm install

test:
	mocha --recursive test/**/*.spec.js
