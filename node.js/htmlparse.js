var xpath = require('xpath'),
	dom = require('xmldom').DOMParser;

// Функция парсинга html страницы и сохранения отчёта в MongoDB
function htmlparse (body, url, quarter, year) {
	var doc = new dom().parseFromString(body);
	
	// Отпределяем диапозон отчёта вида: "01-01-2013 00:00:00 to 01-31-2013 23:59:59"
	var htmlRange = 
		xpath.select("/html/body/table[1]/tr/td/div[@class='reportRange']", doc)[0].firstChild.nodeValue.replace(/\n/, " ");
	var report_month = Number(htmlRange.split("-", 1));

	// Определяем продолжительность отчёта в виде "Duration: 28d 20h 11m 10s"
	var htmlduration = 
		xpath.select("/html/body/table[1]/tr/td/div[@class='reportDuration']", doc)[0].firstChild.nodeValue.replace(/\n/, " ");

	// Разбиваем по пробелам на массив
	var duration = htmlduration.split(" ");
	duration.shift(); // Убираем "Duration:"
	
	// Убираем буквы из массива и преобразуем в числовой тип
	for (var i in duration) { duration[i] = Number(duration[i].replace(/\D/g, "")) };

	// Вычисляем продолжительность в секундах
	var duration_sec = duration[0]*60*60*24 + duration[1]*60*60 + duration[2]*60 + duration[3];

	var htmlobj = {	"date": { month: report_month,
							  quarter: quarter,
							  year: year },
					"url"	: url,
					"report": [],
					"title"	: xpath.select("//title/text()", doc)[0].nodeValue,
					"duration": duration_sec };

	var tablecontent = (xpath.select("/html/body/div/table[2]", doc)[0].childNodes);

	for (tr in tablecontent) {
	// tr - номер строки в таблице, включая \n
	
		if ( 
			// Если элемент ячейка (td) и есть потомки, значит имя хоста указано
			(tablecontent[tr].childNodes) &&
			(tablecontent[tr].childNodes[1].nodeName == 'td') &&
			// Проверка на наличие имени сервиса
			(tablecontent[tr].childNodes[3].firstChild) &&
			(tablecontent[tr].childNodes[3].firstChild.firstChild)
		   ) {

			// Создаём сервис
			var service = { 
				servicename:
					tablecontent[tr].childNodes[3].firstChild.firstChild.nodeValue.replace(/\n/, ""),
				timeOK: 
					Number(tablecontent[tr].childNodes[5].firstChild.nodeValue.replace(/%(.*)/, "")),
				timeWarning: 
					Number(tablecontent[tr].childNodes[7].firstChild.nodeValue.replace(/%(.*)/, "")),
				timeUnknown: 
					Number(tablecontent[tr].childNodes[9].firstChild.nodeValue.replace(/%(.*)/, "")),
				timeCritical: 
					Number(tablecontent[tr].childNodes[11].firstChild.nodeValue.replace(/%(.*)/, "")),
				timeUndetermined: 
					Number(tablecontent[tr].childNodes[13].firstChild.nodeValue.replace(/%(.*)/, ""))
				};

			if ( 
				// Если есть ячейка с именем хоста, то вычисляем имя	
				(tablecontent[tr].childNodes[1].firstChild) && 
				(tablecontent[tr].childNodes[1].firstChild.nodeValue != 'Average') &&
				(tablecontent[tr].childNodes[1].firstChild.firstChild)
			  ) 
			{ 
				var hostvalue = tablecontent[tr].childNodes[1].firstChild.firstChild.nodeValue.replace(/\n/g, "") 
			} else {
			// Если нет имени, то указываем null и после добавляем к предыдущему объекту отчёта
				var hostvalue = null;
			};

//			console.log(tablecontent[tr]); 
			// Добавляем объект в отчёт если есть имя хоста (1) или имя сервиса (3)
		
			// Если указано имя хоста, помещаем объект состояния служб хоста в отчёт
			if (hostvalue) {
				
				// Создаём массив сервисов хоста
				var hostservices = [];
				// Создаём объект состояния служб хоста и помещаем его в отчёт
				hostservices.push(service);
				
				var server = { host: hostvalue, services: hostservices };
				htmlobj.report.push(server);
			} else {
			// Если нет, то отыскиваем предыдущий сервер и добавляем отчёт по службе в него
				var reportlength = htmlobj.report.length;
				htmlobj.report[reportlength - 1].services.push(service);
			}
		}
	}
return htmlobj;
}

module.exports = htmlparse;
