var
	vows = require('vows'),
	assert = require('assert'),
	EC2Metadata = require('../lib/ec2metadata');

vows.describe('ec2metadata').addBatch({
	'When we call EC2Metadata.get only with the callback parameter': {
		topic: function(){
			EC2Metadata.get(this.callback);
		},
		'error should be null': function(err, data){
			assert.isNull(err);
		},
		'data should be an array': function(err, data){
			assert.isArray(data);
		}
	}
}).addBatch({
	'When we call EC2Metadata.get with a valid fieldname ending with a slash': {
		topic: function(){
			EC2Metadata.get(['block-device-mapping/'], this.callback);
		},
		'error should be null': function(err, data){
			assert.isNull(err);
		},
		'data should be an Object': function(err, data){
			assert.isObject(data);
		},
		'the property of data should be an array': function(err, data){
			assert.isArray(data.blockDeviceMapping);
		}
	}
}).addBatch({
	'When we call EC2Metadata.get with a wrong field as parameter': {
		topic: function(){
			EC2Metadata.get(['wrong-metadata'], this.callback);
		},
		'error should not be null': function(err, data){
			assert.isNotNull(err);
		},
		'error should match the "Request for field: [fieldname] returned" messgae': function(err, data){
			assert.match(err.message, /^Request for field: (.+) returned/);
		},
		'data should be undefined': function(err, data){
			assert.isUndefined(data);
		}
	}
}).addBatch({
	'When we call EC2Metadata.get with multiple fields': {
		topic: function(){
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'public-keys/0/'], this.callback);
		},
		'error should be null': function(err, data){
			assert.isNull(err);
		},
		'data should be an Object': function(err, data){
			assert.isObject(data);
		},
		'data should have predicted properties': function(err, data){
			assert.include(data, 'publicHostname');
			assert.include(data, 'localIpv4');
			assert.include(data, 'publicKeys0');
		},
		'data properties should match types': function(err, data){
			assert.isString(data.publicHostname);
			assert.isString(data.localIpv4);
			assert.isArray(data.publicKeys0);
		}
	}
}).addBatch({
	'When we call EC2Metadata.get with a dieldname missing an ending slash': {
		topic: function(){
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'public-keys/0'], this.callback);
		},
		'error should be not null': function(err, data){
			assert.isNotNull(err);
		},
		'error should match the "Request for field: [fieldname] returned ..." messgae': function(err, data){
			assert.match(err.message, /^Request for field: (.+) returned/);
		},
		'data should be undefined': function(err, data){
			assert.isUndefined(data);
		}
	}
}).addBatch({
	'When we call EC2Metadata.get with multiple fields (one of them wrong)': {
		topic: function(){
			EC2Metadata.get(['public-hostname', 'local-ipv4(wrong!)', 'instance-id'], this.callback);
		},
		'error should be not null': function(err, data){
			assert.isNotNull(err);
		},
		'error should match the "Request for field: [fieldname] returned ..." messgae': function(err, data){
			assert.match(err.message, /^Request for field: (.+) returned/);
		},
		'data should be undefined': function(err, data){
			assert.isUndefined(data);
		}
	}
}).addBatch({
	'When we try a DOS attack to aws API :)': {
		topic: function(){
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id', 'public-keys/0/', 'public-hostname', 'local-ipv4(wrong!)', 'instance-id', 'public-keys/0/'], this.callback);
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id', 'public-keys/0/', 'public-hostname', 'local-ipv4(wrong!)', 'instance-id', 'public-keys/0/'], this.callback);
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id', 'public-keys/0/', 'public-hostname', 'local-ipv4(wrong!)', 'instance-id', 'public-keys/0/'], this.callback);
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id', 'public-keys/0/', 'public-hostname', 'local-ipv4(wrong!)', 'instance-id', 'public-keys/0/'], this.callback);
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id', 'public-keys/0/', 'public-hostname', 'local-ipv4(wrong!)', 'instance-id', 'public-keys/0/'], this.callback);
			EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id', 'public-keys/0/', 'public-hostname', 'local-ipv4(wrong!)', 'instance-id', 'public-keys/0/'], this.callback);
		},
		'error should be not null': function(err, data){
			assert.isNotNull(err);
		},
		'error should match the "Parse Error" messgae': function(err, data){
			assert.match(err.message, /^Parse Error/);
		},
		'data should be undefined': function(err, data){
			assert.isUndefined(data);
		},
	}
}).export(module);