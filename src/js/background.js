import { interval } from './utils/index'
import Ovv from 'ovv'
const config = {
  IDLE_TIME: 5 * 1000 * 60,
  DELAY_BEFORE_RECORD_ACTIVITY: 3000
}
export const TAB_DATA_PORT = 'TAB_DATA_PORT'
const tabsActivityRecord = {}
const tabDataPubSub = new Ovv()

setupConfig()
  .then(() => getAllTabs().then(registTabs).then(initActions))

function setupConfig () {
  return getStorage({idleTime: 5000})
    .then(data => {
      config.IDLE_TIME = data.idleTime

      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.idleTime) {
          config.IDLE_TIME = changes.idleTime.newValue
        }
      })
    })
}

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === TAB_DATA_PORT) {
    const cancel = tabDataPubSub.subscribe(data => {
      port.postMessage(data)
    })
    port.onMessage.addListener(pushTabData)
    port.onDisconnect.addListener(cancel)
  }
})

function pushTabData () {
  return getPopupPageData().then(data => {
    tabDataPubSub.publish(data)
  })
}

function initActions () {
  let _cancelTimer
  chrome.tabs.onActivated.addListener(info => {
    if (_cancelTimer) { _cancelTimer() }
    _cancelTimer = interval(() => {
      recordTabActivity(info.tabId)
    }, 1000, config.DELAY_BEFORE_RECORD_ACTIVITY)
  })

  chrome.tabs.onCreated.addListener(info => {
    recordTabActivity(info.tabId)
  })

  chrome.tabs.onRemoved.addListener(info => {
    removeTabRecord(info.tabId)
  })
}

function recordTabActivity (id) {
  tabsActivityRecord[id] = { lastActivedAt: Date.now() }
  pushTabData()
}

function registTabs (tabs) {
  tabs
    .map(tab => tab.id)
    .filter(tabId => !tabsActivityRecord[tabId])
    .forEach(recordTabActivity)
}

function removeTabRecord (id) {
  delete tabsActivityRecord[id]
  pushTabData()
}

window.closeUnwantedTabs = closeUnwantedTabs
function closeUnwantedTabs () {
  return unwantedTabs()
    .then(tap('removeTabs:'))
    .then(tabs => chrome.tabs.remove(tabs.map(tab => tab.id)))
}

function updateBadge () {
  return wantedTabs()
    .then(tap('updateBadge:'))
    .then(tabs => {
      chrome.browserAction.setBadgeText({text: tabs.length.toString()})
    })
}

function unwantedTabs () {
  return getAllTabs().then(getUnwantedTabs)
}

function wantedTabs () {
  return getAllTabs().then(getWantedTabs)
}

function getAllTabs () {
  return new Promise(function (resolve, reject) {
    try {
      chrome.tabs.query({}, tabs => {
        resolve(mixActivityData(tabs))
      })
    } catch (e) {
      reject(e)
    }
  })

  function mixActivityData (tabs) {
    return tabs.map(tab => ({
      ...tab,
      lastActivedAt:
        tabsActivityRecord[tab.id] && tabsActivityRecord[tab.id].lastActivedAt
    }))
  }
}

function getUnwantedTabs (tabs) {
  return tabs.filter(tab => !isWantedTab(tab))
}

function getWantedTabs (tabs) {
  return tabs.filter(isWantedTab)
}

function isWantedTab (tab) {
  return isCandidate(tab) || isFreshTab(tab)
}

function isCandidate (tab) {
  return tab.active || tab.highlighted || tab.pinned
}

function isFreshTab (tab) {
  return tab.lastActivedAt && (new Date() - tab.lastActivedAt) < config.IDLE_TIME
}

function getPopupPageData () {
  return getAllTabs()
    .then(tabs => tabs.sort((a, b) => b.lastActivedAt - a.lastActivedAt))
    .then(tabs => tabs.reduce((result, tab) => {
      if (isWantedTab(tab)) {
        result.wantedTabs.push(tab)
      } else {
        result.unwantedTabs.push(tab)
      }
      return result
    }, { ...config, unwantedTabs: [], wantedTabs: []}))
}

function getStorage (target) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(target, config => {
        resolve(config)
      })
    } catch (e) {
      reject(e)
    }
  })
}

function tap (title = 'tap') {
  return (v) => {
    console.log(title, v)
    return v
  }
}
