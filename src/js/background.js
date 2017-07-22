import { interval } from './utils/index'
import Ovv from 'ovv'
const IDLE_TIME = 5 * 1000 * 60
const DELAY_BEFORE_RECORD_ACTIVITY = 3000 // 3 seconds
export const TAB_DATA_PORT = 'TAB_DATA_PORT'
const tabsActivityRecord = {}
const tabDataPubSub = new Ovv()

getAllTabs().then(registTabs).then(initActions)

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
    }, 1000, DELAY_BEFORE_RECORD_ACTIVITY)
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
  return tab.lastActivedAt && (new Date() - tab.lastActivedAt) < IDLE_TIME
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
    }, {IDLE_TIME, DELAY_BEFORE_RECORD_ACTIVITY, unwantedTabs: [], wantedTabs: []}))
}

function tap (title = 'tap') {
  return (v) => {
    console.log(title, v)
    return v
  }
}
