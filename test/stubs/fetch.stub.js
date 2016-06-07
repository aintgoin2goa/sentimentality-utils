'use strict';
const sinon = require('sinon');

let returnValue = null;

let responseStub = {
	status: 200,
	json: () => Promise.resolve(returnValue)
};

Object.defineProperty(responseStub, 'ok', {
	get: () => status < 400
});


let stub = sinon.stub().returns(Promise.resolve(responseStub));

module.exports = {
	fetch : stub,
	setup : data => returnValue = data
};

