'use strict';

let tabs;
let highlightedTab = 0;

let main = async () => {
  renderTabs()
}

const renderTabs = async () => {
  tabs = await getClosedTabs();
  console.log('renderTabs', tabs)
  let container = document.getElementById('tabs')
  container.innerHTML = '';
  tabs.forEach((tab, index) => {
    let element = createNewItem(tab.title, tab.favIconUrl, index === highlightedTab)
    container.appendChild(element)
  })
  let element = createNewItem('Clear Tabs', 'https://cdn4.iconfinder.com/data/icons/business-office-32/24/Material_icons-07-98-512.png', tabs.length === highlightedTab)
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

const selectTab = async () => {
  if (tabs.length === highlightedTab) {
    chrome.storage.local.set({ closedTabs: [] })
    return;
  } else {
    chrome.storage.local.set({
      closedTabs: [...tabs.slice(0, highlightedTab), ...tabs.slice(highlightedTab + 1, tabs.length)]
    })
  }

  let win = window.open(tabs[highlightedTab].url, '_blank');
  win.focus();

  await getTabs();
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

const createNewItem = (title, favicon, active) => {
  let container = document.createElement('div');
  container.classList.add('tab-container')

  // add image
  let imageEl = document.createElement('img')
  imageEl.src = favicon
  imageEl.classList.add('tab-image')
  container.appendChild(imageEl)

  // add image
  let titleEl = document.createElement('p')
  titleEl.innerHTML = title;
  titleEl.classList.add('tab-title')
  container.appendChild(titleEl)
  
  // add active class
  if (active) {
    container.classList.add('active')
  }
  return container;
}

const getClosedTabs = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('closedTabs', result => {
      console.log('result', result)
      resolve(result.closedTabs)
    })
  })
}

const getTabs = async () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      chrome.storage.local.set({
        tabs
      })
      resolve(tabs)
    })
  })
}

main();