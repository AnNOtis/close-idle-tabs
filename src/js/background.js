import { interval } from './utils/index'
import Ovv from 'ovv'
const DEFAULT_IDLE_TIME = 5 * 1000 * 60
const DEFAULT_DELAY_BEFORE_RECORD_ACTIVITY = 3000
const config = {
  IDLE_TIME: DEFAULT_IDLE_TIME,
  DELAY_BEFORE_RECORD_ACTIVITY: DEFAULT_DELAY_BEFORE_RECORD_ACTIVITY
}
export const TAB_DATA_PORT = 'TAB_DATA_PORT'
const tabsActivityRecord = {}
window.records = tabsActivityRecord
const tabDataPubSub = new Ovv()

setupConfig()
  .then(() => getAllTabs().then(registTabs).then(initActions))

function setupConfig () {
  return getStorage({idleTime: DEFAULT_IDLE_TIME})
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
    // 初始化先送一次資料
    pushData()

    // 提供 pubsub 讓其他元件主動推送資料
    const cancel = tabDataPubSub.subscribe(pushData)

    // 讓頁面可以自行請求資料
    port.onMessage.addListener(pushData)

    // 當通道關閉則取消 pubsub
    port.onDisconnect.addListener(cancel)
  }

  function pushData () {
    getPopupPageData().then(data => {
      port.postMessage(data)
    })
  }
})

function pushDataToAllPages () {
  tabDataPubSub.publish()
}

function initActions () {
  let currentActivatedTab
  let _cancelTimer
  chrome.tabs.onActivated.addListener(info => {
    if (_cancelTimer) { _cancelTimer() }
    _cancelTimer = interval(() => {
      currentActivatedTab = info.tabId
      recordTabActivity(info.tabId)
    }, 1000, config.DELAY_BEFORE_RECORD_ACTIVITY)
  })

  chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    // detect tab created
    if (changeInfo.status === 'complete') {
      recordTabActivity(id)
    }
  })

  chrome.tabs.onRemoved.addListener(info => {
    if (currentActivatedTab === info.tabId) {
      _cancelTimer && _cancelTimer()
    }
    removeTabRecord(info.tabId)
  })
}

function recordTabActivity (id) {
  tabsActivityRecord[id] = { lastActivedAt: Date.now() }
  pushDataToAllPages()
}

function recordTabsActivity (ids) {
  const now = Date.now()
  ids.forEach(id => {
    tabsActivityRecord[id] = { lastActivedAt: now }
  })
  pushDataToAllPages()
}

function registTabs (tabs) {
  const tabIDs = tabs
    .map(tab => tab.id)
    .filter(tabId => !tabsActivityRecord[tabId])

  recordTabsActivity(tabIDs)
}

function removeTabRecord (id) {
  delete tabsActivityRecord[id]
  pushDataToAllPages()
}

window.closeUnwantedTabs = closeUnwantedTabs
function closeUnwantedTabs () {
  return unwantedTabs()
    .then(tap('removeTabs:'))
    .then(tabs => chrome.tabs.remove(tabs.map(tab => tab.id)))
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
      setTimeout(chrome.tabs.query({}, tabs => {
        // console.log(tabsActivityRecord);
        const result = mixActivityData(tabs)
        // console.log(result);
        resolve(result)
      }), 100)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })

  function mixActivityData (tabs) {
    return tabs.map(tab => {
      return {
        ...tab,
        ...tabsActivityRecord[tab.id]
      }
    })
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
    .then(tabs => tabs.sort((a, b) =>
      parseInt(b.lastActivedAt / 1000) - parseInt(a.lastActivedAt / 1000)
    ))
    .then(tabs => ({ ...config, tabs }))
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
