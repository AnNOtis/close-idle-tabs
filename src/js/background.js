const IDLE_TIME = 5 * 1000 * 60
const ACTIVE_DURATION_THRESHOLD = 3000 // 3 seconds
const tabsActivityRecord = {}
window.tabsActivityRecord = tabsActivityRecord

chrome.browserAction.setBadgeBackgroundColor({color: '#333'})
getAllTabs().then(registTabs)

chrome.management.onEnabled.addListener(() => {
  getAllTabs().then(registTabs)
})

let activeDurationTimemer
chrome.tabs.onActivated.addListener(info => {
  if (activeDurationTimemer) { clearTimeout(activeDurationTimemer) }
  ((tabID) => {
    activeDurationTimemer = setTimeout(() => {
      recordTabActivity(tabID)
    }, ACTIVE_DURATION_THRESHOLD)
  })(info.tabId)
})

chrome.tabs.onCreated.addListener(info => {
  recordTabActivity(info.tabId)
})

chrome.tabs.onRemoved.addListener(info => {
  removeTabRecord(info.tabId)
})

chrome.browserAction.onClicked.addListener(() => {
  closeUnwantedTabs()
    .then(updateBadge)
})

function recordTabActivity (id) {
  tabsActivityRecord[id] = { lastActivedAt: new Date() }
}

function registTabs (tabs) {
  tabs
    .map(tab => tab.id)
    .filter(tabId => !tabsActivityRecord[tabId])
    .forEach(recordTabActivity)
}

function removeTabRecord (id) {
  delete tabsActivityRecord[id]
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

window.getPopupPageData = getPopupPageData
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
    }, {IDLE_TIME, ACTIVE_DURATION_THRESHOLD, unwantedTabs: [], wantedTabs: []}))
}

function tap (title = 'tap') {
  return (v) => {
    console.log(title, v)
    return v
  }
}
