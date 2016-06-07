'use strict';
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const CREDS = new AWS.EnvironmentCredentials('AWS');

const ES_HOST = 'search-sentimentality-4ov3nf6o7h7vbdqbky7csi53zu.eu-west-1.es.amazonaws.com';
const INDEX_NAME = 'refugees';
const util = require('util');

function elasticSearchBody(results){
	let lines = [];
	results.forEach(result => {
		lines.push(JSON.stringify({index: {_id: result.uid}}));
		lines.push(JSON.stringify(result));
	});
	lines.push('\n');
	return lines.join('\n');
}

function sendData(publication, data){
	let url = `https://${ES_HOST}/${INDEX_NAME}/${publication}/_bulk`;
	let opts = {
		method: 'POST',
		body:elasticSearchBody(data)
	};
	console.log('ES REQUEST', url, util.inspect(opts, {depth:null}));
	let result = [];
	return fetch(url, opts, CREDS)
		.then(response => {
			if(!response.ok){
				let err = new Error(`Bad Response from ElasticSearch: ${response.status} ${response.statusText}`);
				err.name = 'BAD_ES_RESPONSE';
				err.status = response.status;
				result[0] = 'ERROR';
				result[1] = err;
			}else{
				result[0] = 'SUCCESS';
			}

			return response.json();
		})
		.then(json => {
			result[1] = json;
			return result;
		});
}

module.exports = { sendData };
