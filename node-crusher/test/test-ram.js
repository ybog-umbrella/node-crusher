var crusher = require('../');
var path = require('path');
var mname = module.filename.slice(__filename.lastIndexOf(path.sep) + 1, module.filename.length - 3);

crusher.eat_ram(1023);
crusher.eat_ram(1025);

setTimeout(function () {
	crusher.eat_ram(2500);
	setTimeout(function () {
		crusher.eat_ram(300);
		console.log(mname + ': about to start cpu');
		crusher.eat_cpu(function (err, msg) { console.log(mname + ': ' + msg); });
		console.log(mname + ': started cpu');
		setTimeout(function () {
			console.log(mname + ': about to stop cpu');
			crusher.stop_cpu();
			console.log(mname + ': finished');
		}, 3 * 1000);
	}, 3 * 1000);
}, 3 * 1000);

