var refreshCount = 0

	, cPeriod = "INTRADAY" // intraday
	// 5Di - 5 days
	// 10D - 10 days
	// 1M - 1 monath
	// 3M - 3 monath
	// 6M - 6 monath
	// 1Y - 1 year
	// 3Y - 3 years
	// 10Y - 10 years
	
	, cType = "medium"
	
	, cId = "64730307"
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
	
	, cPrice_type = "last"
	
	, cPerformance_axis = "false"
	
	, cWith_earnings = "false"
	
	, cShow_legend = "true"
	
	, cSma1_days = "38"  // 38 days average
	, cSma1_color = "f62b8a"

	, cSma2_days = "200"  // 200 days average
	, cSma2_color = "333333"
	
	, cAbsolute_zoom = "true"
	
	, cWidth = "720"  // image width (360 default)

	, cHeight = "120"  // image height (120 default)
	
	, queryInterval = 10000;
	
document.addEventListener("click", function(evt) {
	document.getElementById("ta").value = "Du hast geclickt!!!";
}, false);

window.setTimeout(function(evt) {
	cPeriod = "INTRADAY";
	document.getElementById("chIntra").src=
		"https://boerse.dab-bank.de/dab-charts/charts/overview.htm?"
		+ "period=" + cPeriod
		+ "&type=" + cType
		+ "&id=" + cId
		+ "&chart.priceType=" + cPrice_type
		+ "&chart.performanceAxis=" + cPerformance_axis
		+ "&chart.withEarnings=" + cWith_earnings
		+ "&chart.showLegend=" + cShow_legend
		+ "&chart.sma1.days=" + cSma1_days
		+ "&chart.sma1.color=" + cSma1_color
		+ "&chart.sma2.days=" + cSma2_days
		+ "&chart.sma2.color=" + cSma2_color
		+ "&chart.absoluteZoom=" + cAbsolute_zoom
		+ "&height=" + cHeight
		+ "&width=" + cWidth;
	cPeriod = "5Di";
	document.getElementById("ch5").src=
		"https://boerse.dab-bank.de/dab-charts/charts/overview.htm?"
		+ "period=" + cPeriod
		+ "&type=" + cType
		+ "&id=" + cId
		+ "&chart.priceType=" + cPrice_type
		+ "&chart.performanceAxis=" + cPerformance_axis
		+ "&chart.withEarnings=" + cWith_earnings
		+ "&chart.showLegend=" + cShow_legend
		+ "&chart.sma1.days=" + cSma1_days
		+ "&chart.sma1.color=" + cSma1_color
		+ "&chart.sma2.days=" + cSma2_days
		+ "&chart.sma2.color=" + cSma2_color
		+ "&chart.absoluteZoom=" + cAbsolute_zoom
		+ "&height=" + cHeight
		+ "&width=" + cWidth;
}, 0);

window.setInterval(function () {
	document.getElementById("chIntra").src="";
	document.getElementById("ch5").src="";
	cPeriod = "INTRADAY";
	document.getElementById("chIntra").src=
		"https://boerse.dab-bank.de/dab-charts/charts/overview.htm?"
		+ "period=" + cPeriod
		+ "&type=" + cType
		+ "&id=" + cId
		+ "&chart.priceType=" + cPrice_type
		+ "&chart.performanceAxis=" + cPerformance_axis
		+ "&chart.withEarnings=" + cWith_earnings
		+ "&chart.showLegend=" + cShow_legend
		+ "&chart.sma1.days=" + cSma1_days
		+ "&chart.sma1.color=" + cSma1_color
		+ "&chart.sma2.days=" + cSma2_days
		+ "&chart.sma2.color=" + cSma2_color
		+ "&chart.absoluteZoom=" + cAbsolute_zoom
		+ "&height=" + cHeight
		+ "&width=" + cWidth;
	cPeriod = "5Di";
	document.getElementById("ch5").src=
		"https://boerse.dab-bank.de/dab-charts/charts/overview.htm?"
		+ "period=" + cPeriod
		+ "&type=" + cType
		+ "&id=" + cId
		+ "&chart.priceType=" + cPrice_type
		+ "&chart.performanceAxis=" + cPerformance_axis
		+ "&chart.withEarnings=" + cWith_earnings
		+ "&chart.showLegend=" + cShow_legend
		+ "&chart.sma1.days=" + cSma1_days
		+ "&chart.sma1.color=" + cSma1_color
		+ "&chart.sma2.days=" + cSma2_days
		+ "&chart.sma2.color=" + cSma2_color
		+ "&chart.absoluteZoom=" + cAbsolute_zoom
		+ "&height=" + cHeight
		+ "&width=" + cWidth;
	refreshCount++;
	document.getElementById("rc").innerText = "" + refreshCount + " iterations.";
}, queryInterval);