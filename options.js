var oReq, data;

document.addEventListener("readystatechange", function () {
	if (document.readyState ==="complete") {
		document.getElementById("sb").addEventListener("click", sbOnClick);
		document.getElementById("ss").addEventListener("keydown", ssOnKeyDown);
    }
});

function sbOnClick(evt) {
	searchStock();
}

function ssOnKeyDown(evt) {
	if (evt.keyCode === 13) {
		searchStock();
	}
}

function searchStock() {
	document.getElementById("resp").value = "";
	var params, stock = document.getElementById("ss").value;
	if (stock) {
		stock = stock.trim();
		if (stock != "") {
//			alert("Value "+stock+" found.");
			params="searchValue="+stock;
			params+="&offset=0&blocksize=20&sort=&sortDir=&sortField=&idCategory=";
			console.log("params="+params);
			if (oReq == null) {
				oReq = new XMLHttpRequest();
			}
			oReq.onload = reqListener;
			oReq.open("post", "https://boerse.dab-bank.de/maerkte-kurse/ajax/stocks/search/results.html");
			oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//			oReq.setRequestHeader("Content-length", params.length);
//			oReq.setRequestHeader("Connection", "close");
			oReq.send(params);
		}
	}
	else {
		document.getElementById("resp").value = "Empty search, nothing found";
		document.querySelector("#resList").innerHTML = "";
	}
}

function reqListener () {
//	console.log(this.responseText);
	var sc, list, div, table = getElement(this.responseText, "table#instrument"),
		list = document.querySelector("#resList"),
		selEx = document.querySelector("#exchangeSelect");
	list.innerHTML = "";
	selEx.innerHTML = "";
	if (table != null) {
		div = document.createElement("div");
		div.appendChild(table);
		document.getElementById("resp").value = div.innerHTML;
		data = extractStockData(div);
//		list = document.querySelector("#resList");
		sc = document.getElementById("ss");
		list = createPopupResultList(sc);
		fillResultList(data, list);
	}
	else {
		alert("Result table not found");
	}
}

function fragmentFromString(strHTML) {
    var temp = document.createElement('template');
    temp.innerHTML = strHTML;
    return temp.content;
}

function extractStockData(div) {
	var indName, indISIN,
		rows, col, row,
		temp, frag, i, c, text,
		wkn, isin, detLink;
	var nData = new Array();
	frag = fragmentFromString(div.innerHTML);
	row = frag.querySelector("thead tr");
	if (!row) {
		return null;
	}
	for (i=0; i < row.cells.length; i++) {
		text = row.cells.item(i).innerText.trim();
		if (text) {
			if (text.toLowerCase() === "name") {
				indName = i;
			}
			else if (text.toLowerCase().indexOf("wkn") == 0) {
				indISIN = i;
			}
			if (indName >= 0 && indISIN >= 0) {
				break;
			}
		}
	}
	if (indName == null || indISIN == null) {
		return null;
	}
	rows = frag.querySelector("tbody").rows;
	for (i=0; i < rows.length; i++) {
		row = rows.item(i);
		text = row.cells.item(indISIN).innerText.trim().replace(/\s/g, " ");
		wkn = text.substring(0, text.indexOf(" ")).trim();
		isin = text.substring(text.indexOf(" ") + 1).trim();
		frag = fragmentFromString(row.cells.item(indName).innerHTML);
		detLink = frag.querySelector("a").getAttribute("href");
		temp = { name: row.cells.item(indName).innerText.trim(),
				  wkn: wkn,
				  isin: isin,
				  detLink: detLink
				};
		nData.push(temp);
	}
	return nData;
}

function fillResultList(data, list) {
	var inte;
	var li;
	var tr;
	var td;
	var table;
	if (data && list) {
		table = list.getElementsByClassName("prt").item(0);
		data.forEach(function (elem, ind, arr) {
//			inte = "" + elem.name + " | " + elem.wkn + " | " + elem.isin;
//			li = document.createElement("li");
//			li.setAttribute("dataInd", ind);
//			li.setAttribute("class", "searchResultItem");
//			li.innerText = inte;
//			list.appendChild(li);
//			li.addEventListener("click", liOnClick);
			tr = document.createElement("tr");
			tr.className = (ind % 2 === 0 ? "even" : "odd");
			tr.setAttribute("dataInd", ind);
			// name
			td = document.createElement("td");
			td.innerText = elem.name;
			td.className = "tdname";
			tr.appendChild(td);
			// wkn
			td = document.createElement("td");
			td.innerText = elem.wkn;
			td.className = "tdwkn";
			tr.appendChild(td);
			// isin
			td = document.createElement("td");
			td.innerText = elem.isin;
			td.className = "tdisin";
			tr.appendChild(td);
			tr.addEventListener("click", liOnClick);
			table.appendChild(tr);
		});
	}
}

function getDetails(url) {
	if (url && url.length > 0) {
		if (oReq == null) {
			oReq = new XMLHttpRequest();
		}
		oReq.onload = detListener;
		oReq.open("get", url);
		oReq.send();
	}
}

function detListener() {
	var table, tr, cell, list, selEx, sel = getElement(this.responseText, "select#exchangeSelect");
	if (sel) {
		selEx = document.querySelector("#exchangeSelect");
		selEx.innerHTML = sel.innerHTML;
	}
	else {
//		table = getElement(this.responseText, "table#factsheet_prices_table");	
//		if (table) {
//			tr = table.getElementsByTagName('tr')[0];
//			cell = tr.getElementsByClassName("factsheet_price_columnValue").item(0);
//		}
		alert("Not imlemented yet");
	}
	list = document.querySelector("#popupResList");
	list.remove();
}

function liOnClick(evt) {
	var url, ind;
	ind = parseInt(evt.currentTarget.getAttribute("dataInd"));
	if (!isNaN(ind) && ind >= 0 && ind < data.length) {
		url = "https://boerse.dab-bank.de" + data[ind].detLink;
		getDetails(url);
	}
}

function getElement(htmlText, selector) {
	var elem, fragment = fragmentFromString(htmlText);
	if (fragment) {
		elem = fragment.querySelector(selector);
		return elem;
	}
	return null;
}

function createPopupResultList(sc) {
	var table, list = document.createElement("div");
	list.style.left = "" + sc.offsetLeft + "px";
	list.style.top = "" + (sc.offsetTop + sc.offsetHeight) + "px";
	list.id = "popupResList";
	list.setAttribute("tabindex", "0");
	table = document.createElement("table");
	table.className = "prt";
	list.appendChild(table);
	sc.offsetParent.appendChild(list);
	list.addEventListener("keydown", function(evt) {
		if (evt.keyCode == 27) { // ESC
			list.remove();
		}
	});
	return list;
}
