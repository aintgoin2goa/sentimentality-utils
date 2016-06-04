'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3({params: {Bucket: 'sentimentality-mail-content'}, region:'eu-west-1'});
const db = new AWS.DynamoDB.DocumentClient();

function insert(table, uid){
	console.log('INSERT ' + uid);
	return new Promise((resolve, reject) => {
		db.put({
			TableName: table,
			Item: {
				uid: uid,
				date_found: new Date().toString(),
				ingested: 0,
				analysed: 0
			},
			ConditionExpression: 'attribute_not_exists(uid)'
		}, (err) => {
			if(err){
				if(!/The conditional request failed/i.test(err.message)){
					console.log('INSERT_UID_ERROR ' + err.message);
					return reject(err);
				}else{
					console.log('UID_EXISTS ' + uid);
					return resolve(null);
				}
			}else{
				console.log('UID_INSERTED ' + uid);
			}

			resolve(uid);
		});
	})
}

function update(table, uid, props){
	let expressionParts = [];
	let attributes = {};
	Object.keys(props).forEach(key => {
		expressionParts.push(`${key} = :${key}`);
		attributes[':' + key] = props[key];
	});

	return new Promise((resolve, reject) =>
	{
		let params = {
			TableName: table,
			Key: {
				"uid": uid
			},
			UpdateExpression: `SET ${expressionParts.join(', ')}`,
			ExpressionAttributeValues: attributes,
			ReturnValues:'UPDATED_NEW'
		};
		console.log('UPDATE DB', params);
		db.update(params, (err, data) => {
			if(err){
				reject(err);
			}else{
				console.log('DB UPDATE SUCCEEDED', data);
				resolve();
			}
		});
	});
}


function del(table, uid){
	let params = {
		TableName: table,
		Key: {
			uid: uid
		}
	};
	return new Promise((resolve, reject) => {
		db.delete(params, (err) => {
			if(err){
				reject(err);
			}else{
				console.log('ITEM REMOVED', uid);
				resolve();
			}
		});
	});
}

function find(table, name, value){
	let params = {
		TableName : table,
		FilterExpression : `${name} = :val`,
		ExpressionAttributeValues : {':val' : value}
	};

	return new Promise((resolve, reject) => {
		db.scan(params, (err, data) => {
			if(err){
				return reject(err);
			}

			resolve(data.Items.map(i => i.uid));
		})
	})
}

module.exports = {insert, update, delete: del, find};

