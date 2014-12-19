buf = require('buffer').Buffer;


var buffer;
var crusher = module.exports = exports;


process.on('exit', function () {
	if (buffer) {
		buffer = null;
	}
});


//bufferSize[MB]
exports.eat_ram = function (bufferSize) {
	if (bufferSize > 1023) {
		console.log(bufferSize + ' is too big. for now ...');
		return;
	}
	//TODO
	//* array of buffers: MaxBufferSize=~1GB 0x3fffffff=1023MB: https://github.com/v8/v8/blob/c8bf5c35e431d4029e084024501863a4cf907882/src/objects.h#L4647-L4648
	//* release allocation? how implement with array?
	//IDEAS
	//* param: array with time offsets and how much ram usage should increase at every time step
	//* param: nTH call of 'eat_ram', add addtional buffer or replace current/latest
	console.log('allocating ' + bufferSize + 'MB');
	buffer = null; //release reference otherwise second call would increase used ram
	buffer = new buf(bufferSize * 1024 * 1024);
	buffer.fill('X');
};


exports.release_ram = function () {
	if (buffer) {
		console.log('releasing allocation reference...');
		buffer = null;
	} else {
		console.log('nothing allocated');
	}
};


exports.eat_cpu = function () {
	//process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1.5));
	fibonacci(43);
};

function fibonacci(n) {
	if (n < 2) {
		return 1;
	} else {
		return fibonacci(n - 2) + fibonacci(n - 1);
	}
}