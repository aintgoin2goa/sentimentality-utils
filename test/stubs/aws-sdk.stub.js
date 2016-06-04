'use strict';
const sinon = require('sinon');

function getStubbedMethod(arg1, arg2){
	return sinon.stub().callsArgWith(1, arg1, arg2);
}

const scanResult = {Items:[{uid:'uid'}]};

const documentClientStub =  {
	put: getStubbedMethod(null),
	update: getStubbedMethod(null, {}),
	delete: getStubbedMethod(null),
	scan: getStubbedMethod(null, scanResult)
};

module.exports = {
	S3 : sinon.spy(),
	DynamoDB : {
		DocumentClient : sinon.stub().returns(documentClientStub)
	},
	getDocumentClientStub: () => documentClientStub
};

