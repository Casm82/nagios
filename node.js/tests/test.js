var mongoose = require('mongoose');
var Reports = mongoose.model("Report");

				Reports.findByIdAndUpdate( docId, {avgTime: docValue}, 
					function (err, numberAffected) {
						if (err) return err;
						console.log('записано значений avgTime: %d', numberAffected);
					});

