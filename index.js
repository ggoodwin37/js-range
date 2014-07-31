var jsRange = require('./js-range.js');

main();

function main() {
	var testNum = 0;
	var range = new jsRange();

	range.trackRange(10, 100);
	test(++testNum, range.queryRange(50, 51), true);

	range.deleteRange(20, 30);
	test(++testNum, range.queryRange(10, 20), true);
	test(++testNum, range.queryRange(10, 21), false);
	test(++testNum, range.queryRange(10, 25), false);
	test(++testNum, range.queryRange(30, 40), true);

	range.deleteRange(50, 70);
	test(++testNum, range.queryRange(30, 50), true);
	test(++testNum, range.queryRange(30, 51), false);
	test(++testNum, range.queryRange(29, 50), false);

	range.trackRange(25, 60);
	test(++testNum, range.queryRange(25, 60), true);
	test(++testNum, range.queryRange(50, 61), false);

	range.deleteRange(55, 65);
	test(++testNum, range.queryRange(25, 55), true);
	test(++testNum, range.queryRange(50, 60), false);
	test(++testNum, range.queryRange(50, 55), true);
	test(++testNum, range.queryRange(60, 70), false);
	
	range.deleteRange(11, 99);
	test(++testNum, range.queryRange(10, 11), true);
	test(++testNum, range.queryRange(99, 100), true);
	test(++testNum, range.queryRange(9, 11), false);
	test(++testNum, range.queryRange(98, 100), false);

	range.clear();
	range.trackRange(20, 40);
	range.trackRange(50, 70);
	range.trackRange(80, 100);
	range.deleteRange(30, 90);
	test(++testNum, range.list.length, 4);

	range.clear();

	range.trackRange(10, 50);
	test(++testNum, range.list.length, 2);
	range.trackRange(30, 60);
	test(++testNum, range.list.length, 2);
	range.trackRange(60, 70);
	test(++testNum, range.list.length, 2);
	range.trackRange(80, 90);
	test(++testNum, range.list.length, 4);
	range.trackRange(85, 100);
	test(++testNum, range.list.length, 4);
	range.deleteRange(20, 30);
	test(++testNum, range.list.length, 6);
	range.deleteRange(60, 80);
	test(++testNum, range.list.length, 6);
	range.deleteRange(25, 40);
	test(++testNum, range.list.length, 6);
	range.deleteRange(85, 95);
	test(++testNum, range.list.length, 8);
}

function test(msg, expected, actual) {
	console.log(('' + msg) + ': ' + (expected === actual ? 'ok' : 'NOPE'));
}

