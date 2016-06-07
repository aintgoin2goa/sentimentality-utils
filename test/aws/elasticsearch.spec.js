'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const fetchStub = require('../stubs/fetch.stub');

describe('Elastic Search Adaptor', () =>{
	
	let elasticsearch;
	
	before(() => {
		fetchStub.setup({});
		elasticsearch = proxyquire('../../lib/aws/elasticsearch', {'node-fetch': fetchStub.fetch});
	});

	it('Should be able to send data to elastic search', () => {
		let publication = 'publication';
		let data = [{uid:'uid', foo:'bar'}];
		elasticsearch.sendData(publication, data)
			.then(() => {
				sinon.assert.called(fetchStub.fetch);
				let url = fetchStub.fetch.lastCall.args[0];
				let options = fetchStub.fetch.lastCall.args[1];
				expect(url).to.contain(publication);
				expect(url).to.contain('es.amazonaws.com');
				expect(url).to.contain('_bulk');
				expect(options.body).to.contain(JSON.stringify(data));
			})
	});
});
