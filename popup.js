'use strict';

let tabs;
let highlightedTab = 0;

let main = async () => {
  renderTabs()
}

const renderTabs = async () => {
  try{
    tabs = await getTabs();
    console.log('tabawait', tabs)
  } catch(err){
    console.log('err', err)
  }
  console.log('renderTabs', tabs)
  let container = document.getElementById('closed-tabs')
  container.innerHTML = '';
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
    chrome.storage.local.set({ closedTabs: [] })
    return;
  } else {
    chrome.storage.local.set({
      closedTabs: [...tabs.slice(0, highlightedTab), ...tabs.slice(highlightedTab + 1, tabs.length)]
    })
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

const getTabs = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('closedTabs', result => {
      console.log('result', result)
      resolve(result.closedTabs)
    })
  })
}

main();