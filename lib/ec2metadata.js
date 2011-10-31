var
	http = require('http'),
	FnQueue = require('fnqueue');

module.exports = {

	get: function(){

		var args = Array.prototype.slice.call(arguments);
		var callback = args.pop();
		var what = args.pop();

		if(typeof what === 'string'){
			what = [what];
		}
		else if(what === undefined){
			callback && get('', 500, callback);
			return;
		}

		var awsMetadataFnQueueObj = {};

		for(var i = 0; i < what.length; i++)
			awsMetadataFnQueueObj[what[i].replace(/((\-|\/)[a-z]?)/g, function(match){ return match[1] ? match[1].toUpperCase() : ''; })] = get.bind(null, what[i], 1000);

		new FnQueue(awsMetadataFnQueueObj, function(err, data){

			if(err){
				callback && callback(err);
				return;
			}

			callback && callback(null, data);
		}, 1);
	}
};

function get(what, maxTime, callback){

	var timeoutId = setTimeout(function(){
		callback(new Error('EC2 metadata api request timed out.'));
	}, maxTime);

	var request = http.get({
		host: '169.254.169.254',
		port: 80,
		path: '/latest/meta-data/' + what
	}, function(response){

		clearTimeout(timeoutId);

		if(response.statusCode !== 200){
			callback(new Error('Request for field: ' + what + ' returned ' + response.statusCode + ' ' + http.STATUS_CODES[response.statusCode]), 'ciao');
			return;
		}

		response.once('data', function(data){
			if(data instanceof Buffer){
				data = data.toString('utf8');
				if(/\/$/.test(what) || what === '')
					data = data.split('\n');
			}
			callback(null, data);
		});
	});

	request.once('error', function(err){
		clearTimeout(timeoutId);
		callback(err);
	});
}