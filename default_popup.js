var refreshCount = 0

	, optObj = { url: "https://boerse.dab-bank.de/dab-charts/charts/overview.htm"
		, cPeriod: "INTRADAY" // intraday
		// 5Di - 5 days
		// 10D - 10 days
		// 1M - 1 monath
		// 3M - 3 monath
		// 6M - 6 monath
		// 1Y - 1 year
		// 3Y - 3 years
		// 10Y - 10 years
		
		, cType: "medium"
		
		, cId: "64730307"
		// 36534013 - Focus Graphite by TSX Venture
		// 64730307 - Focus Graphite by Tradegate
		// 41380918 - Focus Graphite by NASDAQ other OTC
		
		// 12233732 - Nordex by Lange & Schwarz
		// 11600665 - Nordex by Tradegate
		// 11579303 - Nordex by Xetra
		// 34345936 - Nordex by London Stock Exchange
		
		// 3240541 - Siemens by DAB Best Price
		// 1929749 - Siemens by Xetra
		// 9385813 - Siemens by Tradegate
		// 21815   - Siemens by Stuttgart
		// 32421997- Siemens by London Stock Exchange
		// 164188  - Siemens by NYSE Euronext Amsterdam
		
		// 84284360 - Osram by Xetra
		// 84205288 - Osram by DAB Best Price
		// 84415971 - Osram by Tradegate
		// 84769069 - Osram by London Stock Exchange
		// 84416339 - Osram by Stuttgart
		
		, cPrice_type: "last"
		
		, cPerformance_axis: "false"
		
		, cWith_earnings: "false"
		
		, cShow_legend: "true"
		
		, cSma1_days: "38"  // 38 days average
		, cSma1_color: "f62b8a"
	
		, cSma2_days: "200"  // 200 days average
		, cSma2_color: "333333"
		
		, cAbsolute_zoom: "true"
		
		, cWidth: "720"  // image width (360 default)
	
		, cHeight: "120"  // image height (120 default)
	}
	, queryInterval = 10000;
	
document.addEventListener("click", function(evt) {
	document.getElementById("ta").value = "Du hast geclickt!!!";
}, false);

window.setTimeout(function(evt) {
	optObj.cPeriod = "INTRADAY";
	document.getElementById("chIntra").src = buildURL(optObj);
	optObj.cPeriod = "5Di";
	document.getElementById("ch5").src = buildURL(optObj);
}, 0);

window.setInterval(function () {
	document.getElementById("chIntra").src="";
	document.getElementById("ch5").src="";
	optObj.cPeriod = "INTRADAY";
	document.getElementById("chIntra").src = buildURL(optObj);
	optObj.cPeriod = "5Di";
	document.getElementById("ch5").src = buildURL(optObj);
	refreshCount++;
	document.getElementById("rc").innerText = "" + refreshCount + " iterations.";
}, queryInterval);

function buildURL(opt) {
	if (!opt) {
		return "";
	}
	var url = opt.url + "?"
		+ "period=" + opt.cPeriod
		+ "&type=" + opt.cType
		+ "&id=" + opt.cId
		+ "&chart.priceType=" + opt.cPrice_type
		+ "&chart.performanceAxis=" + opt.cPerformance_axis
		+ "&chart.withEarnings=" + opt.cWith_earnings
		+ "&chart.showLegend=" + opt.cShow_legend
		+ "&chart.sma1.days=" + opt.cSma1_days
		+ "&chart.sma1.color=" + opt.cSma1_color
		+ "&chart.sma2.days=" + opt.cSma2_days
		+ "&chart.sma2.color=" + opt.cSma2_color
		+ "&chart.absoluteZoom=" + opt.cAbsolute_zoom
		+ "&height=" + opt.cHeight
		+ "&width=" + opt.cWidth;
	return url;
}