import { DEFAULT_MISSION } from './popup/Header'

function saveOptions () {
  const defaultMission = document.getElementById('defaultMission').value
  console.log(defaultMission)
  chrome.storage.sync.set({
    defaultMission
  }, function () {
    const status = document.getElementById('hint')
    status.textContent = 'Options saved.'
  })
}

function restoreOptions () {
  chrome.storage.sync.get({
    defaultMission: DEFAULT_MISSION
  }, function (items) {
    document.getElementById('defaultMission').value = items.defaultMission
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
document.getElementById('cancel').addEventListener('click', () => window.close())
