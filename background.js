'use strict';

chrome.runtime.onInstalled.addListener(async () => {
  let tabs = [];
  tabs = await getTabs();
  // clear on install
  chrome.storage.local.set({ 
    closedTabs: []
  });

  chrome.tabs.onRemoved.addListener(async (tabId, removed) => {
    let closedTab = tabs.find((tab) => tab.id === tabId)
    console.log('1', closedTab)
    chrome.storage.local.get(['closedTabs'], (data) => {
      let closedTabs = data.closedTabs;
      console.log('data', data)
      console.log('closedTab', closedTab)
      console.log('closedTabs', closedTabs)
      let newTabs;
      if(!closedTabs){
        newTabs = [closedTab]
      } else {
        newTabs = [...closedTabs, closedTab]
      }
      console.log('newTabs', newTabs)
      chrome.storage.local.set({ 
        closedTabs: newTabs
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