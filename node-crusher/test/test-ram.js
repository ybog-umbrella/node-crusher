var crusher = require('../');

crusher.eat_ram(1024);

console.log('before allocation: ', process.memoryUsage());
crusher.eat_ram(500);
console.log('after allocation: ', process.memoryUsage());

setTimeout(function () {
	crusher.release_ram();
	crusher.eat_ram(950);
	setTimeout(function () {
		crusher.release_ram();
		crusher.eat_ram(300);
		crusher.eat_cpu();
	}, 3 * 1000);
}, 3 * 1000);

