// Получаем из БД отчёт по месяцу с минимальным временем доступности служб
var mongoose = require('mongoose');

function getIdleMonth(report) {
	console.log("getIdleMonth>> Ищем месяц с доступностью служб " + report);
};

module.exports = getIdleMonth;
