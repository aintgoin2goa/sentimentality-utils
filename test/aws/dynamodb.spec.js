'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const AwsSdkStub = require('../stubs/aws-sdk.stub');

describe('Dynamodb Adaptor', function(){
	
	let dynamodb;
	
	before(() => {
		dynamodb = proxyquire('../../lib/aws/dynamodb', {'aws-sdk': AwsSdkStub});
	});
	
	it('Should be able to insert an item', () => {
		let table = 'table';
		let value = 'value';
		let expected = {
			TableName: table,
			Item: {
				uid: value,
				date_found: new Date().toString(),
				ingested: 0,
				analysed: 0
			},
			ConditionExpression: 'attribute_not_exists(uid)'
		};
		return dynamodb.insert(table, value)
			.then(() => {
				sinon.assert.called(AwsSdkStub.getDocumentClientStub().put);
				let data = AwsSdkStub.getDocumentClientStub().put.lastCall.args[0];
				expect(data).to.deep.equal(expected);
			})
		
	});

	it('Should be able to update an item', () => {
		let table = 'table';
		let uid = 'uid';
		let params = {'ingested' : 1};
		let expected = {
			TableName: table,
			Key: {
				"uid": uid
			},
			UpdateExpression: `SET ingested = :ingested`,
			ExpressionAttributeValues: {
				':ingested' : 1
			},
			ReturnValues:'UPDATED_NEW'
		};

		return dynamodb.update(table, uid, params)
			.then(() => {
				sinon.assert.called(AwsSdkStub.getDocumentClientStub().update);
				let arg = AwsSdkStub.getDocumentClientStub().update.lastCall.args[0];
				expect(arg).to.deep.equal(expected);
			})
	});

	it('Should be able to delete an item', () => {
		let table = 'table';
		let uid = 'uid';
		let expected = {
			TableName: table,
			Key: {
				uid: uid
			}
		};

		return dynamodb.delete(table, uid)
			.then(() => {
				sinon.assert.called(AwsSdkStub.getDocumentClientStub().delete);
				let arg = AwsSdkStub.getDocumentClientStub().delete.lastCall.args[0];
				expect(arg).to.deep.equal(expected);
			});
	});

	it('Should be able to find an item', () => {
		let table = 'table';
		let name = 'name';
		let value = 'value';
		let expected = {
			TableName : table,
			FilterExpression : `${name} = :val`,
			ExpressionAttributeValues : {':val' : value}
		};

		return dynamodb.find(table, name, value)
			.then(() => {
				sinon.assert.called(AwsSdkStub.getDocumentClientStub().scan);
				let arg = AwsSdkStub.getDocumentClientStub().scan.lastCall.args[0];
				expect(arg).to.deep.equal(expected);
			})
	})
	
});
