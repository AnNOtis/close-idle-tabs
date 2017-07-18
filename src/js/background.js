import pify from 'pify'

const tabsActivityRecord = {}
window.tabsActivityRecord = tabsActivityRecord

getAllTabs().then(registTabs)

chrome.management.onEnabled.addListener(() => {
  getAllTabs().then(registTabs)
})

chrome.tabs.onActivated.addListener(info => {
  recordTabActivity(info.id)
})

chrome.tabs.onCreated.addListener(info => {
  recordTabActivity(info.id)
})

chrome.tabs.onRemoved.addListener(info => {
  removeTab(info.id)
})

chrome.browserAction.onClicked.addListener(() => {
  closeIdleTabs()
})

function recordTabActivity(id) {
  tabsActivityRecord[id] = { lastActivedAt: new Date() }
}

function registTabs (tabs) {
  tabs
    .map(tab => tab.id)
    .filter(tabId => !tabsActivityRecord[tabId])
    .forEach(recordTabActivity)
}

function removeTab(id) {
  delete tabsActivityRecord[id]
}

window.closeIdleTabs = closeIdleTabs
function closeIdleTabs () {
  getAllTabs()
    .then(dropWantedTab)
    .then(dropIfActivedIn())
    .then(tap('removeTabs:'))
    .then(tabs => chrome.tabs.remove(tabs.map(tab => tab.id)))
}

function getAllTabs() {
  return new Promise(function (resolve, reject) {
    try {
      chrome.tabs.query({}, tabs => {
        resolve(tabs)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function dropWantedTab (tabs) {
  return tabs.filter(tab => !tab.active && !tab.highlighted && !tab.pinned)
}

function dropIfActivedIn (time = 5 * 60 * 1000) {
  return tabs => tabs.filter(tab => {
    return (
      tabsActivityRecord[tab.id] &&
      (new Date() - tabsActivityRecord[tab.id].lastActivedAt) > time
    )
  })
}


function tap(title = 'tap') {
  return (v) => {
    console.log(title, v)
    return v
  }
}
