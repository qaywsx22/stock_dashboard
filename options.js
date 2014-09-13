var oReq;

document.addEventListener("readystatechange", function () {
	if (document.readyState ==="complete") {
		document.getElementById("sb").addEventListener("click", sbOnClick);
    }
});

function sbOnClick(evt) {
	document.getElementById("resp").value = "";
	var params, stock = document.getElementById("ss").value;
	if (stock) {
		stock = stock.trim();
		if (stock != "") {
//			alert("Value "+stock+" found.");
			params="SEARCH_VALUE="+stock;
			console.log("params="+params);
			if (oReq == null) {
				oReq = new XMLHttpRequest();
				oReq.onload = reqListener;
			}
			oReq.open("post", "https://boerse.dab-bank.de/maerkte-kurse/schnellsuche.html");
			oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//			oReq.setRequestHeader("Content-length", params.length);
//			oReq.setRequestHeader("Connection", "close");
			oReq.send(params);
		}
	}
}

function reqListener () {
//	console.log(this.responseText);
	document.getElementById("resp").value = this.responseText;
}
