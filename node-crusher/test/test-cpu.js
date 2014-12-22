var crusher = require('../');
var path = require('path');
var mname = module.filename.slice(__filename.lastIndexOf(path.sep) + 1, module.filename.length - 3);

crusher.eat_cpu();

setTimeout(function () {
	console.log(mname + ': about to stop cpu');
	crusher.stop_cpu();
}, 15 * 1000);