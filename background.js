'use strict';

chrome.runtime.onInstalled.addListener(async () => {
  let closedList = [];

  chrome.tabs.onRemoved.addListener(async (tabId, removed) => {
    let tabs = await getTabs
    console.log(tabs, tabs.length);
    if(tabs.length > 9){
      tabs.splice(-1, 1);
    }
    let closedTab = tabs.find((tab) => tab.id === tabId)
    closedList.push(closedTab)
    console.log(closedList)
  })

  chrome.tabs.onCreated.addListener(async () => {
    await setTabs();
  })

  chrome.tabs.onUpdated.addListener(async () => {
    await setTabs();
  })
});

const setTabs = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      chrome.storage.sync.set({ tabs });
    })
  })
}

const getTabs = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['tabs'], result => {
      console.log(result)
      resolve(result.tabs)
    })
  })
}
// class TabService {
//   async contructor(){
//     this.tabs = []
//     chrome.tabs.query({}, (currentTabs) => {
//       this.tabs = currentTabs;
//     })
//   }
//   async getTabs() {
//     return this.tabs;
//   }
//   async setTabs() {
//     chrome.tabs.query({}, (currentTabs) => {
//       this.tabs = currentTabs;
//     })
//   }

//   async handleClosedTab(tabId) {
//     console.log('closed')
//     console.log(this.tabs)
//     let closedTab = this.tabs.find((tab) => tabId = tab.id)
//     await this.setTabs();
//     return closedTab;
//   }
// }