var fs = require("fs");
var report_file = "/tmp/Availability_Report_2014-01-24.csv";

fs.stat(report_file, function(err, stats) {
	if (err) { throw err };
	filesize = stats.size;
	console.log("File size: " + filesize);
});

fs.open(report_file, "r", function(err, fd) {
	if (err) { throw err };
	var readBuffer = new Buffer(filesize),
		bufferOffset = 0,
		bufferLegth = readBuffer.length,
		filePosition = 0;

	fs.read(fd,
			readBuffer,
			bufferOffset,
			bufferLegth,
			filePosition,
			function read(err, readBytes) {
				if (err) { throw err };
				// slice(0,-1) - удаляет пустую строку в конце файла
				var report_array = readBuffer.toString().split(";").slice(0,-1);

				// duration - первый элемент массива
				duration = Number(report_array.splice(0,1)[0]);
				// average - второй элемент массива
				average = report_array.splice(0,1)[0].split(",");
				
				// создаём объект отчёта
				var report = {
							duration: duration, 
							average:{	percent_up: average[0],
										percent_down: average[1],
										time_up: average[0] * duration,
										time_down: average[1] * duration
									},
							servers: {}
							};
				for(server_str in report_array) {
					var server_values = report_array[server_str].split(",");
					var server_name = server_values[0];
					var server_obj = {
						percent_up: server_values[1],	
						precent_down: server_values[2]
					}; 
					report.servers[server_name] = server_obj;
				};
				console.log(report);	
			});
	fs.close(fd);
});
