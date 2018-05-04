'use strict';

let tabs;
let selectedTab = 0;

let main = async () => {
  tabs = await getTabs();
  console.log('tabs', tabs)
  renderTabs()
}

const renderTabs = () => {
  let container = document.getElementById('closed-tabs')
  container.innerHTML = '';
  tabs.forEach((tab, index) => {
    let element = document.createElement('li');
    element.innerHTML = tab.url;
    if (index === selectedTab) {
      element.classList.add('active')
    }
    container.appendChild(element)
  })
}

const selectUp = () => {
  selectedTab > 0 ? selectedTab-- : selectedTab

  renderTabs();
}

const selectDown = () => {
  selectedTab <= tabs.length ? selectedTab++ : selectedTab
  renderTabs();
}

const openSelectedTab = () => {
  let win = window.open(tabs[selectedTab].url, '_blank');
  win.focus();
}

// chrome.storage.sync.get('tabs', (data) => {
//   console.log(data)
//   let container = document.getElementById('closed-tabs')
//   data.tabs.forEach((tab) => {
//     let element = document.createElement('li');
//     element.innerHTML = tab.url;
//     container.appendChild(element)
//   })
// });



document.onkeydown = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      selectUp();
      break;

    case 'ArrowDown':
      selectDown();
      break;

    case 'Enter':
      openSelectedTab();
      break;

  }
  console.log(e)
}

const getTabs = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('tabs', result => {
      console.log(result)
      resolve(result.tabs)
    })
  })
}

main();