var i=1;
(function schedule() {
console.log("i f1: " + i);
console.log('********************');
	setTimeout( function() { 
		console.log("i f2: " + i);
		console.log('async is done!');
		console.log('****************************************');
		schedule(++i);
	}, 2000 );
}());
