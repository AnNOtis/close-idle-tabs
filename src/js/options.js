function saveOptions () {
  const idleTime = parseInt(document.getElementById('idle-time').value)
  chrome.storage.sync.set({
    idleTime
  }, function () {
    const status = document.getElementById('hint')
    status.textContent = 'Options saved.'
    setTimeout(function () {
      status.textContent = ''
    }, 750)
  })
}

function restoreOptions () {
  chrome.storage.sync.get({
    idleTime: 5000
  }, function (items) {
    document.getElementById('idle-time').value = items.idleTime
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
document.getElementById('cancel').addEventListener('click', () => window.close())
