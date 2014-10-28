var options, startTime, queryInterval = 1000;

document.addEventListener("readystatechange", function () {
	var tmp, el, optObj;
	if (document.readyState ==="complete") {
		loadOptions();
		if (!!options) {
			for (i=0; i<options.length; i++) {
				optObj = options[i];
				el = document.createElement("img");
				el.src = buildURL(optObj);
				document.body.appendChild(el);
				document.body.appendChild(document.createElement("br"));
				el = document.createElement("label");
				document.body.appendChild(el);
				el.style.marginRight = "30px";
				el.innerText = optObj.sName;
				el = document.createElement("label");
				document.body.appendChild(el);
				el.style.marginRight = "30px";
				el.innerText = optObj.seName;
				el = document.createElement("label");
				document.body.appendChild(el);
				el.style.marginRight = "30px";
				el.innerText = optObj.cPeriod;
				document.body.appendChild(document.createElement("br"));
			}
			startTime = Date.now();
			el = document.createElement("label");
			el.id = "elapsed";
			document.body.appendChild(el);
			el.style.marginRight = "30px";
			tmp = Date.now() - startTime;
			el.innerText = "Observing time " + formatTimeSpan(tmp);
			document.body.appendChild(document.createElement("br"));
		}
		window.setInterval(function () {
			var el, tmp, i, img, imgs = document.getElementsByTagName("img");
			for (i=0; i< imgs.length; i++) {
				img = imgs.item(i);
				tmp = img.src;
				img.src = "";
				img.src = tmp;
			}
			var el = document.getElementById("elapsed");
			tmp = Date.now() - startTime;
			el.innerText = "Observing time " + formatTimeSpan(tmp);
		}, queryInterval);
    }
});

function formatTimeSpan(diff) {
	if (!diff) {
		return "0 h 0 min";
	}
	var s = Math.floor(diff / 1000);
	var m = Math.floor(s / 60);
	var h = Math.floor(s / 3600);
	return ("" + h + " h " + m + " min");
}

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

function loadOptions() {
	var str = localStorage.getItem("DACharts.options");
	options = null;
	if (str !== "undefined") {
		options = JSON.parse(localStorage.getItem("DACharts.options"));
	}
}
