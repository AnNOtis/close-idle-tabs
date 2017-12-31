import { interval } from './utils/index'
import Ovv from 'ovv'

let DEFAULT_IDLE_TIME = 5 * 1000 * 60
if (process.env.NODE_ENV === 'development') {
  DEFAULT_IDLE_TIME = 10000000000
}

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
  const tabDataPort = port.name.match(new RegExp(`${TAB_DATA_PORT}#([0-9]*)`))
  const windowId = tabDataPort && parseInt(tabDataPort[1])

  if (tabDataPort) {
    // 初始化先送一次資料
    pushData()

    // 提供 pubsub 讓其他元件主動推送資料
    const cancel = tabDataPubSub.subscribe(pushData)

    // 讓頁面可以自行請求資料
    port.onMessage.addListener(handleMessage)

    // 當通道關閉則取消 pubsub
    port.onDisconnect.addListener(cancel)
  }

  function handleMessage (msg) {
    if (msg.what === 'data') {
      pushData()
    } else if (msg.what === 'closeIdleTabs') {
      closeIdleTabs(msg.idleTabIDs)
    }
  }

  function pushData () {
    getPopupPageData(windowId).then(data => {
      port.postMessage(data)
    })
  }

  function closeIdleTabs (idleTabIDs) {
    closeIdleTabsByWindow(windowId, idleTabIDs)
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

function closeIdleTabsByWindow (windowId, idleTabIDs) {
  return getAllTabs(windowId)
    .then(tabs => chrome.tabs.remove(
      tabs
        .filter(tab => idleTabIDs.indexOf(tab.id) !== -1)
        .map(tab => tab.id)
    ))
}

function getAllTabs (windowId) {
  return new Promise(function (resolve, reject) {
    try {
      setTimeout(chrome.tabs.query({ windowId }, tabs => {
        const result = mixActivityData(tabs)
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

function getPopupPageData (windowId) {
  return getAllTabs(windowId)
    .then(tabs => tabs.sort((a, b) => b.lastActivedAt - a.lastActivedAt))
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
