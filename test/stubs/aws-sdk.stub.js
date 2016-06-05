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

const s3Stub = {
	upload: getStubbedMethod(null),
	getObject: getStubbedMethod(null, {Body: {toString: () => '{"foo":"bar"}'}})
};

module.exports = {
	S3 : sinon.stub().returns(s3Stub),
	DynamoDB : {
		DocumentClient : sinon.stub().returns(documentClientStub)
	},
	getDocumentClientStub: () => documentClientStub,
	getS3Stub: () => s3Stub
};

