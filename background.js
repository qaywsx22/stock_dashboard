// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ 'url' : 'default_popup.html'});
//  var args = {
//    'left': 200,
//    'top': 200,
//    'width': 500,
//    'height': 400,
//    'url': 'popup.html'
//  }
//  try {
//    chrome.windows.create(args);
//  } catch(e) {
//    alert(e);
//  }  
});