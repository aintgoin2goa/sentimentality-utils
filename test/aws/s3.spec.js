'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const awsSdkStub = require('../stubs/aws-sdk.stub');

describe('s3 Adaptor', function(){
	
	let s3;
	
	before(() => {
		s3 = proxyquire('../../lib/aws/s3', {'aws-sdk' : awsSdkStub});
	});

	it('Should be able to save content to a bucket', () => {
		let bucket = 'bucket';
		let uid = 'uid';
		let content = 'content';
		let expected = {
			Key: uid,
			Body: content,
			ACL: 'authenticated-read',
			ContentType: 'application/json',
			ContentEncoding: 'utf8'
		};
		return s3.upload(bucket, uid, content)
			.then(() => {
				sinon.assert.called(awsSdkStub.getS3Stub().upload);
				let arg = awsSdkStub.getS3Stub().upload.lastCall.args[0];
				expect(arg).to.deep.equal(expected);
			});
	});

});
