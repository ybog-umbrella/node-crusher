var Buffer = require('buffer').Buffer;
var path = require('path');
var mname = module.filename.slice(__filename.lastIndexOf(path.sep) + 1, module.filename.length - 3);

var MAX_BUF_SIZE_MB = 1023; //https://github.com/v8/v8/blob/c8bf5c35e431d4029e084024501863a4cf907882/src/objects.h#L4647-L4648
var stop_eating_cpu = false;
var buffer;
var crusher = module.exports = exports;

process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1.5));


process.on('exit', function () {
	console.log(mname + ' exiting ...');
	crusher.release_ram();
	crusher.stop_cpu();
});


//bufferSize[MB]
exports.eat_ram = function (bufferSize) {
	//IDEAS
	//* param: array with time offsets and how much ram usage should increase at every time step
	//* param: nTH call of 'eat_ram', add addtional buffer or replace current/latest
	this.release_ram(); //release reference otherwise second call would increase used ram
	
	console.log(mname + ': allocating total of ' + bufferSize + ' MB (max buffer: ' + MAX_BUF_SIZE_MB + ' MB)');
	try {
		if (bufferSize <= MAX_BUF_SIZE_MB) {
			buffer = [];
			buffer[0] = new Buffer(bufferSize * 1024 * 1024);
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
				buffer[i] = new Buffer(toAllocate * 1024 * 1024);
				buffer[i].fill('X');
			}
		}
	}
	catch (e) {
		console.log(mname + ' ERROR ', e);
	}
};


exports.release_ram = function () {
	if (buffer) {
		buffer.forEach(function (b) {
			console.log(mname + ': releasing allocation reference...');
			b = null;
		});
		buffer = null;
	} else {
		console.log(mname + ': no ram allocated');
	}
};

var running = 0;
var limit = 6;

exports.eat_cpu = function () {
	
	while (running < limit && false === stop_eating_cpu) {
		//console.log(mname + ': before fib', running);
		console.log(mname + ': calc start, calcs running', running);
		fibonacciAsync(43, running, function (res) {
			console.log(mname + ': calc finished, calcs running', running);
			running--;
			if (running <= limit) {
				crusher.eat_cpu();
			}
		});
		running++;
	}
};


exports.stop_cpu = function () {
	console.log(mname + ': cpu stop signal received');
	stop_eating_cpu = true;
}


function fibonacciAsync(n, i, done) {
	//console.log(mname + ': stop_eating_cpu ' + i, stop_eating_cpu);
	if (-1 === i || true === stop_eating_cpu) {
		//console.log(mname + ': stop_eating_cpu ' + i);
		done(-1);
	} else {
		
		if (n == 1 || n == 2) {
			done(1);
		}
		else {
			setImmediate(function () {
				fibonacciAsync(n - 1, i , function (val1) {
					setImmediate(function () {
						fibonacciAsync(n - 2, i, function (val2) {
							done(val1 + val2);
						});
					});
				});
			});
		}
	}
}

function fibonacci(n) {
	if (true === stop_eating_cpu) { return 1; }
	
	if (n < 2) {
		return 1;
	} else {
		return fibonacci(n - 2) + fibonacci(n - 1);
	}
}