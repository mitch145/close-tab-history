'use strict';

chrome.runtime.onInstalled.addListener(async () => {
  let tabs = [];
  tabs = await getTabs();

  chrome.tabs.onRemoved.addListener(async (tabId, removed) => {
    let closedTab = tabs.find((tab) => tab.id === tabId)
    console.log('1', closedTab)
    let closedTabs = chrome.storage.sync.get(['closedTabs'], (data) => {
      console.log(data)
      chrome.storage.sync.set({ 
        closedTabs: data.closedTabs ? data.closedTabs.push(closedTab) : [closedTab]
      });
    });
    tabs = await getTabs();
  })

  chrome.tabs.onCreated.addListener(async () => {
    tabs = await getTabs();
  })

  chrome.tabs.onUpdated.addListener(async () => {
    tabs = await getTabs();
  })
});

const getTabs = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs)
    })
  })
}