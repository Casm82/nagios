function my_async_function(callback) { callback(); }

(function schedule() {
setTimeout(function () { my_async_function(function() { console.log('async is done!'); schedule(); }); }, 1000); 
}());
