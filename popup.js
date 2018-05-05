'use strict';

let tabs;
let highlightedTab = 0;

let main = async () => {
  tabs = await getTabs();
  renderTabs()
}

const renderTabs = () => {
  let container = document.getElementById('closed-tabs')
  container.innerHTML = '';
  tabs = tabs || []
  tabs.forEach((tab, index) => {
    let element = document.createElement('li');
    element.innerHTML = tab.url;
    if (index === highlightedTab) {
      element.classList.add('active')
    }
    container.appendChild(element)
  })
  let element = document.createElement('li');
  element.innerHTML = 'Clear Tabs'
  if (tabs.length === highlightedTab) {
    element.classList.add('active')
  }
  container.appendChild(element)
}

const highlightUp = () => {
  highlightedTab > 0 ? highlightedTab-- : highlightedTab
  renderTabs();
}

const highlightDown = () => {
  console.log(tabs.length)
  highlightedTab < tabs.length ? highlightedTab++ : highlightedTab
  renderTabs();
}

const selectTab = () => {
  if (tabs.length === highlightedTab) {
    chrome.storage.sync.set({ closedTabs: [] })
    return;
  }
  let win = window.open(tabs[highlightedTab].url, '_blank');
  win.focus();
}

document.onkeydown = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      highlightUp();
      break;

    case 'ArrowDown':
      highlightDown();
      break;

    case 'Enter':
      selectTab();
      break;

  }
}

const getTabs = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('closedTabs', result => {
      resolve(result.tabs)
    })
  })
}

main();