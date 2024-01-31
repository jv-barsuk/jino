const credentials = require("../../components/credentials/credentials.js")
const filters = require("../../views/helpers/filters.js")


/**
 * open an item in browser when clicked on it, 
 * uses IPC event to open in default browser
 */
function openItemInBrowser() {
  //for links to be oppened in browser

  let item = event.target.closest("LI")
  let url = `https://${credentials.getServerurl()}/browse/${item.id}`

  ipcRenderer.send("openLinkChannel", url)
  event.preventDefault()

  dbm.setIssueReadInDB(item.key);

  var key = item.key

  item.classList.remove("unread")
  item.style.display = "block"
  setTimeout(function () { filters.hideItem(key) }, 30000)
}

module.exports = {
  openItemInBrowser: openItemInBrowser
}