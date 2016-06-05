'use strict';
const AWS = require('aws-sdk');

function upload(bucket, uid, content){
	const s3 = new AWS.S3({params: {Bucket: bucket}, region:'eu-west-1'});
	console.log('S3 UPLOAD', uid);
	return new Promise((resolve, reject) => {
		s3.upload({
			Key: uid,
			Body: content,
			ACL: 'authenticated-read',
			ContentType: 'application/json',
			ContentEncoding: 'utf8'
		}, (err) => {
			if(err){
				return reject(err);
			}

			resolve({success:true});
		})
	});
}

module.exports = {upload};

