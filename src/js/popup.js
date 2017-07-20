import "../css/popup.sass";
window.bg = chrome.extension.getBackgroundPage()
let _dataBuffer

init()

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btn')) {
    alert('Yo!')
  }
});

function init () {
  return fetchData()
    .then(renderToContainer)
    .then(() => {
      setInterval(fetchData, 2000)
      setInterval(() => renderToContainer(_dataBuffer), 1000)
    })
}

function fetchData() {
  return bg
    .getPopupPageData()
    .then(data => _dataBuffer = data)
}

function renderToContainer (data) {
  const content = renderContent(data)
  document.getElementById('container').innerHTML = content
}

function renderContent (data) {
  const result = `
    <div class="header">${actionButton(data)}</div>
    <div class="main">
      ${inactiveTabs(data)}
      ${activeTabState(data)}
      ${activeTabs(data)}
    </div>
  `

  return result
}


function actionButton (data) {
  const wantedTabs = data.wantedTabs

  return `
    <button class="btn">
      <div class="btn-content">Close Idle Tabs</div>
      <div class="btn-hint">
        leave ${wantedTabs.length} active ${wantedTabs.length > 1 ? 'tabs' : 'tab'}
      </div>
    </button>
  `
}

function inactiveTabs (data) {
  const tabCount = data.unwantedTabs.length

  return `
    <div class="inactiveTabs">
      <strong>${tabCount}</strong> ${maybePlural(tabCount, 'tab')} are ` +
      `<strong>${humanDuration(data.IDLE_TIME)}</strong> idle.
    </div>
  `
}

function activeTabState(data) {
  return `<div class="stateHeader">Active Tabs (${data.wantedTabs.length})</div>`
}

function activeTabs (data) {
  const sortedTabs = data.wantedTabs.sort((a,b) => {
    if (a.pinned && b.pinned) return 0
    if (a.active && b.active) return 0
    if (a.pinned && !b.pinned) return -1
    if (b.pinned && !a.pinned) return 1
    if (a.active && !b.pinned) return -1
    if (b.active && !a.pinned) return 1
    return b.lastActivedAt - a.lastActivedAt
  })
  const items = data.wantedTabs.reduce((result, tab) =>
    result + `<li class="item">${renderTab(tab)}</li>`
  , '')
  return `
  <div class="activeTabs">
    <ul class="list">${items}</ul>
  </div>
  `
}

function renderTab (tab) {
  let state = ''
  if (tab.pinned) {
    state = 'pinned'
  } else if (tab.active) {
    state = 'active now'
  } else {
    state = `actived ${humanDuration(new Date() - tab.lastActivedAt)} ago`
  }

  let favicon = '/assets/chrom-internal-icon.png'
  if (tab.favIconUrl && tab.favIconUrl.match(/^https?/)) {
    favicon = tab.favIconUrl
  }

  return `
  <div class="tab">
    <img class="tab-favicon" src="${favicon}">
    <div class="tab-info">
      <div class="tab-info-title">${tab.title}</div>
      <div class="tab-info-state">${state}</div>
    </div>
  </div>
  `
}

function maybePlural (number, str) {
  return number > 1 ? `${str}s` : `${str}`
}

window.humanDuration = humanDuration
function humanDuration (ms) {
  const s = parseInt(ms / 1000)
  if (s >= 60 * 60) {
    const hour = parseInt(s / 3600)
    return `${hour} ${maybePlural(hour, 'hour')}`
  } else if (s >= 60) {
    const min = parseInt(s / 60)
    return `${min} ${maybePlural(min, 'min')}`
  } else if (!s) {
    return `now`
  } else {
    return `${s} ${maybePlural(s, 'second')}`
  }
}
