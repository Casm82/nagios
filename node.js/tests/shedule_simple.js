(function schedule() {
	setTimeout( function () { (function() { console.log('async is done!'); schedule(); })(); }, 1000 );
}());
