buf = require('buffer').Buffer;
var path = require('path');
var mname = module.filename.slice(__filename.lastIndexOf(path.sep) + 1, module.filename.length - 3);

var MAX_BUF_SIZE_MB = 1023;
var stop_eating_cpu = false;
var buffer;
var crusher = module.exports = exports;


process.on('exit', function () {
	console.log(mname + ' exiting ...');
	crusher.release_ram();
});


//bufferSize[MB]
exports.eat_ram = function (bufferSize) {
	//IDEAS
	//* param: array with time offsets and how much ram usage should increase at every time step
	//* param: nTH call of 'eat_ram', add addtional buffer or replace current/latest
	this.release_ram(); //release reference otherwise second call would increase used ram

	console.log(mname + ': allocating total of ' + bufferSize + ' MB (max buffer: ' + MAX_BUF_SIZE_MB + ' MB)');
	if (bufferSize <= MAX_BUF_SIZE_MB) {
		buffer = [];
		buffer[0] = new buf(bufferSize * 1024 * 1024);
		buffer[0].fill('X');
	} else {
		buffer = [];
		var bufCnt = Math.floor(bufferSize / MAX_BUF_SIZE_MB) + 1;
		console.log('bufCnt', bufCnt);
		for (var i = 0; i < bufCnt; i++) {
			var toAllocate = MAX_BUF_SIZE_MB;
			if (0 === i) {
				toAllocate = bufferSize % MAX_BUF_SIZE_MB
			}
			console.log(mname + ' allocating ' + toAllocate);
			buffer[i] = new buf(toAllocate * 1024 * 1024);
			buffer[i].fill('X');
		}
	}
};


exports.release_ram = function () {
	if (buffer) {
		console.log(mname + ': releasing allocation reference...');
		buffer.forEach(function (b) {
			b = null;
		});
		buffer = null;
	} else {
		console.log(mname + ': nothing allocated');
	}
};


exports.eat_cpu = function (callback) {
	//process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1.5));
	stop_eating_cpu = false;
	console.log(mname + ': eating cpu');
	while (true !== stop_eating_cpu) {
		fibonacci(43);
	}
	console.log(mname + ': eating cpu stopped');
	callback(null, 'eating cpu stopped');
};


exports.stop_cpu = function (){
	stop_eating_cpu = true;
}

function fibonacci(n) {
	if (true === stop_eating_cpu) {
		return 1;
	}
	if (n < 2) {
		return 1;
	} else {
		return fibonacci(n - 2) + fibonacci(n - 1);
	}
}