var oReq, data;

document.addEventListener("readystatechange", function () {
	var el;
	if (document.readyState ==="complete") {
		document.getElementById("sb").addEventListener("click", sbOnClick);
		el = document.getElementById("ss");
		el.addEventListener("keydown", ssOnKeyDown);
		el.focus();
		document.getElementById("add").addEventListener("click", addOnClick);
		document.getElementById("clear").addEventListener("click", clear);
		document.getElementById("exchangeSelect").addEventListener("keydown", selOnKeyDown);
		document.getElementById("cPeriod").addEventListener("keydown", selOnKeyDown);
		document.getElementById("save").addEventListener("click", saveOnClick);
		document.getElementById("load").addEventListener("click", loadOnClick);
    }
});

function sbOnClick(evt) {
	searchStock();
}

function ssOnKeyDown(evt) {
	if (evt.keyCode === 13) {
		searchStock();
	}
	else if (evt.keyCode == 27) { // ESC
		var list = document.querySelector("#popupResList");
		if (list) {
			list.remove();
		}
		evt.currentTarget.value = "";
	}
}

function searchStock() {
	var params, stock = document.getElementById("ss").value;
	var list = document.querySelector("#popupResList");
	if (list) {
		list.remove();
	}
	if (stock) {
		stock = stock.trim();
		if (stock != "") {
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
}

function reqListener () {
//	console.log(this.responseText);
	var sc, list, div, table = getElement(this.responseText, "table#instrument"),
		list, selEx = document.querySelector("#exchangeSelect");
	selEx.innerHTML = "";
	if (table != null) {
		div = document.createElement("div");
		div.appendChild(table);
		data = extractStockData(div);
		sc = document.getElementById("ss");
		list = createPopupResultList(sc);
		fillResultList(data, list);
		list.focus();
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
//		wkn = text.substring(0, text.indexOf(" ")).trim();
		isin = text.substring(text.indexOf(" ") + 1).trim();
		frag = fragmentFromString(row.cells.item(indName).innerHTML);
		detLink = frag.querySelector("a").getAttribute("href");
		temp = { name: row.cells.item(indName).innerText.trim(),
//				  wkn: wkn,
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
	var tdspan;
	if (data && list) {
		table = list.getElementsByClassName("prt").item(0);
		data.forEach(function (elem, ind, arr) {
			tr = document.createElement("tr");
			tr.className = (ind % 2 === 0 ? "even" : "odd");
			tr.setAttribute("dataInd", ind);
			// name
			td = document.createElement("td");
			tdspan = document.createElement("span");
			tdspan.innerText = elem.name;
			tdspan.className = "tdspan";
			td.appendChild(tdspan);
			td.className = "tdname";
			tr.appendChild(td);
//			// wkn
//			td = document.createElement("td");
//			td.innerText = elem.wkn;
//			td.className = "tdwkn";
//			tr.appendChild(td);
			// isin
			td = document.createElement("td");
			td.innerText = elem.isin;
			td.className = "tdisin";
			tr.appendChild(td);
			tr.addEventListener("click", liOnClick);
			table.appendChild(tr);
			if (tdspan.offsetWidth < tdspan.scrollWidth) {
				tr.cells.item(0).title = tdspan.innerText;
			}
		});
	}
	updatePrlSelection(list, (table.rows.length > 0 ? 0 : null));
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
	var ss = document.querySelector("#ss");
	if (sel) {
		selEx = document.querySelector("#exchangeSelect");
		selEx.innerHTML = sel.innerHTML;
		selEx.focus();
	}
	else {
//		table = getElement(this.responseText, "table#factsheet_prices_table");	
//		if (table) {
//			tr = table.getElementsByTagName('tr')[0];
//			cell = tr.getElementsByClassName("factsheet_price_columnValue").item(0);
//		}
		alert("Not imlemented yet");
		ss.focus();
	}
	list = document.querySelector("#popupResList");
	list.remove();
}

function liOnClick(evt) {
	var url, ind, tr, tdname, ss;
	tr = evt.currentTarget;
	ind = parseInt(tr.getAttribute("dataInd"));
	if (!isNaN(ind) && ind >= 0 && ind < data.length) {
		tdname = tr.getElementsByClassName("tdname").item(0);
		ss = document.querySelector("#ss");
		ss.value = tdname.innerText;
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
	list.addEventListener("keydown", prlOnKeyDown);
	return list;
}

function addOnClick(evt) {
	var ss = document.querySelector("#ss");
	var selEx = document.querySelector("#exchangeSelect");
	var sOpt = selEx.selectedOptions.item(0);
	if (!sOpt) {
		alert("Nothing to add, cancel");
		return;
	}
	var period = document.querySelector("#cPeriod");
	var opTable = document.querySelector("#curOpts");
	var tr = document.createElement("tr");
	tr.setAttribute("cId", sOpt.value);
	// name
	var td = document.createElement("td");
	td.innerText = ss.value;
	td.className = "tdname";
	tr.appendChild(td);
	// stock exchange
	td = document.createElement("td");
	td.innerText = sOpt.innerText;
	td.className = "tdstex";
	tr.appendChild(td);
	// period
	td = document.createElement("td");
	td.innerText = period.selectedOptions.item(0).value;
	td.className = "tdper";
	tr.appendChild(td);

	tr.addEventListener("click", coOnClick);
	opTable.appendChild(tr);
}

function coOnClick(evt) {
	var url, ind, tdname, ss;
	var tr = evt.currentTarget;
}

function clear(evt) {
	var ss = document.querySelector("#ss");
	ss.value = "";
	ss.focus();
	var selEx = document.querySelector("#exchangeSelect");
	selEx.innerHTML = "";
	var period = document.querySelector("#cPeriod");
	period.item(0).selected = true;
}

function prlOnKeyDown(evt) {
	var list = evt.currentTarget;
	var table = list.getElementsByClassName("prt").item(0);
	var tr;
	var ind;
	var tdname;
	var ss;
	var url;
	var si = parseInt(list.getAttribute("selInd"));
	if (isNaN(si)) {
		si = null;
	}
	if (evt.keyCode == 27) { // ESC
		list.remove();
		var ss = document.querySelector("#ss");
		if (ss) {
			ss.focus();
		}
	}
	else if (evt.keyCode == 40) { // arrow down
		if (si != null) {
			si++;
			if (si >= table.rows.length) {
				si = table.rows.length - 1;
			}
		}
		else if (table.rows.length > 0) {
			si = 0;
		}
		updatePrlSelection(list, si);
		moveSelectionInViewport(list, si);
		evt.preventDefault();
	}
	else if (evt.keyCode == 38) { // arrow up
		if (si != null) {
			si--;
			if (si < 0) {
				si = 0;
			}
		}
		else if (table.rows.length > 0) {
			si = 0;
		}
		updatePrlSelection(list, si);
		moveSelectionInViewport(list, si);
		evt.preventDefault();
	}
	else if (evt.keyCode == 36) { // home
	}
	else if (evt.keyCode == 35) { // end
	}
	else if (evt.keyCode == 34) { // page down
	}
	else if (evt.keyCode == 33) { // page up
	}
	else if (evt.keyCode == 13 && data && si >= 0 && si < table.rows.length) { // enter
		tr = table.rows.item(si);
		ind = parseInt(tr.getAttribute("dataInd"));
		if (!isNaN(ind) && ind >= 0 && ind < data.length) {
			tdname = tr.getElementsByClassName("tdname").item(0);
			ss = document.querySelector("#ss");
			ss.value = tdname.innerText;
			url = "https://boerse.dab-bank.de" + data[ind].detLink;
			getDetails(url);
		}
	}
}

function updatePrlSelection(list, si) {
	var oldSelInd = parseInt(list.getAttribute("selInd"));
	var table = list.getElementsByClassName("prt").item(0);
	var tr;
	if (!isNaN(oldSelInd) && oldSelInd < table.rows.length) {
		tr = table.rows.item(oldSelInd);
		var re = /(selected)/gi;
		if (tr.className) {
			tr.className = tr.className.replace(re, "");
			tr.className.trim();
		}
	}
	if (si == null) {
		list.removeAttribute("selInd");
	}
	else if (si >= 0 && si < table.rows.length) {
		list.setAttribute("selInd", si.toString());
		tr = table.rows.item(si);
		tr.className += " selected";
	}
}

function moveSelectionInViewport(list, ind) {
	if (isNaN(ind) || list == null) {
		return;
	}
	var table = list.getElementsByClassName("prt").item(0);
	var tr;
	if (ind >= 0 && ind < table.rows.length) {
		tr = table.rows.item(ind);
		var y = tr.offsetTop;
		var top = list.clientTop + list.scrollTop;
		var bottom = top + list.clientHeight;
		if (y < top) {
			list.scrollTop = y;
		}
		else if (y + tr.offsetHeight > bottom) {
			list.scrollTop = y + tr.offsetHeight - list.clientHeight+list.clientTop;
		}
	}
}

function selOnKeyDown(evt) {
	var elem = evt.currentTarget;
	if (evt.keyCode == 27) { // ESC
		clear();
		evt.preventDefault();
	}
	else if (evt.keyCode == 13) { // enter
		addOnClick(evt);
		evt.preventDefault();
	}
}

function saveOnClick(evt) {
	alert("Options will be saved");
}

function loadOnClick(evt) {
	alert("Options will be loaded");
}

