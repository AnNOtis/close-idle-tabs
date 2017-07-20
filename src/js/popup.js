import '../css/popup.sass'
import App from './popup/App'
import { h, render } from 'preact'
import { maybePlural, humanDuration } from './utils'

window.bg = chrome.extension.getBackgroundPage()
let _dataBuffer

const fakeData = {
  'IDLE_TIME': 300000,
  'ACTIVE_DURATION_THRESHOLD': 3000,
  'unwantedTabs': [
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'http://eslint.org/img/favicon.512x512.png',
      'height': 659,
      'highlighted': false,
      'id': 1935,
      'incognito': false,
      'index': 14,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'Configuring ESLint - ESLint - Pluggable JavaScript linter',
      'url': 'http://eslint.org/docs/user-guide/configuring',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:19:00.272Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://www.google.com.tw/images/branding/product/ico/googleg_lodp.ico',
      'height': 659,
      'highlighted': false,
      'id': 1931,
      'incognito': false,
      'index': 13,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'eslint config in packagejson - Google 搜尋',
      'url': 'https://www.google.com.tw/search?q=eslint+config+in+packagejson&oq=eslint+config+in+packagejson&aqs=chrome..69i57j0.5081j0j1&sourceid=chrome&ie=UTF-8',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:18:50.460Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://standardjs.com/favicons/favicon.ico',
      'height': 659,
      'highlighted': false,
      'id': 1923,
      'incognito': false,
      'index': 9,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'JavaScript Standard Style',
      'url': 'https://standardjs.com/',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:14:42.456Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'http://eslint.org/img/favicon.512x512.png',
      'height': 659,
      'highlighted': false,
      'id': 1911,
      'incognito': false,
      'index': 11,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'Configuring ESLint - ESLint - Pluggable JavaScript linter',
      'url': 'http://eslint.org/docs/user-guide/configuring.html#specifying-environments',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:11:43.485Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'http://eslint.org/img/favicon.512x512.png',
      'height': 659,
      'highlighted': false,
      'id': 1907,
      'incognito': false,
      'index': 6,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'Configuring ESLint - ESLint - Pluggable JavaScript linter',
      'url': 'http://eslint.org/docs/user-guide/configuring#using-the-configuration-from-a-plugin',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:11:40.153Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://assets-cdn.github.com/favicon.ico',
      'height': 659,
      'highlighted': false,
      'id': 1915,
      'incognito': false,
      'index': 12,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'globals/globals.json at master · sindresorhus/globals',
      'url': 'https://github.com/sindresorhus/globals/blob/master/globals.json',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:09:10.327Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://assets-cdn.github.com/favicon.ico',
      'height': 659,
      'highlighted': false,
      'id': 1895,
      'incognito': false,
      'index': 5,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'React is defined but never used · Issue #6 · babel/babel-eslint',
      'url': 'https://github.com/babel/babel-eslint/issues/6',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:03:16.521Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://www.google.com.tw/images/branding/product/ico/googleg_lodp.ico',
      'height': 659,
      'highlighted': false,
      'id': 1883,
      'incognito': false,
      'index': 4,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'standard h is defined but never used - Google 搜尋',
      'url': 'https://www.google.com.tw/search?q=standard+h+is+defined+but+never+used&oq=standard+h+is+defined+but+never+used&gs_l=serp.3...189240.196626.0.196783.34.33.0.0.0.0.228.3479.11j16j1.28.0....0...1.1.64.serp..6.13.1378...0j35i39k1j0i13k1j0i30k1j0i13i30k1j0i19k1j0i10i19k1j0i8i30i19k1j30i10k1.yNEl9bCWIGA',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:03:02.156Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://assets-cdn.github.com/favicon.ico',
      'height': 659,
      'highlighted': false,
      'id': 1899,
      'incognito': false,
      'index': 7,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'JSX but not React in scope · Issue #351 · standard/standard',
      'url': 'https://github.com/standard/standard/issues/351',
      'width': 1276,
      'windowId': 1616
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://assets-cdn.github.com/favicon.ico',
      'height': 659,
      'highlighted': false,
      'id': 1801,
      'incognito': false,
      'index': 0,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'developit/preact: ⚛️ Fast 3kb React alternative with the same ES6 API. Components & Virtual DOM.',
      'url': 'https://github.com/developit/preact',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T09:47:01.483Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://www.npmjs.com/static/images/touch-icons/favicon-32x32.png',
      'height': 659,
      'highlighted': false,
      'id': 1867,
      'incognito': false,
      'index': 2,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'babel-plugin-transform-react-jsx',
      'url': 'https://www.npmjs.com/package/babel-plugin-transform-react-jsx',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T09:41:38.996Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://www.google.com.tw/images/branding/product/ico/googleg_lodp.ico',
      'height': 659,
      'highlighted': false,
      'id': 1863,
      'incognito': false,
      'index': 1,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'transform-react-jsx - Google 搜尋',
      'url': 'https://www.google.com.tw/search?q=transform-react-jsx&oq=transform-react-jsx&aqs=chrome..69i57j0l5.566j0j1&sourceid=chrome&ie=UTF-8',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T09:41:34.707Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'height': 659,
      'highlighted': false,
      'id': 1939,
      'incognito': false,
      'index': 15,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'New Tab',
      'url': 'chrome://newtab/',
      'width': 1276,
      'windowId': 1616
    }
  ],
  'wantedTabs': [
    {
      'active': true,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': '',
      'height': 659,
      'highlighted': true,
      'id': 1879,
      'incognito': false,
      'index': 3,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': true,
      'status': 'complete',
      'title': 'chrome-extension://cpkpbojofdbhkelanpfgaghapgegiakf/popup.html',
      'url': 'chrome-extension://cpkpbojofdbhkelanpfgaghapgegiakf/popup.html',
      'width': 677,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:24:49.094Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://assets-cdn.github.com/favicon.ico',
      'height': 659,
      'highlighted': false,
      'id': 1887,
      'incognito': false,
      'index': 8,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'standard/standard: 🌟 JavaScript Style Guide, with linter & automatic code fixer',
      'url': 'https://github.com/standard/standard',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:22:23.297Z'
    },
    {
      'active': false,
      'audible': false,
      'autoDiscardable': true,
      'discarded': false,
      'favIconUrl': 'https://www.npmjs.com/static/images/touch-icons/favicon-32x32.png',
      'height': 659,
      'highlighted': false,
      'id': 1927,
      'incognito': false,
      'index': 10,
      'mutedInfo': {
        'muted': false
      },
      'pinned': false,
      'selected': false,
      'status': 'complete',
      'title': 'eslint-plugin-react',
      'url': 'https://www.npmjs.com/package/eslint-plugin-react',
      'width': 1276,
      'windowId': 1616,
      'lastActivedAt': '2017-07-20T10:20:20.864Z'
    }
  ]
}

render(<App data={fakeData} />, document.getElementById('container'))

// init()
//
// document.addEventListener('click', function (event) {
//   if (event.target.classList.contains('btn')) {
//     alert('Yo!')
//   }
// });

function init () {
  return fetchData()
    .then(renderToContainer)
    .then(() => {
      setInterval(fetchData, 2000)
      setInterval(() => renderToContainer(_dataBuffer), 1000)
    })
}

function fetchData () {
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

function activeTabState (data) {
  return `<div class="stateHeader">Active Tabs (${data.wantedTabs.length})</div>`
}

function activeTabs (data) {
  const sortedTabs = data.wantedTabs.sort((a, b) => {
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
