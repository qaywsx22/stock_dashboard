var oReq, data;
var suggestTimer = null;

document.addEventListener("readystatechange", function () {
	var el;
	if (document.readyState ==="complete") {
		document.getElementById("sb").addEventListener("click", sbOnClick);
		el = document.getElementById("ss");
		el.addEventListener("keydown", ssOnKeyDown);
		el.addEventListener("input", ssOnInput);
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
	var table, si, list = document.querySelector("#popupResList");
	if (!!list) {
		table = list.getElementsByClassName("prt").item(0);
		si = parseInt(list.getAttribute("selInd"));
		if (isNaN(si)) {
			si = null;
		}
	}
	if (evt.keyCode === 13) {
		if (suggestTimer != null) {
			window.clearTimeout(suggestTimer);
			suggestTimer = null;
		}
		searchStock();
	}
	else if (evt.keyCode == 27) { // ESC
		if (suggestTimer != null) {
			window.clearTimeout(suggestTimer);
			suggestTimer = null;
		}
		if (list) {
			while (!!table && table.rows.length > 0) {
				table.rows.item(table.rows.length - 1).removeEventListener("click", liOnClick);
				table.deleteRow(-1);
			}
			list.remove();
		}
		evt.currentTarget.value = "";
	}
	else if (evt.keyCode == 40) { // arrow down
		if (!!table && table.rows.length > 0) {
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
	}
	else if (evt.keyCode == 38) { // arrow up
		if (!!table && table.rows.length > 0) {
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
	}
	else if (evt.keyCode == 36) { // home
	}
	else if (evt.keyCode == 35) { // end
	}
	else if (evt.keyCode == 34) { // page down
	}
	else if (evt.keyCode == 33) { // page up
	}
}

function ssOnInput(evt) {
	if (suggestTimer != null) {
		window.clearTimeout(suggestTimer);
		suggestTimer = null;
	}
	if (evt.currentTarget.value != null && evt.currentTarget.value != "") {
		suggestTimer = window.setTimeout(getSuggest, 200);
	}
}

function getSuggest() {
	var url, stock = document.getElementById("ss").value;
	if (stock) {
		stock = stock.trim();
		if (stock != "") {
			url="https://boerse.dab-bank.de/maerkte-kurse/ajax/autosuggest.htm?SEARCH_VALUE="+encodeURIComponent(stock);
			if (oReq == null) {
				oReq = new XMLHttpRequest();
			}
			oReq.onload = suggestListener;
			oReq.open("get", url);
			oReq.setRequestHeader("Accept", "text/html");
			oReq.setRequestHeader("Pragma", "no-cache");
			oReq.setRequestHeader("Cache-Control", "no-cache");
			oReq.send();
		}
	}
}

function suggestListener() {
	var re, match, res, d = null;
	var table, list;
	var aInput = this.responseText;
	data = null;
	if (!!aInput) {
		re = /.*d\['STO'\]=new Array\((.*)\);d\['BON'\].*/g;
		match = re.exec(aInput);
		if (!!match) {
			res = match[1];
			d = res.split("','");
			if (d.length > 2) {
				d[0] = d[0].replace(/'/, "");
				d[d.length - 1] = d[d.length - 1].replace(/'/, "");
			}
			data = extractSuggestData(d);
		}
	}
	if (data) {
		showSuggestPopup();
	}
	else {
		list = document.querySelector("#popupResList");
		if (list) {
			table = list.getElementsByClassName("prt").item(0);
			while (!!table && table.rows.length > 0) {
				table.rows.item(table.rows.length - 1).removeEventListener("click", liOnClick);
				table.deleteRow(-1);
			}
			list.remove();
		}
	}
}

function extractSuggestData(arr) {
	if (!arr || arr.length < 3) {
		return null;
	}
	var i, isin;
	var stock = document.getElementById("ss").value;
	var sLink = "/maerkte-kurse/redirect/redirect.action?redirectUrl=https%3A//boerse.dab-bank.de/maerkte-kurse/wertpapiersuche/isin_";
	var nData = new Array();
	for (i=0; i<arr.length; i=i+3) {
		temp = { name: arr[i].trim(),
				  isin: arr[i+2].trim(),
				  detLink: sLink
				};
		temp.detLink += temp.isin + ".html";
		nData.push(temp);
	}
	return nData;
}

function showSuggestPopup() {
	if (!data) {
		return;
	}
	var sc = document.getElementById("ss");
	var list = document.querySelector("#popupResList");
	if (list) {
		list.remove();
	}
	list = createPopupResultList(sc, list);
	fillResultList(data, list);
}

function searchStock() {
	var list = document.querySelector("#popupResList");
	if (!list) {
		return;
	}
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
	if (data && si >= 0 && si < table.rows.length) { // enter
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

function fragmentFromString(strHTML) {
    var temp = document.createElement('template');
    temp.innerHTML = strHTML;
    return temp.content;
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
		while (table.rows.length > 0) {
			table.rows.item(table.rows.length - 1).removeEventListener("click", liOnClick);
			table.deleteRow(-1);
		}
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
//		oReq.setRequestHeader("Referer", "https://www.dab-bank.de/");
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
	list = document.querySelector("#popupResList");
	list.remove();
}

function liOnClick(evt) {
	var url, ind, tr, tdname, ss;
	tr = evt.currentTarget;
	ind = parseInt(tr.getAttribute("dataInd"));
	var list = document.querySelector("#popupResList");
	updatePrlSelection(list, ind);
	moveSelectionInViewport(list, ind);
	searchStock();
}

function getElement(htmlText, selector) {
	var elem, fragment = fragmentFromString(htmlText);
	if (fragment) {
		elem = fragment.querySelector(selector);
		return elem;
	}
	return null;
}

function createPopupResultList(sc, aList) {
	var table, list = aList || document.createElement("div");
	list.style.left = "" + sc.offsetLeft + "px";
	list.style.top = "" + (sc.offsetTop + sc.offsetHeight) + "px";
	list.id = "popupResList";
	list.setAttribute("tabindex", "0");
	table = document.createElement("table");
	table.className = "prt";
	list.appendChild(table);
	sc.offsetParent.appendChild(list);
//	list.removeEventListener("keydown", prlOnKeyDown);
//	list.addEventListener("keydown", prlOnKeyDown);
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

